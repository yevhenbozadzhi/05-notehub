export interface Note {
  id: string;
  title: string;
  content?: string;
  tag: string;
  createdAt: string;
    updatedAt: string;
    completed?: boolean;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}

export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

