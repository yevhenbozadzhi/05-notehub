import css from "../../css/NoteForm.module.css"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addNote } from '../../services/noteService'
import type { NewNoteData } from "../../types/note";

export default function NoteForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (noteData: NewNoteData) => addNote(noteData),
    onSuccess() {
      console.log("Note added successfully");
      queryClient.invalidateQueries({ queryKey: ['note'] });
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    mutation.mutate({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as string,
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title" className={css.input} />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" className={css.select}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error} />
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton}>
          Cancel
        </button>
        <button 
          type="submit"
          className={css.submitButton}
          disabled={false}
        >Create note
        </button>
      </div>
    </form>
  )
}
