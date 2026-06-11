# Graph Report - waiz-new-portfolio-with-chatbot  (2026-06-03)

## Corpus Check
- 120 files · ~2,855,344 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 233 nodes · 277 edges · 10 communities detected
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `sql()` - 28 edges
2. `GET()` - 23 edges
3. `POST()` - 22 edges
4. `showToast()` - 18 edges
5. `DELETE()` - 15 edges
6. `PUT()` - 13 edges
7. `PATCH()` - 10 edges
8. `getChatResponse()` - 10 edges
9. `handleDelete()` - 8 edges
10. `requireAdmin()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `middleware()` --calls--> `GET()`  [INFERRED]
  middleware.ts → app\api\portal\projects\route.ts
- `GET()` --calls--> `getNeonSql()`  [INFERRED]
  app\api\portal\projects\route.ts → E:\portfolio-waiz\protfolio\waiz-new-portfolio-with-chatbot\lib\neon.ts
- `GET()` --calls--> `sql()`  [INFERRED]
  app\api\portal\projects\route.ts → E:\portfolio-waiz\protfolio\waiz-new-portfolio-with-chatbot\lib\neon.ts
- `getAuditContext()` --calls--> `GET()`  [INFERRED]
  lib\audit.ts → app\api\portal\projects\route.ts
- `getUserIdFromHeaders()` --calls--> `GET()`  [INFERRED]
  lib\audit.ts → app\api\portal\projects\route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (26): getAuditContext(), getUserIdFromHeaders(), logAudit(), test(), checkData(), checkSchema(), checkProjects(), checkProjects() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (13): fetchPortalData(), handleCopyLink(), handleDelete(), handleSave(), handleSaveChatbot(), handleSaveSiteInfo(), handleUpload(), markProcessed() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (8): getChatResponse(), runComprehensiveTests(), debug(), testChat(), testChat(), runTests(), verifyMemory(), verifyBot()

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (2): GET(), POST()

### Community 4 - "Community 4"
Cohesion: 0.23
Nodes (11): decodeBase64Url(), encodeBase64Url(), getJwtSecret(), signJWT(), verifyJWT(), verifyToken(), getRequiredRole(), hasRequiredRole() (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (2): checkUser(), handleAuthChange()

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (1): migrate()

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (1): handleSubmit()

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (1): extractResume()

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (1): runCMSMigration()

## Knowledge Gaps
- **Thin community `Community 3`** (17 nodes): `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `GET()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (6 nodes): `checkUser()`, `handleAuthChange()`, `handleChange()`, `handleSubmit()`, `triggerAuth()`, `Contact.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (5 nodes): `projects.ts`, `migrate-to-neon.mjs`, `migrate-to-neon.ts`, `getCwd()`, `migrate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (3 nodes): `page.tsx`, `page.tsx`, `handleSubmit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (3 nodes): `extract-resume.js`, `extract-resume.mjs`, `extractResume()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (3 nodes): `runCMSMigration()`, `migrate-cms.mjs`, `migrate-cms.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sql()` connect `Community 0` to `Community 2`, `Community 3`, `Community 4`, `Community 8`, `Community 16`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Why does `getChatResponse()` connect `Community 2` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 3` to `Community 0`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Are the 26 inferred relationships involving `sql()` (e.g. with `GET()` and `DELETE()`) actually correct?**
  _`sql()` has 26 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `GET()` (e.g. with `middleware()` and `getNeonSql()`) actually correct?**
  _`GET()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `POST()` (e.g. with `getNeonSql()` and `sql()`) actually correct?**
  _`POST()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `DELETE()` (e.g. with `getNeonSql()` and `sql()`) actually correct?**
  _`DELETE()` has 5 INFERRED edges - model-reasoned connections that need verification._