# NEXT_30_ACTIONS

1. Commit this filled continuation pack. Why now: preserve source of truth. Dependency: none. Outcome: handoff baseline.
2. Update root `status_bundle.txt`. Why now: keep primary status current. Dependency: none. Outcome: one live state file.
3. Run `npm run lint`. Why now: syntax truth. Dependency: Node. Outcome: no parse errors.
4. Run `npm run build`. Why now: static verification. Dependency: Node. Outcome: required files and domain analysis pass.
5. Run `npm test`. Why now: scoring truth. Dependency: Node. Outcome: domain tests pass.
6. Decide persistence target. Why now: in-memory blocks pilot. Dependency: owner decision. Outcome: storage path.
7. Implement persistence adapter. Why now: save real profiles/scans. Dependency: action 6. Outcome: durable data.
8. Add profile persistence tests. Why now: prevent data loss regressions. Dependency: action 7. Outcome: verified storage.
9. Define auth-light strategy. Why now: real users need identity. Dependency: owner decision. Outcome: auth plan.
10. Implement auth/session skeleton. Why now: separate users. Dependency: action 9. Outcome: basic user boundary.
11. Define privacy data inventory. Why now: browsing data is sensitive. Dependency: product decision. Outcome: allowed data list.
12. Add consent screen/setting. Why now: extension capture must be explicit. Dependency: action 11. Outcome: consented capture.
13. Add export endpoint. Why now: user data rights. Dependency: persistence. Outcome: user can export data.
14. Add delete endpoint. Why now: user data rights. Dependency: persistence. Outcome: user can delete data.
15. Connect extension to API. Why now: real ingestion loop. Dependency: consent and persistence. Outcome: captured page context.
16. Add extension local test notes. Why now: repeatable QA. Dependency: action 15. Outcome: install/test guide.
17. Add API route tests. Why now: backend confidence. Dependency: current server. Outcome: route-level coverage.
18. Add request validation helpers. Why now: consistency. Dependency: API route review. Outcome: less duplicated validation.
19. Add request IDs to all API responses. Why now: observability. Dependency: server helper. Outcome: traceable calls.
20. Add structured logs. Why now: debugging. Dependency: request IDs. Outcome: readable runtime logs.
21. Choose hosting target. Why now: CI/deploy path. Dependency: owner decision. Outcome: deploy plan.
22. Add CI workflow. Why now: prevent broken pushes. Dependency: GitHub repo. Outcome: automated lint/build/test.
23. Deploy staging. Why now: prove hosted runtime. Dependency: hosting target. Outcome: public test URL.
24. Run browser smoke on staging. Why now: deployment truth. Dependency: staging. Outcome: verified demo.
25. Run mobile viewport smoke. Why now: PWA claim. Dependency: staging/local app. Outcome: mobile readiness notes.
26. Add OpenAPI document. Why now: API handoff. Dependency: route stability. Outcome: API contract artifact.
27. Add retention policy doc. Why now: privacy readiness. Dependency: data inventory. Outcome: clear retention rule.
28. Add backup/restore plan. Why now: persistence risk. Dependency: storage choice. Outcome: recovery path.
29. Prepare pilot checklist. Why now: avoid premature launch. Dependency: actions 6-28. Outcome: pilot gate.
30. Decide next product milestone. Why now: avoid scope drift. Dependency: owner review. Outcome: focused roadmap.
