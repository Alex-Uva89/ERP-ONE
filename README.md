# Erp.MOM — Mind Over Machine (MOM)

**Modular ERP System based on Quasar and Vue 3**

ErpOne is a modern ERP system designed to simplify and automate business processes. Built with cutting-edge web technologies, the frontend is developed using the **Quasar** framework, integrated with **Vue 3**, **Pinia** for state management, **Vue Router**, and localized via **Vue I18n**.

> **Mind Over Machine**: An ERP that puts intelligence at the heart of your business.

---

## 🚀 Key Features

- 🌐 Modern responsive UI (Quasar Framework)
- 🌍 Multi-language support (Vue I18n)
- 🧠 Centralized state management (Pinia)
- 📦 Modular architecture for easy feature expansion
- 🔒 Authentication-ready structure with role management
- 📈 Ideal for SMEs and growing startups

---

## 📦 Tech Stack

- **Vue 3** (Composition API)
- **Quasar 2** (with Quasar CLI)
- **Pinia** (State Management)
- **Vue Router**
- **Vue I18n**
- **Syncfusion Components** (UI Library)
- **Axios** (HTTP Client)

---

## 📁 Project Structure

```
erp.mom/
├── .quasar/ # Quasar build artifacts
├── .vscode/ # VSCode settings
├── node_modules/
├── public/ # Static assets
├── src/
│ ├── assets/ # Media assets
│ ├── boot/ # Quasar boot files
│ ├── components/ # Reusable components
│ ├── css/
│ │ └── app.scss # Global styles
│ ├── directives/ # Vue directives
│ ├── i18n/ # Localization files
│ ├── layouts/ # Application layouts
│ ├── pages/ # Route pages
│ ├── router/ # Vue Router config
│ ├── stores/ # Pinia stores
│ └── App.vue # Root component
├── .editorconfig
├── .env # Environment variables
├── .gitignore
├── .npmrc
├── .prettierrc.json # Code formatting rules
├── .routes.md # Route documentation
├── eslint.config.js # ESLint configuration
├── index.html # Entry HTML
├── jsconfig.json # JS configuration
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── quasar.config.js # Quasar configuration
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- Node.js `^18 || ^20`
- NPM `>= 8` or Yarn `>= 1.22`
- Quasar CLI (global installation recommended)

```bash
# Install Quasar CLI globally
npm install -g @quasar/cli

# Verify installation
quasar --version

# Clone repository
git clone https://github.com/your-username/erpone-quasar-frontend.git
cd erpone-quasar-frontend

# Install dependencies
npm install

# Start development server
quasar dev
```

## 🛠️ Available Commands

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `quasar dev`     | Start development server with HMR |
| `quasar build`   | Build for production              |
| `quasar lint`    | Run ESLint code validation        |
| `quasar format`  | Format code with Prettier         |
| `quasar test`    | Run Jest unit tests               |
| `quasar inspect` | Inspect webpack configuration     |
| `quasar clean`   | Clear build artifacts             |
| `quasar info`    | Display environment info          |

> **Tip**: Add `--help` to any command to see available options (e.g. `quasar dev --help`)

# 🤝 How to Contribute

Want to help make ErpOne even better? Here's how:

    🍴 Fork the project

    🌿 Create a branch (git checkout -b feature/new-feature)

    🛠️ Make your changes

    ✅ Test your changes (quasar dev)

    📬 Submit a pull request with clear description

    Before contributing, please ensure you follow our coding guidelines:

    ⚠️ naming conventions
    ⚠️ formatting standards (npm run format).

# 📬 Contacts

Sviluppatore: Alex Uva
📧 alessandro.uva@consultant.com

# 📄 License

### This project is currently private. For commercial use or licensing inquiries, please contact the author.

# 🧠 Vision

    "Mind Over Machine means control, intelligence and automation. It's not just software - it's a business management companion for the companies of tomorrow."
