# 🚀 Transition to 8

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
| **npm** | Latest |
| **Git** | Latest |

### Installation

Clone the repository and move into the project directory:

```bash
git clone [REPO_URL]
cd [tt8]
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

```bash
# Using npm
npm install
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
# Documentation

Backend documentation uses the pdoc package. It is a bit iffy with Django, but I went with it instead of sphinx that requires the autocode and django extensions (and maybe a third one, django-autocode? I lost count).

Anyway... to set it up, in the backend\tt8_backend folder, where the **manage.py** file is, there is a small helper file. This one does the necessary actions (namely, specifying settings as well as calling django.setup()), and calls pdoc programmatically. This generates the HTML docs. 

```bash
python pdocs_helper.py
```

The output will be in the 