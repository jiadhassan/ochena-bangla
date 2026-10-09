# Security Specification

## 1. Data Invariants
- Each user profile document in `/users/{userId}` belongs exclusively to the authenticated user whose `request.auth.uid == userId`.
- A user can only read, create, or update their own `/users/{userId}` profile document.
- `visitedDistricts` array must not exceed 64 elements (representing the 64 districts of Bangladesh).
- Public shared maps `/shared_maps/{mapId}` can be read by anyone, but created/updated only by the authentic author matching `request.auth.uid`.

## 2. The Dirty Dozen Payloads
1. Writing to `/users/{userId}` with an unauthenticated session.
2. Writing to `/users/{otherUser}` where `request.auth.uid != otherUser`.
3. Writing a user profile with `visitedDistricts` array containing more than 64 items.
4. Setting an invalid `themeId` that is not in the allowed list (`emerald`, `navy`, `coral`, `cyan`, `forest`).
5. Overwriting `userId` field to a different UID on update.
6. Creating a `/shared_maps/{mapId}` with an author `userId` different from `request.auth.uid`.
7. Updating a `/shared_maps/{mapId}` by a non-owner.
8. Deleting a `/shared_maps/{mapId}` by a non-owner.
9. Injecting a 10MB junk payload into `travelerName`.
10. Attempting to list all users from `/users` as an unauthenticated or general user.
11. Path poisoning with invalid characters in `{userId}` or `{mapId}`.
12. Creating orphaned documents without required fields.
