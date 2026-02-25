import React from "react";
import { TreeView } from "./components/TreeView/TreeView";
import { KanbanBoard } from "./components/Kanban/KanbanBoard";

const App: React.FC = () => {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Frontend Developer Test</h1>
        <p className="app-subtitle">
          Tree View component with lazy loading and Kanban Board with drag &amp; drop.
        </p>
      </header>

      <div className="app-layout">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Tree View</h2>
            <span className="badge">React + TypeScript</span>
          </div>
          <p className="panel-description">
            Expand / collapse, add, delete, rename, drag &amp; drop, and lazy-loaded nodes.
          </p>
          <TreeView />
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Kanban Board</h2>
            <span className="badge">React + TypeScript</span>
          </div>
          <p className="panel-description">
            Simple three-column board with add, delete, inline edit and drag &amp; drop.
          </p>
          <KanbanBoard />
        </section>
      </div>
    </div>
  );
};

export default App;

