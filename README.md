# Frontend Developer Test – Tree View & Kanban Board

This project is a solution for a **Frontend Developer assignment**. It implements a reusable Tree View component and a Kanban board using **React + TypeScript**, focusing on clean structure, simple state management, and minimal but professional UI.

---

## Project Description

- **Tree View**
  - Hierarchical tree of nodes with expand / collapse.
  - Add, delete (with confirmation), and rename nodes inline.
  - Drag and drop nodes to move them under a different parent.
  - Lazy loading: some nodes load their children on first expand using a simulated async API.

- **Kanban Board**
  - Three columns: **Todo**, **In Progress**, **Done**.
  - Add new cards, delete cards (with confirmation), and edit card titles inline.
  - Drag and drop cards between columns using native HTML5 DnD.
  - Responsive layout: columns stack vertically on smaller screens.

---

## Features

- **TreeView**
  - Expand / collapse nodes.
  - Add child node via prompt.
  - Delete node with confirmation (entire subtree).
  - Inline edit node label (double-click or Edit button).
  - Drag and drop to move nodes between parents.
  - Lazy loading using `setTimeout` to simulate an API call.

- **KanbanBoard**
  - Columns: Todo / In Progress / Done with mock cards.
  - Add new card to any column.
  - Delete card with confirmation.
  - Inline edit card title.
  - Drag and drop cards across columns.
  - Responsive and scrollable board layout.

---

## Tech Stack

- **React 18** (functional components + hooks)
- **TypeScript**
- **Vite** (development/build tooling)
- **CSS** modules per feature (`tree.css`, `kanban.css`)
- Native **HTML5 Drag & Drop** (no external DnD libraries)

---

## Project Structure

- `src/App.tsx` – Renders the Tree View and Kanban Board side by side.
- `src/components/TreeView/`
  - `TreeView.tsx` – Tree state, lazy loading, drag & drop logic.
  - `TreeNode.tsx` – Single node row with inline editing and actions.
  - `TreeView.types.ts` – Tree node type definitions.
  - `mockTreeData.ts` – Initial tree data and lazy-loading mock API.
  - `tree.css` – Styles specific to the tree.
- `src/components/Kanban/`
  - `KanbanBoard.tsx` – Board state and drag & drop orchestration.
  - `Column.tsx` – Column wrapper, card list, add-card button.
  - `Card.tsx` – Individual card with inline editing and actions.
  - `KanbanBoard.types.ts` – Kanban types.
  - `mockKanbanData.ts` – Initial columns and cards.
  - `kanban.css` – Styles specific to the Kanban board.

---

## Running the project locally

Prerequisites:

- Node.js (LTS version recommended, e.g. 18+)
- npm or yarn

Steps:

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

2. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open the printed URL in the browser (by default `http://localhost:5173`).

4. To create a production build:

   ```bash
   npm run build
   npm run preview
   ```

---

## Links

- **GitHub Repository**: `https://github.com/priyanshu30405/EZ`
- **Live Demo**: `https://ez-5unk.vercel.app/`

---

## Notes about the implementation

- The focus is on **clear, readable TypeScript** and **simple React state** (no external state library).
- Both components are **reusable** and isolated in their own folders with feature‑scoped CSS.
- Drag and drop is implemented with the native browser API to keep dependencies minimal.

