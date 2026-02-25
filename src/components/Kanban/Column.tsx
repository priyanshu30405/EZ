import React from "react";
import type { KanbanCard, KanbanColumn } from "./KanbanBoard.types";
import { Card } from "./Card";

export interface ColumnProps {
  column: KanbanColumn;
  onAddCard: (columnId: string) => void;
  onUpdateCardTitle: (columnId: string, cardId: string, title: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onDropCardToColumn: (columnId: string) => void;
  onDragStartCard: (columnId: string, cardId: string) => void;
  draggingCardId: string | null;
  draggingFromColumnId: string | null;
  isDragOver: boolean;
  onDragOverColumn: (columnId: string) => void;
  onDragLeaveColumn: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onAddCard,
  onUpdateCardTitle,
  onDeleteCard,
  onDropCardToColumn,
  onDragStartCard,
  draggingCardId,
  draggingFromColumnId,
  isDragOver,
  onDragOverColumn,
  onDragLeaveColumn
}) => {
  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    onDragOverColumn(column.id);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    onDropCardToColumn(column.id);
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    onDragLeaveColumn(column.id);
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <div className="kanban-column-header">
        <span className="kanban-column-title">{column.title}</span>
        <span className="kanban-column-count">{column.cards.length}</span>
      </div>

      <div className="kanban-cards">
        {column.cards.map((card: KanbanCard) => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            onUpdateTitle={(cardId, title) => onUpdateCardTitle(column.id, cardId, title)}
            onDelete={(cardId) => onDeleteCard(column.id, cardId)}
            onDragStart={onDragStartCard}
            isDragging={draggingCardId === card.id && draggingFromColumnId === column.id}
          />
        ))}
      </div>

      <button
        type="button"
        className="kanban-button kanban-add-card"
        onClick={() => onAddCard(column.id)}
      >
        + Add Card
      </button>
    </div>
  );
};

