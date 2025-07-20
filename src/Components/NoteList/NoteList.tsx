import type {Note} from "../../types/note"
import css from "../../css/NoteList.module.css"

interface NoteListProps {
  note: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ note, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {note.map((item) => (
        <li key={item.id} className={css.listItem}>
          <h2 className={css.title}>{item.title}</h2>
          <p className={css.content}>{item.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>
            <button className={css.button} onClick={() => onDelete(item.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}