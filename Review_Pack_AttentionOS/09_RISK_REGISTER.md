# 09 Risk Register

| ID | Risk | Severity | Likelihood | Status | Owner | Mitigation |
|---|---|---|---|---|---|
| R-001 | Prototype mistaken for production-ready | High | Medium | Open | Product/Tech | Keep status bundle and pilot gate visible |
| R-002 | Real user data captured without legal/privacy review | Critical | Medium | Partially mitigated | Product/Legal/Tech | Consent/export/delete implemented; legal copy still needed |
| R-003 | JSON store not enough for multi-user hosted pilot | High | Medium | Open | Tech | Move to production DB if pilot grows beyond local/single-node |
| R-004 | Local session boundary mistaken for production auth | High | Medium | Open | Tech | Add production auth provider before public release |
| R-005 | Browser extension capture not manually verified | High | Medium | Open | Tech/QA | Perform extension install/capture smoke |
| R-006 | Scoring formula feels arbitrary | Medium | High | Open | Product | Calibrate with pilot users and add score explanation |
| R-007 | Dependency/package-manager instability returns | Medium | Medium | Mitigated | Tech | Keep no-dep runtime until stack decision |
| R-008 | CI not run remotely yet | Medium | Medium | Partially mitigated | Tech | Workflow exists; verify on GitHub push/PR |
| R-009 | No hosted deployment target delays pilot | Medium | Medium | Open | Tech/Product | Use `docs/PILOT_DEPLOYMENT_PLAN.md` |
| R-010 | Future UI changes reintroduce XSS | High | Medium | Mitigated now | Tech | Current templates escape; keep XSS review in checklist |

## Top Three To Resolve First
1. Hosted staging deployment and manual smoke.
2. Production auth/database decision.
3. Legal/privacy copy review for real data collection.
