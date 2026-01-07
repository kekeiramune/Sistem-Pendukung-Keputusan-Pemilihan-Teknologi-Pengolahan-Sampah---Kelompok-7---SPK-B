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

Follow these step by step and instructions so you can run this code on your own device (p.s make sure you already have node.js installed, if not, you may visit this link : https://nodejs.org/en/download) :

## 1. make sure you're in the right project folder

`cd spk_app`

## 2. run npm install in your terminal

`npm install'

## 3. install addition dependency (if there's a missing dependency)

click the package.json and check if there's something like this :

`"recharts": "^3.6.0"`

if not, you may install the dependency first :

`npm install recharts`

## 4. optional (but needed)

`npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p`

## 5. you're all set, you may deploy the project!

`npm run dev`
