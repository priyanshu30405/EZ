import React, { useState } from "react";
import type { KanbanCard } from "./KanbanBoard.types";

export interface CardProps {
  card: KanbanCard;
  columnId: string;
  onUpdateTitle: (cardId: string, title: string) => void;
  onDelete: (cardId: string) => void;
  onDragStart: (columnId: string, cardId: string) => void;
  isDragging: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  columnId,
  onUpdateTitle,
  onDelete,
  onDragStart,
  isDragging
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(card.title);

  const handleSubmit = () => {
    const trimmedTitle = draftTitle.trim();
    if (trimmedTitle && trimmedTitle !== card.title) {
      onUpdateTitle(card.id, trimmedTitle);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`kanban-card ${isDragging ? "dragging" : ""}`}
      draggable
      onDragStart={() => onDragStart(columnId, card.id)}
    >
      <div className="kanban-card-title">
        {isEditing ? (
          <input
            autoFocus
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              } else if (event.key === "Escape") {
                setDraftTitle(card.title);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>{card.title}</span>
        )}
      </div>
      <div className="kanban-card-footer">
        <button
          type="button"
          className="kanban-link-button"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className="kanban-link-button"
          onClick={() => {
            const shouldDelete = window.confirm("Delete this card?");
            if (shouldDelete) {
              onDelete(card.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

