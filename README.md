# 🚀 My Awesome Project

This is a **React Frontend** and **Django Backend** application.

---

## 💻 Getting Started

This guide covers the necessary steps to set up and run the entire application on your local machine.

### Prerequisites

You need the following tools installed:

| Tool | Recommended Version |
| :--- | :--- |
| **Python** | 3.x |
| **Node.js** | Use **nvm** to manage versions (LTS 16 or 18 recommended) |
| **npm** or **Yarn** | Latest |
| **Git** | Latest |

### Installation

Clone the repository and move into the project directory:

```bash
git clone [YOUR_REPO_URL]
cd [YOUR_PROJECT_NAME]
```

## ⚙️ 1. Django Backend Setup

The Django backend code is located in the root directory (where `manage.py` resides).

### A. Environment and Dependencies

1.  **Create the Virtual Environment** (named `venv`):
    ```bash
    python3 -m venv venv
    ```

2.  **Activate the Environment:**
    You must run the correct command for your shell:

    | Shell | Command |
    | :--- | :--- |
    | **Git Bash (Windows)** | `source venv/Scripts/activate` |
    | **macOS/Linux** | `source venv/bin/activate` |
    | **Windows Command Prompt** | `venv\Scripts\activate.bat` |

3.  **Install Dependencies:**
    With the virtual environment active, install all required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

### B. Run the Server

1.  **Apply Migrations:**
    Set up the database structure:
    ```bash
    python manage.py migrate
    ```

2.  **Start the Server:**
    Run the Django development server:
    ```bash
    python manage.py runserver
    ```
    The backend API should be running at `http://127.0.0.1:8000/`.

---
## 🎨 2. React Frontend Setup

The React frontend code is located in the `frontend/` subdirectory. **Make sure to change directories first!**

```bash
cd frontend/
```
## 📦 A. Install Node Modules

If you faced the `pathToFileURL` error, it's best practice to delete and reinstall your modules to ensure compatibility with your Node.js version:

1. **Clean up old modules:**
```bash
rm -rf node_modules
rm package-lock.json # or rm yarn.lock
```

2. **Install Dependencies:**
```bash
# Using npm
npm install

# OR using Yarn
# yarn install
```

## 🚀 B. Development Commands

### Run the Development Server (Dev Mode)
Starts the app with Hot Module Reloading (HMR):
```bash
npm start
```

The frontend should be accessible at `http://localhost:3000/`.

### Build for Production
Creates the final, optimized static files for deployment:
```bash
npm run build
```

## 🛑 Deactivation

When you are done working on the backend, you can deactivate the virtual environment:
```bash
deactivate
```