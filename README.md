# Introduction

Repository ini dibuat untuk memenuhi tugas Ujian Akhir Semester Mata Kuliah Sistem Pendukung Keputusan (B)

## Dosen Pengampu :
Dyah Sulistyowati R, S.Kom.,M.Kom

## Dibuat oleh :
1. Deswita Prisdei Bago - 4523210035
2. Devica Putri Hadiyanti - 4523210036
3. Kezia Annabel Sinaga - 4523210134

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# How to Run This Code? 🚀

Follow the steps below to run this project on your local machine.
⚠️ Make sure Node.js is already installed
If not, download it here: https://nodejs.org/en/download

## 1. Navigate to the project directory

Make sure you are inside the correct project folder:

`cd spk_app`

## 2. Install main dependencies

Run the following command to install all dependencies listed in package.json:

`npm install'

## 3. Install additional dependency (if missing)

Open package.json and check whether recharts exists:

`"recharts": "^3.6.0"`

If it is not listed, install it manually:

`npm install recharts`

## 4. (Optional but required if using Tailwind CSS)

Install Tailwind CSS and its dependencies:

`npm install -D tailwindcss postcss autoprefixer`

Then initialize Tailwind config:

`npx tailwindcss init -p`

Make sure your main CSS file includes:

`@tailwind base;
@tailwind components;
@tailwind utilities;`

## 5. Run the development server

Start the project locally:

`npm run dev`

Open the URL shown in the terminal (usually http://localhost:5173).
