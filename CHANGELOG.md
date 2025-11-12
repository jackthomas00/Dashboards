# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-alpha] - 2025-01-27

### Added

#### Core Features
- **Dashboard Builder Interface**: Complete drag-and-drop dashboard creation system
- **Multi-Dashboard Management**: Create, save, and manage multiple dashboards from a centralized home page
- **Real-Time Data Updates**: Configurable auto-refresh intervals for live data synchronization

#### API Connection Management
- **Multiple Authentication Methods**:
  - Bearer Token authentication
  - Basic Auth (username/password)
  - API Key authentication with custom header names
  - No authentication option
- **Custom Headers Support**: Add additional HTTP headers to API requests
- **API Connection Testing**: Test API connections before using them in widgets
- **Connection Management UI**: Add, edit, and delete API connections with a user-friendly interface

#### Widget System
- **Chart Widgets**: 
  - Line charts
  - Bar charts
  - Area charts
  - Pie charts
  - Customizable X/Y axis keys
  - Color customization
- **Table Widgets**: 
  - Display tabular data from APIs
  - Column selection and configuration
- **Stat Cards**: 
  - Display single metrics or KPIs
  - Customizable labels and colors
  - JSON path support for nested data
- **Text Widgets**: 
  - Rich text display
  - Customizable content

#### Widget Configuration
- **Data Source Configuration**:
  - Select API connection
  - Configure endpoint path
  - Choose HTTP method (GET, POST, etc.)
  - Set JSON data path for nested responses
  - Configure refresh intervals (in seconds)
- **Visual Configuration**: Customize colors, labels, and display properties
- **Interactive Configuration Panel**: Drawer-based configuration interface for easy widget setup

#### Layout System
- **Drag & Drop Interface**: Intuitive grid-based layout using React Grid Layout
- **Resizable Widgets**: Resize widgets to fit your dashboard needs
- **12-Column Grid System**: Flexible grid layout for precise widget positioning
- **Responsive Layout**: Automatic layout adjustments

#### User Interface
- **Modern UI Components**: Built with shadcn/ui and Tailwind CSS
- **Drawer-Based Configuration**: Slide-out panels for widget and API configuration
- **Toast Notifications**: User feedback for actions and errors
- **Responsive Design**: Works across different screen sizes

#### Technical Infrastructure
- **React 19** with TypeScript for type-safe development
- **Redux Toolkit** with RTK Query for state management and API calls
- **Vite** for fast development and optimized production builds
- **Docker Support**:
  - Development container with hot module replacement
  - Production container with nginx
  - Separate node_modules volumes for IDE support
- **Component Library**: Comprehensive shadcn/ui component set including:
  - Buttons, Cards, Dialogs, Drawers
  - Inputs, Selects, Textareas
  - Badges, Separators, Toasts
  - Color and number inputs

#### Developer Experience
- **TypeScript**: Full type safety throughout the application
- **ESLint Configuration**: Code quality and consistency
- **Docker Compose**: Easy development and production environment setup
- **Local Development Support**: Can run with or without Docker

### Technical Details

#### State Management
- Redux store with slices for:
  - Dashboard state (widgets, layouts, dashboards)
  - API connections state
- RTK Query for efficient API data fetching and caching

#### Data Visualization
- Recharts library for chart rendering
- Support for multiple chart types and configurations

#### Routing
- React Router DOM for navigation
- Dashboard-specific routes with ID parameters

### Known Limitations

- This is an alpha release. Some features may be incomplete or subject to change
- Dashboard data is stored in browser localStorage (persistence may be limited)
- No backend integration for dashboard storage (local-only)
- No user authentication or multi-user support

### Installation & Usage

See [README.md](README.md) for detailed installation and usage instructions.

---

[0.1.0-alpha]: https://github.com/jackthomas00/Dashboards/releases/tag/v0.1.0-alpha

