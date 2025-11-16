# Beauty Salon Calendar Management Application

## Overview
A comprehensive calendar management application for beauty salons built with Vue 3, TypeScript, Firebase, and TailwindCSS. The application supports a multi-language interface (English, Spanish, Russian), role-based access control, and provides features for managing appointments, masters, salons, and clients.

The project aims to deliver a robust and user-friendly system for beauty salon management, offering core functionalities for appointment scheduling and administration. Future ambitions include advanced calendar features, real-time updates, a client booking flow, and comprehensive analytics.

## User Preferences
- **Theme**: Supports light and dark modes
- **Languages**: English, Spanish, Russian
- **Validation**: All forms use VeeValidate with Yup schemas
- I want iterative development.
- Ask before making major changes.

## System Architecture
The application is a Vue 3 single-page application (SPA) using TypeScript for type safety and Pinia for state management. Firebase provides backend services for authentication and Firestore for data storage (planned). TailwindCSS is used for utility-first styling, ensuring a consistent and responsive UI. Vue Router handles navigation with role-based access control.

### UI/UX Decisions
- **Multi-language Interface**: Supports English, Spanish, and Russian with `vue-i18n`.
- **Theme Management**: Users can switch between light and dark modes.
- **Form Validation**: Consistent validation across all forms using `VeeValidate` and `Yup`.
- **Calendar Views**: Provides Month, Week, and Day views with drag-and-drop functionality for appointments.
- **Data Tables**: A universal `BaseDataTable` component offers sorting, pagination, and two view modes (table/grid) for managing lists of masters, clients, and salons.
- **Accessibility**: Dark theme contrast improvements for WCAG compliance.
- **Icons**: Uses `@heroicons/vue` for navigation and UI elements.

### Technical Implementations
- **Frontend Framework**: Vue 3 + TypeScript + Vite.
- **State Management**: Pinia stores for authentication, user data, calendar state, UI settings, and notifications.
- **Routing**: Vue Router 4 with role-based guards (admin, manager, master, client).
- **Date Handling**: `date-fns` for locale-aware date formatting and manipulation, particularly for calendar functionality.
- **Component Library**: A comprehensive set of base UI components (buttons, form inputs, modals, layout pieces) for reusability and consistency.
- **Notifications**: A standardized notification system for user feedback on actions.

### Feature Specifications
- **Authentication**: User login, registration, password reset, and role-based authorization.
- **User Profile Management**: Users can edit personal info, preferences (language, theme), and notification settings.
- **Appointment Management**:
    - Create, edit, and delete appointments via an `AppointmentModal`.
    - Display appointments on calendar grids with status-based color coding.
    - Filter appointments by master and status.
    - Drag-and-drop rescheduling in Week and Day views with 15-minute precision and duration preservation.
- **Master, Salon, Client Management**: CRUD operations for masters, salons, and clients, with dedicated list and detail pages.
- **Internationalization**: Full i18n support for all UI text, form fields, validation messages, and date formats.

### System Design Choices
- **Modular Structure**: Organized directory structure with clear separation of components, layouts, pages, stores, services, and utilities.
- **Role-Based Access Control (RBAC)**: Implemented at the routing level to restrict access based on user roles (admin, manager, master, client).
- **Reactive Data Flow**: Utilizes Vue's reactivity system and Pinia for efficient state management and UI updates.

## External Dependencies
- **Firebase**:
    - Authentication (for user login, registration, password reset).
    - Firestore (planned for data persistence for appointments, masters, salons, clients).
- **TailwindCSS v3**: Utility-first CSS framework for styling.
- **VeeValidate** and **Yup**: For form validation.
- **vue-i18n**: For multi-language support.
- **Vue Router 4**: For client-side routing.
- **Pinia**: For state management.
- **date-fns**: For date manipulation and formatting.
- **@heroicons/vue**: For UI icons.
- **@vueuse/core**: For utility functions like `onClickOutside`.