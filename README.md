# Real-Time Dashboard Builder

A powerful frontend tool for connecting REST APIs and visually designing dashboards with interactive widgets (charts, tables, stats, and text).

## Features

- 🔌 **API Connection Management**: Connect to multiple REST APIs with various authentication methods (Bearer Token, Basic Auth, API Key, or None)
- 📊 **Multiple Widget Types**: 
  - Charts (Line, Bar, Area, Pie)
  - Data Tables
  - Stat Cards
  - Text Widgets
- 🎨 **Drag & Drop Interface**: Intuitive grid-based layout system for arranging widgets
- 🔄 **Real-Time Updates**: Configure auto-refresh intervals for live data updates
- ⚙️ **Flexible Configuration**: Customize data paths, styling, and widget properties
- 💾 **Dashboard Management**: Create, save, and manage multiple dashboards

## Tech Stack

- **React 18** with TypeScript
- **shadcn/ui** with Tailwind CSS for beautiful, modern components
- **Redux Toolkit** with RTK Query for state management and API calls
- **React Grid Layout** for drag-and-drop dashboard layouts
- **Recharts** for data visualization
- **Vite** for fast development and building
- **Docker** for containerization

## Getting Started

### Option 1: Docker (Recommended)

#### Development with Docker

```bash
# Start development container
docker-compose up dashboard-dev

# Or run in detached mode
docker-compose up -d dashboard-dev
```

The application will be available at `http://localhost:5173`

#### Production with Docker

```bash
# Build and start production container
docker-compose up dashboard-prod

# Or run in detached mode
docker-compose up -d dashboard-prod
```

The application will be available at `http://localhost:3000`

#### Docker Commands

```bash
# Stop containers
docker-compose down

# Rebuild containers
docker-compose build

# View logs
docker-compose logs -f dashboard-dev
docker-compose logs -f dashboard-prod

# Stop specific service
docker-compose stop dashboard-dev

# Remove volumes (including node_modules volume)
docker-compose down -v
```

#### Local node_modules for IDE Support

You can install node_modules locally for IDE autocomplete and type checking while the container uses its own:

```bash
# Install locally (optional, for IDE support)
npm install

# The container will still use its own node_modules from the Docker volume
# Local node_modules won't interfere with the container
```

### Option 2: Local Development

#### Installation

```bash
npm install
```

#### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Build

```bash
npm run build
```

## Usage

1. **Create a Dashboard**: Click "New Dashboard" on the home page
2. **Add API Connections**: Click "API Connections" to add and configure REST API endpoints
3. **Add Widgets**: Use the sidebar to add widgets (Chart, Table, Stat, or Text)
4. **Configure Widgets**: Click on any widget to configure its data source and appearance
5. **Arrange Layout**: Drag and resize widgets to create your perfect dashboard layout
6. **Real-Time Updates**: Set refresh intervals in widget configuration for automatic data updates

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── widgets/        # Widget components (Chart, Table, Stat, Text)
│   ├── ApiConnectionManager.tsx
│   ├── WidgetConfigPanel.tsx
│   └── WidgetRenderer.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   └── DashboardBuilder.tsx
├── store/              # Redux store
│   ├── api/           # RTK Query API slice
│   ├── slices/        # Redux slices
│   └── index.ts
└── App.tsx            # Main app component
```

## API Connection Configuration

When adding an API connection, you can configure:

- **Base URL**: The root URL of your API
- **Authentication**: Choose from:
  - None
  - Bearer Token
  - Basic Auth (username/password)
  - API Key (with custom header name)
- **Custom Headers**: Add additional HTTP headers as needed

## Widget Configuration

Each widget can be configured with:

- **Data Source**: 
  - API Connection
  - Endpoint path
  - HTTP Method
  - Data path (JSON path for nested data)
  - Refresh interval (in seconds)
- **Widget-Specific Settings**:
  - Charts: Type, X/Y axis keys, colors
  - Tables: Column selection
  - Stats: Value path, label, color
  - Text: Content

## Docker Configuration

The project includes two Docker setups:

- **Development** (`Dockerfile.dev`): Runs Vite dev server with hot reload
- **Production** (`Dockerfile`): Builds the app and serves with nginx

The `docker-compose.yml` file provides easy management of both environments.

### Development Container Features

- Hot module replacement (HMR)
- Volume mounting for live code changes
- Port 5173 exposed for Vite dev server
- **Separate node_modules**: Container uses its own node_modules (in Docker volume), while you can have local node_modules for IDE support
  - Container node_modules: Stored in Docker volume `dashboard-node-modules`
  - Local node_modules: Install locally with `npm install` for IDE autocomplete and type checking

### Production Container Features

- Optimized nginx configuration
- Gzip compression
- Static asset caching
- SPA routing support
- Security headers

## License

MIT

