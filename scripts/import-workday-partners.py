#!/usr/bin/env python3
"""Refresh the public Workday Services directory snapshot. No credentials are stored.

Uses the public search configuration shipped to every directory visitor, then the
same public profile endpoint as the directory. Fails closed on incomplete imports.
Run with --cache /tmp to reuse the research files gathered on 10 September 2026.
"""
import argparse
import concurrent.futures
import datetime
import html
import json
import re
import time
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DIRECTORY = 'https://marketplace.workday.com/en-US/pages/find-a-partner/listing'
PROFILE_API = 'https://marketplace.workday.com/api/custom/workday/v1/company/'


def read_url(url, body=None, headers=None):
    data = json.dumps(body).encode() if body is not None else None
    req = Request(url, data=data, headers=headers or {})
    with urlopen(req, timeout=45) as response:
        return response.read().decode()


def roster():
    page = read_url(DIRECTORY)
    scripts = re.findall(r'<script[^>]+src="([^"]+)"', page)
    config = None
    for url in scripts:
        if 'cloudfront.net' not in url:
            continue
        script = read_url(url)
        config = re.search(r'hx=\{.*?prod:\{organizationId:"([^"]+)",accessToken:"([^"]+)",searchHub:"([^"]+)"', script)
        if config:
            break
    if not config:
        raise RuntimeError('Public search configuration changed; review the importer before refreshing.')
    org, token, hub = config.groups()
    result = json.loads(read_url(f'https://{org}.org.coveo.com/rest/search/v2?organizationId={org}', {
        'searchHub': hub, 'pipeline': 'Martech - Solutions Marketplace Services',
        'cq': '@appdirect_enabled_with_partner_finder==("true")',
        'aq': '@appdirect_comp_partner_type_custom==("Services")',
        'numberOfResults': 1000, 'firstResult': 0,
    }, {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}))
    if result.get('totalCount') != len(result.get('results', [])):
        raise RuntimeError('Incomplete search results; no snapshot was written.')
    return result


