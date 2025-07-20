import { useState } from "react";
import css from "../../css/App.module.css";
// import Modal from "../Modal/Modal";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SerachBox";
import NoteForm from "../NoteForm/NoteForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote, getNotes } from "../../services/noteService"; 

export default function App() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["note"],
    queryFn: getNotes,
  });

    const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] }); 
    },
  });
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  // const closeModal = () => setModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <button onClick={openModal} className={css.submitButton}>
          Create Note + 
        </button>
        <SearchBox />
      
      </header>

      {isLoading && <strong className={css.loading}>Loading notes...</strong>}

      {data && data.length > 0 && <NoteList note={data} onDelete={handleDelete} />}

      {isModalOpen && (
      
          <NoteForm />
      )}
    </div>
  );
}
