export default function BookList({
  books,
  loading,
  error,
  busyId,
  onToggleRead,
  onRate,
  onEdit,
  onDelete,
}) {
  if (loading && books.length === 0) {
    return (
      <section className="panel">
        <h2>Books</h2>
        <p className="muted">Loading books...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <h2>Books</h2>
        <div className="error-banner" role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="panel">
        <h2>Books</h2>
        <p className="muted">No books match your current filters.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Books ({books.length})</h2>
      <div className="book-list">
        {books.map((book) => {
          const isBusy = busyId === book.id;

          return (
            <article
              key={book.id}
              className={`book-card ${book.read ? "is-read" : ""}`}
            >
              <div className="book-main">
                <div className="book-header">
                  <h3>{book.title}</h3>
                  <span className="badge">{book.genre}</span>
                  <span
                    className={`status-pill ${
                      book.read ? "pill-read" : "pill-unread"
                    }`}
                  >
                    {book.read ? "Read" : "Unread"}
                  </span>
                </div>

                <p className="book-meta">
                  by <strong>{book.author}</strong> ({book.year})
                </p>

                <div className="book-rating-row">
                  <span>Rating: </span>
                  {book.read ? (
                    <select
                      aria-label={`Rating for ${book.title}`}
                      value={book.rating !== null ? String(book.rating) : ""}
                      disabled={isBusy}
                      onChange={(e) => {
                        const val = e.target.value;
                        onRate(book.id, val === "" ? null : Number(val));
                      }}
                    >
                      <option value="">Not rated</option>
                      <option value="1">1 ★</option>
                      <option value="2">2 ★★</option>
                      <option value="3">3 ★★★</option>
                      <option value="4">4 ★★★★</option>
                      <option value="5">5 ★★★★★</option>
                    </select>
                  ) : (
                    <span className="muted">Mark as read to rate</span>
                  )}
                </div>
              </div>

              <div className="book-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={isBusy}
                  onClick={() => onToggleRead(book)}
                >
                  {book.read ? "Mark Unread" : "Mark Read"}
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  disabled={isBusy}
                  onClick={() => onEdit(book)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn-danger"
                  disabled={isBusy}
                  onClick={() => onDelete(book.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
