export type ColumnId = "todo" | "in-progress" | "done";

export interface KanbanCard {
  id: string;
  title: string;
}

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  cards: KanbanCard[];
}

