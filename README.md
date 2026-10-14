# Support Portal — Role-Based Access Control (RBAC) Architecture

A clean, responsive, enterprise support portal inspired by NHS Shared Business Services (SBS) and PowerApps Portals, featuring strict Role-Based Access Control (RBAC) across public visitors, employees, and managers.

---

## 1. Routing & Authorization Matrix

| Route Path | Page Name | Public Visitor | Employee Role | Manager Role |
| :--- | :--- | :---: | :---: | :---: |
| `/` | **Home** | Allowed | Allowed | Allowed |
| `/support/` | **My Support** | Allowed (Guest) | Allowed (Full) | Allowed (Full) |
| `/registrationrequest/` | **Registration** | Allowed | Allowed | Allowed |
| `/SignIn` | **Sign In** | Allowed | Allowed | Allowed |
| `/knowledgebase/` | **Knowledge Base** | Redirect to `/SignIn` | Allowed | Allowed |
| `/dashboard/` | **Dashboard** | Redirect to `/SignIn` | Allowed (Employee View) | Allowed (Manager View) |
| `/FasterPayment-support/` | **Faster Payments Input** | Redirect to `/SignIn` | **403 Access Denied** | Allowed |
| `/client-portal/` | **Client Portal** | Redirect to `/SignIn` | **403 Access Denied** | Allowed |
| `/maternity-support/` | **Parental Leave Input** | Redirect to `/SignIn` | **403 Access Denied** | Allowed |

---

## 2. Navigation by Authentication State & Role

### Public Visitor (Signed-Out)
Visitors see exactly:
1. **Home** — `/`
2. **My Support** — `/support/`
3. **Registration** — `/registrationrequest/`
4. **Sign in** — `/SignIn`

### Authenticated Employee
Employees see strictly:
1. **Knowledge Base** — `/knowledgebase/`
2. **My Support** — `/support/`
3. **Dashboard** — `/dashboard/`

*Manager-only options are hidden from the menu, and direct URL entry is blocked by route guards.*

### Authenticated Manager
Managers see all 6 enterprise views:
1. **Knowledge Base** — `/knowledgebase/`
2. **My Support** — `/support/`
3. **Dashboard** — `/dashboard/`
4. **Faster Payments Input** — `/FasterPayment-support/`
5. **Client Portal** — `/client-portal/`
6. **Parental Leave Input** — `/maternity-support/`

---

## 3. Demo Mode & Quick Testing

This build includes a development mode toolbar (`DemoBanner`) at the top of the interface:
- **Manager (Sarah)**: Instantly switches session to `Sarah Jenkins` (Manager, Finance & Payments).
- **Employee (David)**: Instantly switches session to `David Clarke` (Employee, Clinical Support).
- **Sign Out**: Instantly clears active session and returns to public visitor mode.
- **Direct URL Test**: Allows simulating direct URL entry into the address bar to verify that employees are blocked with a `403 Access Denied` screen when navigating to manager routes like `/FasterPayment-support/`.

---

## 4. Production Integration Guide

In a production deployment:
1. **Identity Provider**: Connect to NHS Care Identity Service (CIS2) or Microsoft Entra ID (Azure AD) via OpenID Connect (OIDC).
2. **Token Verification**: User roles are decoded and validated server-side from signed JWT claims (e.g. `roles: ["nhs.sbs.manager"]`).
3. **Backend Route Guards**: The Express / API layer validates session tokens and returns HTTP 403 Forbidden for unauthorized endpoints before sending sensitive operational payloads.
