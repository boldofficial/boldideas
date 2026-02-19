# Core Update: Team User Management CRUD

> **Last Updated:** 2026-01-19

---

## Overview

Implementing full CRUD operations for user management in the admin dashboard's Team page.

## Coding Rules

- **Max 150 lines per component** - Keep components small and focused
- **Use Server Actions** - No API routes
- **Use brand colors** - No hardcoded hex values
- **Modular, reusable, maintainable, scalable**
- **Use shadcn/ui** - For consistent UI components

## Color Theme Reference

| Token        | Value    |
|--------------|----------|
| brand-navy   | `#072a52` |
| brand-gold   | `#f9ba51` |
| brand-light  | `#F8FAFC` |

---

## Implementation Status

### Phase 1: Backend Actions (Server Actions)
- [x] `getUsers()` - Fetch all users
- [x] `updateUserRole()` - Change user role
- [x] `toggleUserStatus()` - Activate/deactivate user
- [x] `getUserById()` - Fetch single user by ID
- [x] `updateUser()` - Edit user details (name, bio, address, avatarUrl)
- [x] `deleteUser()` - Soft delete (sets isActive = false)
- [x] `hardDeleteUser()` - Permanent deletion from database

### Phase 2: UI Components
- [x] `UserRoleManager.tsx` - Role selector dropdown (existing)
- [x] `UserEditModal.tsx` - Modal to edit user details (104 lines)
- [x] `UserDeleteConfirm.tsx` - Confirmation dialog with soft/hard delete (85 lines)
- [x] `UserStatusToggle.tsx` - Toggle for activate/deactivate (42 lines)
- [x] `UserActionsCell.tsx` - Wrapper composing all action components (68 lines)
- [x] `TeamTable.tsx` - Main table with shadcn/ui, bulk actions (140 lines)
- [x] `TeamTableActions.tsx` - Dropdown menu per row (76 lines)
- [x] `TeamTablePagination.tsx` - Pagination with URL params (83 lines)

### Phase 3: Team Page Enhancements
- [x] shadcn/ui Table component integration
- [x] Bulk actions toolbar (deactivate, delete selected)
- [x] Pagination (20 items per page)
- [x] Checkbox selection for bulk operations
- [x] Avatar with fallback initials
- [x] Role & Status badges

### Phase 4: Migrations
- ✅ `0009_cascade_delete_users.sql` - Adds ON DELETE CASCADE/SET NULL to all user FKs

---

## Admin Dashboard Improvements

### Task Modal Centering
- [x] Fixed Task Detail Modal positioning - now properly centered vertically
- [x] Added scrollable overlay for small screen support/Created

| File | Action | Status |
|------|--------|--------|
| `src/actions/team.ts` | Added `getUserById`, `updateUser`, `deleteUser` | ✅ Done |
| `src/components/admin/UserEditModal.tsx` | Created (104 lines) | ✅ Done |
| `src/components/admin/UserDeleteConfirm.tsx` | Created (57 lines) | ✅ Done |
| `src/components/admin/UserStatusToggle.tsx` | Created (42 lines) | ✅ Done |
| `src/components/admin/UserActionsCell.tsx` | Created (68 lines) | ✅ Done |
| `src/app/admin/team/page.tsx` | Refactored (76 lines) | ✅ Done |

---

## Notes

- Following **Server Actions** pattern (no API routes)
- All components use **Tailwind CSS** with brand color variables
- All components are under **150 lines**
- Modular: Each component handles one responsibility
- Revalidation via `revalidatePath('/admin/team')`
- **Delete = Soft Delete** (sets `isActive = false`)
