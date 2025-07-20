import { useState } from "react";
import css from "../../css/App.module.css";
import Modal from "../Modal/Modal";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import NoteForm from "../NoteForm/NoteForm";
import ReactPaginate from "react-paginate";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote, fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";

interface FetchNoteResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
}

export default function App() {
  const queryClient = useQueryClient();

  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const perPage = 12;

  const { data, isLoading } = useQuery<FetchNoteResponse>({
    queryKey: ["notes", page, debouncedSearchTerm],
    queryFn: () => fetchNotes(page, perPage, debouncedSearchTerm),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", page, debouncedSearchTerm] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <button onClick={openModal} className={css.submitButton}>
          Create Note +
        </button>
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
      </header>

      {isLoading && <strong className={css.loading}>Loading notes...</strong>}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}

      {data && data.total > perPage && (
        <ReactPaginate
          pageCount={Math.ceil(data.total / perPage)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          disabledClassName={css.disabled}
          nextLabel="→"
          previousLabel="←"
          breakLabel="..."
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
