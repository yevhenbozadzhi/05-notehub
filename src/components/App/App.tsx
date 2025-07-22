import { useEffect, useState } from "react";
import css from "../../css/App.module.css";
import Modal from "../Modal/Modal";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import NoteForm from "../NoteForm/NoteForm";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";
import Pagination from "../Pagination/Pagination";

interface FetchNoteResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
}

export default function App() {

  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const perPage = 12;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const { data, isLoading } = useQuery<FetchNoteResponse>({
    queryKey: ["notes", page, debouncedSearchTerm],
    queryFn: () => fetchNotes(page, perPage, debouncedSearchTerm),
    placeholderData: keepPreviousData,
  });


  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <button onClick={openModal} className={css.submitButton}>
          Create Note
        </button>
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
      </header>

      {isLoading && <strong className={css.loading}>Loading notes...</strong>}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {data && data.total > perPage && (
        <Pagination
          pageCount={Math.ceil(data.total / perPage)}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
