# Pocket Password Mode

Pocket now has a small app launcher for Rippling, ServiceNow and Workday. Existing Onboard, Offboard and Ask flows remain available. Password Mode is off by default; the toggle updates the bookmark URL.

## Bookmarks

- `/pocket?passwordMode=1&app=rippling`
- `/pocket?passwordMode=1&app=servicenow`
- `/pocket?passwordMode=1&app=workday`

Use `rippling.demo@example.test`, `servicenow.demo@example.test` or `workday.demo@example.test` respectively. All use the public sample password `CompoundDemo!2026`. These are synthetic fixtures, not accounts at the named vendors. Do not enter real credentials.

## Browser test

1. Open the chosen bookmark in a normal Chrome profile, with saving passwords enabled.
2. Enter its sample credentials and sign in. If Chrome offers, save the demo login.
3. Sign out, reopen the bookmark and use Chrome’s suggested login to sign in again.
4. Repeat in a second profile. Each profile owns its own saved passwords and demo session.
5. Try a wrong password and another app’s username: both must stay on the sign-in form. Switch apps and check their demo sessions remain separate.

The form uses stable names, `autocomplete="username"` and `autocomplete="current-password"`, native validation and an explicit submit button. Successful submission navigates to the workspace. Chrome decides whether to offer password saving/autofill; automated form tests do not prove the browser’s password UI.

All apps live on the same Compound origin: they are not isolated vendor domains and Chrome may offer multiple demo usernames. Use separate profiles for isolation. Workbench may coordinate bookmarks/tabs across connected profiles but does not copy passwords or login sessions. A Google sign-in is not required to test local password saving.

## Data and scope

No authentication endpoint, password storage, account creation or vendor service is added. Credentials are compared with public fixtures entirely in the page. Only an app-scoped `1` marker is retained in sessionStorage; no username or password is included in storage, URLs or network requests by this feature. Blocked storage falls back to a page-only demo session. Sign-out removes the marker. This is a demonstration, never an access-control boundary or a secure employee portal. Existing public product studies remain accessible.

The URL flag is exactly `passwordMode=1`; unknown app IDs fall back to Rippling. Copy bookmark creates only the supported app/flag URL, without copying unrelated query data.

## Validation for this release

Production build and all 128 Node tests pass. Chrome UI checks passed for all three successful sign-ins, wrong-password rejection, sign-out, app separation and turning Password Mode off. The form was visually checked at 390 × 844. Chrome's actual Save password and autofill prompts still require user acceptance testing in the intended profiles; do not infer that from these checks.
