import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getNotes = async () => {
  const res = await instance.get<Note[]>("/notes");
  return res.data;
};

export const addNote = async (noteData: NewNoteData) => {
  const res = await instance.post<Note>("/notes", noteData);
  return res.data;
};


interface FetchNoteResponse{
    notes: Note[];
    total: number;
    page: number;
    perPage: number;
}

export const fetchNote = async (
    page: number = 1,
    perPage: number = 12,
    search: string = '',
): Promise<FetchNoteResponse> => {
    const res = await instance.get<FetchNoteResponse>('/note', {
        params: {
            page,
            perPage,
            search,
        },
    });
    return res.data;
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
    const res = await instance.post<Note>(`/notes`, noteData);
    return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
    const res = await instance.delete<Note>(`/note/${id}`);
    return res.data;
};