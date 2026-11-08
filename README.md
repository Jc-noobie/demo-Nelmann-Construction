# Nelmann Construction

Demo build of the Nelmann Construction management app. React 19 + Vite, Tailwind CSS v4, shadcn/ui. Mock data only — no backend, no auth, no persistence.

## Requirements

- Node.js **20.19+ or 22.12+** (required by Vite 8). Install the LTS build from [nodejs.org](https://nodejs.org).
- Git from [git-scm.com](https://git-scm.com).

Verify:

```
node -v
npm -v
git --version
```

## Run locally

1. Clone the repo:

```
git clone https://github.com/Jc-noobie/Nelmann-Construction-Company.git
cd Nelmann-Construction-Company
```

2. Install dependencies:

```
npm install
```

Use `npm ci` instead if you want the exact versions from `package-lock.json` (faster, reproducible).

3. Start the dev server:

```
npm run dev
```

4. Open the URL it prints, usually [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint check (only automated check in this project) |

## Getting updates

```
git pull
npm install
npm run dev
```

Only re-run `npm install` if `package.json` or `package-lock.json` changed.

## Troubleshooting

- **`npm` not recognized** — Node not installed, or terminal needs reopening after install.
- **`EPERM` / permission errors** — do not run as administrator. Delete `node_modules` and run `npm install` again.
- **Port already in use** — `npm run dev -- --port 5174`.
- **Blank page** — check browser console; confirm `npm install` finished without errors.
- **Vite engine error** — Node too old; upgrade to 20.19+ or 22.12+.

## Notes

- `node_modules/` and `dist/` are ignored by Git. Never commit them.
- Do not use floating-point math for money; see `AGENTS.md`, `project.md`, and `spec.md` for project rules.
