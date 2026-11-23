import { useState, useEffect, useCallback } from "react";
import {
  fetchBooks,
  fetchStats,
  createBook,
  replaceBook,
  patchBook,
  deleteBook,
} from "./api/books.js";
import StatsPanel from "./components/StatsPanel.jsx";
import FilterBar from "./components/FilterBar.jsx";
import BookForm from "./components/BookForm.jsx";
import BookList from "./components/BookList.jsx";

const DEFAULT_FILTERS = {
  q: "",
  genre: "all",
  read: "all",
  sort: "id",
  order: "asc",
};

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [booksError, setBooksError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formError, setFormError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  const loadStats = useCallback(async (signal) => {
    setLoadingStats(true);
    try {
      const data = await fetchStats(signal);
      setStats(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setActionError(err.message);
      }
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      setLoadingBooks(true);
      setBooksError("");
      try {
        const data = await fetchBooks(filters, controller.signal);
        setBooks(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setBooksError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingBooks(false);
        }
      }
    }

    loadBooks();

    return () => {
      controller.abort();
    };
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    loadStats(controller.signal);
    return () => controller.abort();
  }, [loadStats]);

  async function refreshListAndStats() {
    const [freshBooks, freshStats] = await Promise.all([
      fetchBooks(filters),
      fetchStats(),
    ]);
    setBooks(freshBooks);
    setStats(freshStats);
  }

  async function handleFormSubmit(payload) {
    setSubmitting(true);
    setFormError("");
    setActionError("");

    try {
      if (editingBook) {
        await replaceBook(editingBook.id, payload);
        setEditingBook(null);
      } else {
        await createBook(payload);
      }

      await refreshListAndStats();
      return true;
    } catch (err) {
      setFormError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleRead(book) {
    setBusyId(book.id);
    setActionError("");

    try {
      const nextRead = !book.read;
      const patchPayload = nextRead
        ? { read: true }
        : { read: false, rating: null };

      await patchBook(book.id, patchPayload);
      await refreshListAndStats();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRate(bookId, rating) {
    setBusyId(bookId);
    setActionError("");

    try {
      await patchBook(bookId, { rating });
      await refreshListAndStats();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(bookId) {
    setBusyId(bookId);
    setActionError("");

    try {
      await deleteBook(bookId);
      if (editingBook && editingBook.id === bookId) {
        setEditingBook(null);
      }
      await refreshListAndStats();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function handleResetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Reading List</h1>
        <p className="muted">
          Track books, filter by genre or status, and rate what you have read.
        </p>
      </header>

      {actionError && (
        <div className="error-banner" role="alert">
          {actionError}
        </div>
      )}

      <StatsPanel stats={stats} loading={loadingStats} />

      <BookForm
        editingBook={editingBook}
        onSubmit={handleFormSubmit}
        onCancelEdit={() => {
          setEditingBook(null);
          setFormError("");
        }}
        submitting={submitting}
        formError={formError}
      />

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      <BookList
        books={books}
        loading={loadingBooks}
        error={booksError}
        busyId={busyId}
        onToggleRead={handleToggleRead}
        onRate={handleRate}
        onEdit={(book) => {
          setFormError("");
          setEditingBook(book);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
