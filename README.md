# Pet Hostel Frontend

![React](https://img.shields.io/badge/React-18%2B-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6)
![Vite](https://img.shields.io/badge/Vite-4%2B-646CFF)

Modern web interface for pet boarding management with role-based dashboards.

## ✨ Features

- **Multi-Role Dashboards**
  - Customer booking portal
  - Staff management interface
  - Admin control panel
- **Booking System**
  - Service selection and scheduling
  - Booking creation and management
- **Core Functionality**
  - Responsive user interface
  - Secure API integration
  - Form validation

## 📦 Prerequisites

- Node.js 18+
- npm 9+

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Irminsul-Devs/pet-hostel-frontend.git
   cd pet-hostel-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to set your API endpoint:
   ```ini
   VITE_API_URL=http://localhost:5000
   ```

## 🚀 Running the App

**Development server:**
```bash
npm run dev
```
Access at: `http://localhost:5173`

**Production build:**
```bash
npm run build
npm run preview
```

## 📂 Project Structure

```
pet-hostel-frontend/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (Home, Dashboards, etc.)
│   ├── routes/         # Navigation setup
│   ├── styles/         # CSS files
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔌 Backend Integration

Configure your API base URL:
```ini
VITE_API_URL=http://your-backend:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes:
   ```bash
   git commit -m 'Add meaningful message'
   ```
4. Push to branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request

## 📜 License

ISC © 2025 Irminsul Devs
