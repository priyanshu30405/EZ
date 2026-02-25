import React, { useState } from "react";
import "./kanban.css";
import type { KanbanColumn } from "./KanbanBoard.types";
import { initialKanbanColumns } from "./mockKanbanData";
import { Column } from "./Column";

export const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialKanbanColumns);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [draggingFromColumnId, setDraggingFromColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Add a new card to a specific column.
  const handleAddCard = (columnId: string) => {
    const title = window.prompt("Card title:");
    if (!title) return;

    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: [
                ...column.cards,
                { id: `${columnId}-${Date.now()}`, title: title.trim() }
              ]
            }
          : column
      )
    );
  };

  const handleUpdateCardTitle = (columnId: string, cardId: string, title: string) => {
    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === cardId ? { ...card, title } : card
              )
            }
          : column
      )
    );
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId)
            }
          : column
      )
    );
  };

  const handleDragStartCard = (columnId: string, cardId: string) => {
    setDraggingCardId(cardId);
    setDraggingFromColumnId(columnId);
  };

  const handleDropToColumn = (targetColumnId: string) => {
    if (!draggingCardId || !draggingFromColumnId) return;
    if (targetColumnId === draggingFromColumnId) {
      setDraggingCardId(null);
      setDraggingFromColumnId(null);
      setDragOverColumnId(null);
      return;
    }

    setColumns((previousColumns) => {
      let movedCard: null | { id: string; title: string } = null;

      // Remove card from original column.
      const columnsWithoutCard = previousColumns.map((column) => {
        if (column.id !== draggingFromColumnId) return column;
        const remainingCards = column.cards.filter((card) => {
          if (card.id === draggingCardId) {
            movedCard = card;
            return false;
          }
          return true;
        });
        return {
          ...column,
          cards: remainingCards
        };
      });

      if (!movedCard) {
        return previousColumns;
      }

      // Append card to target column.
      return columnsWithoutCard.map((column) =>
        column.id === targetColumnId
          ? {
              ...column,
              cards: [...column.cards, movedCard as NonNullable<typeof movedCard>]
            }
          : column
      );
    });

    setDraggingCardId(null);
    setDraggingFromColumnId(null);
    setDragOverColumnId(null);
  };

  const handleDragOverColumn = (columnId: string) => {
    if (!draggingCardId) return;
    setDragOverColumnId(columnId);
  };

  const handleDragLeaveColumn = (columnId: string) => {
    if (dragOverColumnId === columnId) {
      setDragOverColumnId(null);
    }
  };

  return (
    <div className="kanban-root">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          onAddCard={handleAddCard}
          onUpdateCardTitle={handleUpdateCardTitle}
          onDeleteCard={handleDeleteCard}
          onDropCardToColumn={handleDropToColumn}
          onDragStartCard={handleDragStartCard}
          draggingCardId={draggingCardId}
          draggingFromColumnId={draggingFromColumnId}
          isDragOver={dragOverColumnId === column.id}
          onDragOverColumn={handleDragOverColumn}
          onDragLeaveColumn={handleDragLeaveColumn}
        />
      ))}
    </div>
  );
};

