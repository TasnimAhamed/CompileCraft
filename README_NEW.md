# Compile Craft – The Art of Compilation

![Version](https://img.shields.io/badge/version-1.0.0-cyan?style=flat&label=version)
![Status](https://img.shields.io/badge/status-active-blue?style=flat)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=flat)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white&style=flat)
![DaisyUI](https://img.shields.io/badge/DaisyUI-FF69B4?logo=daisyui&logoColor=white&style=flat)
[![Netlify Deploy](https://api.netlify.com/api/v1/badges/6bcdb1fc-093e-4e49-8f4f-c8ce355f7717/deploy-status)](https://app.netlify.com/projects/compiler-forge/deploys)

Compile Craft is a lightweight, entirely client‑side toolkit for learning and experimenting with core compiler construction concepts. It gives you instant transformations: eliminate left recursion, compute FIRST/FOLLOW sets, generate three‑address code—and more is on the way. No build step. No backend. Just open the page and explore.

> Learn • Transform • Build — focus on the algorithms, not boilerplate.

## 🔗 Live Preview
https://compiler-forge.netlify.app *(legacy deployment name; will be updated to match branding)*

---
## ✨ Current Capabilities

| Module | Status | Description |
| ------ | ------ | ----------- |
| FIRST / FOLLOW Sets | ✅ Active | Robust iterative algorithm handling ε and indirect recursion; rendered as a clean table. |
| Left Recursion Elimination | ✅ Active | Converts immediate left‑recursive productions into right‑recursive form with helper non‑terminals. |
| 3‑Address Code (Expressions) | ✅ Active | Tokenizes, converts to postfix (Shunting‑Yard) and emits TAC with temporaries. |
| Left Factoring | 🕓 Upcoming | Refactor common prefixes to reduce predictive parsing conflicts. |
| LL(1) Parse Table | 🕓 Upcoming | Build selection sets & detect conflicts visually. |
| AST Visualizer | 🕓 Planned | Interactive abstract syntax tree rendering (collapsible nodes). |

---
## 🧠 Algorithms & Approach

**FIRST / FOLLOW**  
Iterative fixed‑point computation normalizing epsilon symbols (ε, ϵ, e). Ensures termination by only expanding when new symbols are added. FOLLOW seeds start symbol with `$` and propagates through productions, respecting nullable tails.

**Left Recursion Elimination**  
Splits productions of the form `A → A α | β` into `A → β A'` and `A' → α A' | ε`, preserving language equivalence while enabling predictive parsing.

**Three-Address Code (TAC)**  
1. Tokenize identifiers, numbers, operators, parentheses, assignment.  
2. Convert infix → postfix via Shunting‑Yard respecting precedence and right‑associativity of `^`.  
3. Emit temporaries `t1, t2 ...` for each operation; final assignment rewrites to left side if present.

All processing is done purely in the browser (no server calls), making the tool fast, portable, and privacy‑friendly.

---
## 🚀 Quick Start

1. Clone the repo:  
   `git clone https://github.com/TasnimAhamed/CompileCraft.git`
2. Open the project folder.  
3. Launch `index.html` (double‑click or serve via a simple static server).  
4. Open `tools.html` for the interactive toolkit.  
5. Paste a grammar and click the relevant process button.

> No build, no dependencies. Everything is static assets.

---
## 🧪 Example Grammar

```
E -> E + T | T
T -> T * F | F
F -> ( E ) | id

// Normalized
E  -> T E'
E' -> + T E' | ε
T  -> F T'
T' -> * F T' | ε
```

---
## 🛠 How to Use (Mirrors Site Timeline)
1. Choose Operation – Select FIRST/FOLLOW, Left Recursion, 3AC, etc.  
2. Input Grammar – One production per line (`A -> ... | ...`).  
3. Generate Output – Click the button; results appear instantly.  
4. Analyze Results – Inspect transformed grammar, sets, or TAC.  
5. Iterate & Export – Refine grammar and copy outputs into coursework or projects.

---
## 📦 Tech Stack
| Layer | Tools |
| ----- | ----- |
| UI / Layout | HTML5, Tailwind CSS, DaisyUI |
| Icons | Font Awesome |
| Styling Effects | Gradients, glassy dark theme, subtle glows |
| Logic | Vanilla JavaScript (modular scripts per feature) |

No frameworks, build tooling, or external compute services.

---
## 🧭 Roadmap
- [ ] Left Factoring implementation & UI activation
- [ ] LL(1) table generator with conflict highlighting
- [ ] AST visualizer (collapsible tree / zoom)
- [ ] Export to JSON / markdown tables
- [ ] Optional grammar persistence (localStorage)
- [ ] Performance micro‑benchmarks for large grammars

---
## 🤝 Contributing
Contributions are welcome:
1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add ..."`
4. Push & open a Pull Request

Please keep UI consistent with existing gradients & dark theme; prefer accessible contrast and semantic HTML.

---
## 🐞 Reporting Issues
Open a GitHub issue with:
- Description & expected behavior
- Steps to reproduce (grammar samples help!)
- Screenshot (if UI related)

---
## 📚 Educational Use
Designed for students in Compiler Design / Parsing courses. You can project it live in lectures to demonstrate transformations in real time.

---
## 🔐 Privacy
All computation happens locally in your browser. No grammar data leaves your machine.

---
## 📄 License
MIT License – see `LICENSE` (create one if not present).

---
## 🙌 Acknowledgements
- Classic compiler construction texts & academic lecture patterns.
- Inspiration from classroom workflows needing instant visual feedback.

---
## ⭐ Support
If this helps your learning or teaching, star the repository to follow upcoming modules.

— *Compile Craft* – The Art of Compilation.
