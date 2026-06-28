# Phase 4 — Project Setup (reproduce locally)
# Every command below was run and verified in the build session.
# Run from an empty directory.

# ── 1. Root + git ────────────────────────────────────────────────
mkdir upi-summary && cd upi-summary
git init
mkdir -p packages/shared-types/src packages/backend/src packages/frontend

# ── 2. Root package.json (paste into upi-summary/package.json) ──
cat > package.json << 'EOF'
{
  "name": "upi-summary",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev:backend": "npm run dev --workspace=backend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "build": "npm run build --workspace=shared-types && npm run build --workspace=backend && npm run build --workspace=frontend",
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present"
  },
  "devDependencies": { "typescript": "^5.5.4" }
}
EOF

cat > .gitignore << 'EOF'
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
coverage/
EOF

cat > .prettierrc.json << 'EOF'
{ "semi": true, "singleQuote": false, "trailingComma": "es5", "printWidth": 90, "tabWidth": 2 }
EOF

# ── 3. shared-types package ──────────────────────────────────────
cat > packages/shared-types/package.json << 'EOF'
{
  "name": "shared-types",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "devDependencies": { "typescript": "^5.5.4" }
}
EOF

cat > packages/shared-types/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020", "module": "ESNext", "moduleResolution": "Bundler",
    "declaration": true, "outDir": "dist", "strict": true,
    "esModuleInterop": true, "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
EOF

# packages/shared-types/src/transaction.ts — paste this file content exactly:
#   (see canvas message above for full contents — Category, Direction,
#    Transaction, CashbackInfo, ApiResponse)
#
# packages/shared-types/src/index.ts:
#   export * from "./transaction";

# ── 4. Backend package ───────────────────────────────────────────
cat > packages/backend/package.json << 'EOF'
{
  "name": "backend",
  "version": "0.1.0",
  "private": true,
  "type": "commonjs",
  "main": "dist/app.js",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/app.js",
    "test": "vitest run",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "shared-types": "*"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.14.2",
    "@types/supertest": "^6.0.2",
    "supertest": "^7.0.0",
    "typescript": "^5.5.4",
    "tsx": "^4.16.2",
    "vitest": "^1.6.0"
  }
}
EOF

cat > packages/backend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020", "module": "CommonJS", "moduleResolution": "Node",
    "outDir": "dist", "rootDir": "src", "strict": true,
    "esModuleInterop": true, "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true, "resolveJsonModule": true
  },
  "include": ["src"]
}
EOF

cat > packages/backend/.env.example << 'EOF'
PORT=4000
EOF

# ── 5. Frontend package (Vite scaffold, then customize) ─────────
cd packages/frontend
npm create vite@latest . -- --template react-ts
rm -rf src/assets src/App.css
cd ../..

# Edit packages/frontend/package.json:
#  - keep name: "frontend"
#  - change "lint" script to: "eslint src --ext .ts,.tsx"
#  - add "test": "vitest run"
#  - add dependencies: zustand, framer-motion, recharts, shared-types: "*"
#  - add devDependencies: tailwindcss, postcss, autoprefixer, vitest,
#       @testing-library/react, @testing-library/jest-dom, jsdom
#  - remove oxlint

cat > packages/frontend/tailwind.config.js << 'EOF'
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
EOF

cat > packages/frontend/postcss.config.js << 'EOF'
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
EOF

cat > packages/frontend/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

cat > packages/frontend/.env.example << 'EOF'
VITE_API_BASE_URL=http://localhost:4000/api
EOF

# ── 6. Shared ESLint config (root) ───────────────────────────────
npm install -D eslint@^9.7.0 @typescript-eslint/parser@^7.16.0 \
  @typescript-eslint/eslint-plugin@^7.16.0 prettier@^3.3.2 \
  eslint-config-prettier@^9.1.0
# Then create eslint.config.js at root — see canvas message above for content.

# ── 7. Install everything + build shared-types first ────────────
npm install
npm run build --workspace=shared-types

# ── 8. Verify ─────────────────────────────────────────────────────
npm run build --workspace=frontend   # should produce dist/ with real Tailwind CSS
cd packages/backend && npx tsx -e "import('shared-types').then(m=>console.log(Object.keys(m)))"

# ── 9. First commit ──────────────────────────────────────────────
git add -A
git commit -m "chore: initial monorepo scaffold (shared-types, backend, frontend)"
