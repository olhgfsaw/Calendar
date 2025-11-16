# Beauty Salon Calendar Management Application

## Overview
A comprehensive calendar management application for beauty salons built with Vue 3, TypeScript, Firebase, and TailwindCSS. The application supports multi-language interface (English, Spanish, Russian), role-based access control, and provides features for managing appointments, masters, salons, and clients.

**Status**: Initial MVP setup complete  
**Last Updated**: November 16, 2025

## Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: TailwindCSS v3
- **State Management**: Pinia
- **Internationalization**: vue-i18n
- **Form Validation**: VeeValidate + Yup
- **Router**: Vue Router 4

## Recent Changes

### November 16, 2025 - MVP Setup Complete
- ✅ Created complete UI component library (buttons, forms, modals, layout pieces)
- ✅ Implemented authentication flow with VeeValidate integration
- ✅ Added role-based routing with permission checks
- ✅ Created auth pages: Login, Join (Register), ForgotPassword, Forbidden
- ✅ Implemented DefaultLayout with Avatar, NotificationBell, ThemeToggle, LanguageSwitcher
- ✅ Fixed TailwindCSS configuration issues
- ✅ Configured dev server on port 5000

## Project Architecture

### Directory Structure
```
src/
├── components/
│   └── base/
│       ├── buttons/         # PrimaryButton, IconButton, TextButton
│       ├── forms/           # BaseInput, BaseTextarea, BaseSelect, BaseCheckbox, BaseSwitch
│       ├── modals/          # BaseModal, ConfirmModal
│       └── layoutPieces/    # Logo, Avatar, NotificationBell, ThemeToggle, LanguageSwitcher
├── layouts/
│   ├── DefaultLayout.vue    # Main application layout
│   └── AuthLayout.vue       # Authentication pages layout
├── pages/
│   ├── LoginPage.vue        # User login
│   ├── JoinPage.vue         # User registration
│   ├── ForgotPasswordPage.vue
│   ├── CalendarPage.vue     # Main calendar view
│   ├── Forbidden.vue        # 403 Access Denied
│   └── NotFound.vue         # 404 Page
├── router/
│   └── index.ts             # Vue Router with role-based guards
├── stores/
│   ├── auth.ts             # Authentication state
│   ├── user.ts             # User data management
│   ├── calendar.ts         # Calendar state
│   ├── ui.ts               # UI state (theme, sidebar, language)
│   └── notifications.ts    # Toasts and notifications
├── services/
│   ├── firebase.ts         # Firebase configuration
│   └── permission.ts       # Role-based permission checks
├── utils/
│   ├── validators.ts       # Yup validation schemas
│   └── date.ts            # Date formatting utilities
├── i18n/
│   └── index.ts           # Multi-language configuration
└── types/
    └── index.ts           # TypeScript type definitions
```

### User Roles
- **admin**: Full access to all features
- **manager**: Salon management, appointments
- **master**: View and manage own appointments
- **client**: Book and view own appointments

### Routing
All routes support role-based access control:
- `/login` - Login page (public)
- `/join` - Registration page (public)
- `/forgot-password` - Password reset (public)
- `/calendar` - Main calendar view (requires: admin, manager, master)
- `/forbidden` - Access denied page
- `/` - Redirects to calendar

## User Preferences
- **Theme**: Supports light and dark modes
- **Languages**: English, Spanish, Russian
- **Validation**: All forms use VeeValidate with Yup schemas

## Configuration

### Environment Variables Needed
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_PROJECT_ID=your_project_id
SESSION_SECRET=already_configured
```

### Development Server
- Port: 5000
- Command: `npm run dev`
- Vite configured to allow all hosts for Replit environment

## Known Issues & Next Steps

### Required for Production
1. **Firebase Credentials**: Add Firebase configuration via Replit secrets
2. **Email Templates**: Configure Firebase email templates for password reset
3. **Role Assignment**: Implement admin interface for assigning user roles

### Future Enhancements
1. Complete calendar functionality (drag-and-drop, month/week/day views)
2. Masters management pages
3. Salons management pages
4. Clients management pages
5. Appointment booking flow
6. Real-time updates with Firebase listeners
7. Mobile-responsive design optimization
8. Unit and E2E tests

## Development Notes
- Using TailwindCSS v3 (not v4) for PostCSS compatibility
- VeeValidate integrated in all authentication forms
- Firebase integration ready, waiting for credentials
- Dev server runs on port 5000 (required for Replit webview)