def clean(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', str(value or '')))).strip()


def strings(value):
    return list(dict.fromkeys(clean(v) for v in (value or []) if clean(v))) if isinstance(value, list) else []


SERVICES = {
    'Deployment': r'\b(?:deployments?|deploying|deployed|implementations?|implementing)\b',
    'Application Management Services': r'\bAMS\b|application management|managed (?:services|support)|post[- ](?:production|deployment|go[- ]live)|ongoing (?:maintenance|support)|production support',
    'Advisory': r'\badvisory\b|strategic (?:guidance|consulting)|change management|readiness|roadmap',
    'Staffing': r'\bstaffing\b|staff augmentation|recruitment (?:firm|consultants)|permanent hiring|talent acquisition.*consulting',
}
PRODUCTS = {
    'Human Capital Management': r'\bHCM\b|human capital management',
    'Financial Management': r'financial management|\bfinancials\b|Workday FINS',
    'Workday Adaptive Planning': r'\bAdaptive Planning\b',
    'Payroll': r'\bpayroll\b',
    'Extend': r'Workday Extend|\bExtend apps\b|\bExtend applications\b',
    'Student': r'Workday (?:HCM, Financials, and |HCM, Finance, and )?Student|\bStudent solutions\b',
    'Peakon': r'\bPeakon\b',
    'Accounting Center': r'\bAccounting Cent(?:er|re)\b',
    'Strategic Sourcing Expert': r'\bStrategic Sourcing\b',
    'Workday VNDLY': r'\bVNDLY\b',
    'Prism Analytics': r'\bPrism\b',
    'Contract Intelligence': r'\bEvisort\b|\bContract Intelligence\b',
    'Labor Optimization': r'\bLabor Optimization\b',
}
PRODUCT_KEYS = {'Human Capital Management':'hcm','Financial Management':'finance','Workday Adaptive Planning':'adapt_plan','Payroll':'payroll','Extend':'extend','Student':'student','Peakon':'peakon','Accounting Center':'accounting','Strategic Sourcing Expert':'strat_sourcing','Workday VNDLY':'vndly','Labor Optimization':'labor'}


def normalize(record, profile):
    raw = record['raw']
    attrs = {a['name']: a.get('value') if a.get('value') is not None else a.get('valueKeys') for a in profile['customAttributes']}
    name = clean(attrs.get('company_nick_name') or raw.get('appdirect_company_nick_name') or profile['name'])
    description = clean(attrs.get('partner_full_description'))
    declared_services = strings(attrs.get('service_type'))
    # Do not infer the services of a staffing firm from its description of clients' projects.
    staffing_firm = bool(re.search(r'(?:Staffing [Pp]artner|staffing (?:firm|provider)|recruitment firm|staff augmentation)', description))
    tags = []
    for label, pattern in SERVICES.items():
        if label in declared_services:
            tags.append({'name':label, 'basis':'directory'})
        elif re.search(pattern, description, re.I) and not (staffing_firm and label in ('Deployment','Application Management Services')):
            if profile['name'] == 'Caber Resource Group' and label != 'Staffing':
                continue
            tags.append({'name':label, 'basis':'profile'})
    # Reviewed false positives: AMS is also a company name; staffing can describe
    # a software feature; client-side readiness does not establish deployment delivery.
    excluded = {
        'Alexander Mann Solutions Limited (AMS)': ['Application Management Services'],
        'TeamBuilder, LLC': ['Staffing'],
        'WDMarketdesk, LLC': ['Deployment'],
    }.get(profile['name'], [])
    tags = [tag for tag in tags if tag['basis']=='directory' or tag['name'] not in excluded]
    scope = []
    for kind, key, prefix in [('Deployment','services_deployment_competencies','deployment'),('Application Management Services','services_ams_competencies','ams')]:
        for product in strings(attrs.get(key)):
            suffix = PRODUCT_KEYS.get(product)
            scope.append({'service':kind,'product':product,'regions':strings(attrs.get(f'{prefix}_{suffix}_geos')) if suffix else []})
    product_tags = []
    for label, pattern in PRODUCTS.items():
        if any(item['product'] == label for item in scope):
            product_tags.append({'name':label,'basis':'directory'})
        elif re.search(pattern, description, re.I):
            product_tags.append({'name':label,'basis':'profile'})
    # These are declared coverage fields, never headquarters or guessed delivery locations.
    regions = strings(attrs.get('service_supported_regions'))
    other_regions = strings(attrs.get('RegionSupported'))
    all_regions = list(dict.fromkeys(regions + other_regions))
    normalized_regions = set()
    for region in all_regions:
        if region in ('Global','EMEA','North America','APAC'): normalized_regions.add(region)
        elif region in ('APJ','Japan','Australia','New Zealand','Asia Pacific'): normalized_regions.add('APAC')
        elif region in ('Canada','United States of America','United States'): normalized_regions.add('North America')
        elif region in ('UK','United Kingdom','Europe','Germany','France'): normalized_regions.add('EMEA')
        elif region in ('Latin America','LATAM'): normalized_regions.add('Latin America')
    industries = list(dict.fromkeys(strings(attrs.get('service_industries')) + strings(attrs.get('industriesSupported'))))
    website = clean(profile.get('website'))
    if website and not website.startswith(('https://','http://')): website='https://'+website
    if website:
        url = urlparse(website)
        if not url.hostname or url.username or url.password or url.scheme not in ('http','https'):
            website=''
    intro = clean(attrs.get('partner_short_description') or description)
    words = intro.split()
    # Short attributed excerpt only; never republish the complete marketing copy.
    excerpt = ' '.join(words[:20]) + ('…' if len(words)>20 else '')
    ident = profile['uuid']
    slug = re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')
    return {'id':ident,'slug':slug,'name':name,'legalName':clean(profile['name']),
        'partnerTypes':strings(attrs.get('partner_type')),'services':tags,'products':product_tags,
        'regions':sorted(normalized_regions),'regionLabels':all_regions,'industries':industries,
        'scope':scope,'excerpt':excerpt,'website':website,
        'sourceUrl':record['clickUri'],'dataUrl':PROFILE_API+ident}


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--cache',type=Path,help='Use an existing research cache containing workday-services-search.json and workday-partner-profiles/.')
    args=parser.parse_args()
    search=json.loads((args.cache/'workday-services-search.json').read_text()) if args.cache else roster()
    records=search['results']
    if search['totalCount']!=len(records):raise RuntimeError('Roster count mismatch')
    # Reprocessing cached evidence must not make an old snapshot look freshly checked.
    checked_at=datetime.datetime.now(datetime.timezone.utc)
    if args.cache:
        evidence_files=[args.cache/'workday-services-search.json'] + [
            args.cache/'workday-partner-profiles'/f"{parse_qs(urlparse(record['clickUri']).query)['vendor'][0]}.json"
            for record in records]
        checked_at=datetime.datetime.fromtimestamp(min(path.stat().st_mtime for path in evidence_files),datetime.timezone.utc)
    def get(record):
        ident=parse_qs(urlparse(record['clickUri']).query)['vendor'][0]
        if args.cache:profile=json.loads((args.cache/'workday-partner-profiles'/f'{ident}.json').read_text())
        else:
            for attempt in range(3):
                try:
                    profile=json.loads(read_url(PROFILE_API+ident,headers={'AD-Tenant':'WORKDAY'}))
                    break
                except Exception:
                    if attempt==2:raise
                    time.sleep(2)
        if profile['uuid']!=ident:raise RuntimeError('Profile identity mismatch')
        return normalize(record,profile)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:partners=list(pool.map(get,records))
    partners.sort(key=lambda p:p['name'].casefold())
    if len({p['id'] for p in partners})!=len(partners) or len({p['slug'] for p in partners})!=len(partners):raise RuntimeError('Duplicate identities; review before importing')
    data={'checkedAt':checked_at.isoformat(timespec='seconds'),'directoryUrl':DIRECTORY+'#f-appdirect_comp_partner_type_id=Services','directoryTotal':search['totalCount'],'scope':'All publicly listed Services partners in the Workday Marketplace directory. Includes integrators, advisory and staffing firms. Independent firms outside this directory are not covered.','partners':partners}
    target=ROOT/'lib/data/workday-partners.json'
    target.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(f'Imported {len(partners)} partners into {target.relative_to(ROOT)}')
    print('Service signals:',{s:sum(any(t['name']==s for t in p['services']) for p in partners) for s in SERVICES})
    print('Published regions:',sum(bool(p['regions']) for p in partners))

if __name__=='__main__':main()
