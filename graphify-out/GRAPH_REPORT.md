# Graph Report - waiz-new-portfolio-with-chatbot  (2026-04-22)

## Corpus Check
- 71 files · ~2,822,163 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 134 nodes · 107 edges · 8 communities detected
- Extraction: 73% EXTRACTED · 27% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 24|Community 24]]

## God Nodes (most connected - your core abstractions)
1. `sql()` - 22 edges
2. `getChatResponse()` - 10 edges
3. `POST()` - 6 edges
4. `runTests()` - 4 edges
5. `getNeonSql()` - 3 edges
6. `testChat()` - 3 edges
7. `test()` - 3 edges
8. `migrate()` - 3 edges
9. `handleSubmit()` - 2 edges
10. `checkUser()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `sql()` --calls--> `main()`  [INFERRED]
  lib\neon.ts → scripts\debug-db.ts
- `POST()` --calls--> `getNeonSql()`  [INFERRED]
  app\api\chat\route.ts → lib\neon.ts
- `POST()` --calls--> `sql()`  [INFERRED]
  app\api\chat\route.ts → lib\neon.ts
- `sql()` --calls--> `getChatResponse()`  [INFERRED]
  lib\neon.ts → lib\ai\chatbot.ts
- `sql()` --calls--> `test()`  [INFERRED]
  lib\neon.ts → scratch\check-counts.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (17): test(), checkData(), checkSchema(), checkProjects(), checkProjects(), checkProjects(), listAllImages(), checkResume() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (9): getChatResponse(), runComprehensiveTests(), debug(), POST(), testChat(), testChat(), runTests(), verifyMemory() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (2): checkUser(), handleAuthChange()

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (1): migrate()

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (1): handleSubmit()

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (1): test()

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (1): extractResume()

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (1): main()

## Knowledge Gaps
- **Thin community `Community 2`** (6 nodes): `Contact.tsx`, `checkUser()`, `handleAuthChange()`, `handleChange()`, `handleSubmit()`, `triggerAuth()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (5 nodes): `projects.ts`, `getCwd()`, `migrate()`, `migrate-to-neon.mjs`, `migrate-to-neon.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (3 nodes): `page.tsx`, `page.tsx`, `handleSubmit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (3 nodes): `test-connection.js`, `test-connection.ts`, `test()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (3 nodes): `extractResume()`, `extract-resume.js`, `extract-resume.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `main()`, `debug-db.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sql()` connect `Community 0` to `Community 8`, `Community 1`, `Community 5`, `Community 24`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Why does `getChatResponse()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `migrate()` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `sql()` (e.g. with `POST()` and `getChatResponse()`) actually correct?**
  _`sql()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `getChatResponse()` (e.g. with `POST()` and `sql()`) actually correct?**
  _`getChatResponse()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `POST()` (e.g. with `getNeonSql()` and `sql()`) actually correct?**
  _`POST()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._