# Simple Server

An Express.js project with:
- **Minimal API server** (`server.js`)
- **Cron automation** (`cron.js`) that fetches API results and saves JSON + CSV
- **SQL tasks** (schema, seed data, queries)

---

## 📦 Prerequisites
- [Node.js](https://nodejs.org/) v18 or newer (if Node < 18, install `node-fetch@2`)
- [MySQL](https://dev.mysql.com/downloads/) or MariaDB
- Windows PowerShell / CMD

---

## 🚀 Setup & Installation
Clone the repo and install dependencies:
```bash
git clone https://github.com/firdausbasyuni/simple-server
cd simple-server
npm install
```

## 🚀 How to Run
Open two terminals in the project root:

Terminal 1 – Run the API Server
```bash
node server.js
```

The server will start at http://localhost:3000

Terminal 2 – Run the Cron Job
```bash
node cron.js
```
