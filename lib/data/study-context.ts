import { companyStudy } from '../companies';
import { EMPLOYEES } from './employees';
import { workdayContextHref } from './workday-scenario';

/** Carry a registered screen through its explanation, never across companies. */
export function studyContextHref(href: string, currentPath: string, params: Pick<URLSearchParams, 'get'>) {
  const match = currentPath.match(/^\/companies\/([^/]+)\/(app|backstage)(?:\/(.*))?$/);
  if (!match || href.includes('?')) return href;
  const company = companyStudy(match[1]);
  const base = `/companies/${match[1]}/`;
  if (!company || !href.startsWith(base)) return href;
  const contextual = company.id === 'workday' ? workdayContextHref(href, currentPath, params) : href;
  const [target, ...fragment] = contextual.split('#');
  const [path, query = ''] = target.split('?');
  if (path !== `${base}app` && !path.startsWith(`${base}app/`) && path !== `${base}backstage` && !path.startsWith(`${base}backstage/`)) return href;
  const screen = match[2] === 'app' ? match[3] ?? '' : params.get('appScreen') ?? '';
  const worker = company.id === 'rippling' && EMPLOYEES.some(person => screen === `people/${person.id}`);
  const valid = screen !== '' && (company.appScreens.includes(screen) || worker);
  const q = new URLSearchParams(query);
  let destination = path;
  if (valid && (path === `${base}backstage` || path.startsWith(`${base}backstage/`))) q.set('appScreen', screen);
  if (valid && match[2] === 'backstage' && path === `${base}app`) destination = `${base}app/${screen}`;
  return `${destination}${q.size ? `?${q}` : ''}${fragment.length ? `#${fragment.join('#')}` : ''}`;
}
