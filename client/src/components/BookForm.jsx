import { useState, useEffect } from "react";

const GENRES = [
  "fiction",
  "non-fiction",
  "science",
  "history",
  "fantasy",
  "other",
];

const EMPTY_FORM = {
  title: "",
  author: "",
  year: new Date().getFullYear(),
  genre: "fiction",
  read: false,
  rating: "",
};

export default function BookForm({
  editingBook,
  onSubmit,
  onCancelEdit,
  submitting,
  formError,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        year: editingBook.year,
        genre: editingBook.genre,
        read: editingBook.read,
        rating: editingBook.rating !== null ? String(editingBook.rating) : "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [editingBook]);

  function handleChange(field, value) {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "read" && !value) {
        next.rating = "";
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      title: formData.title,
      author: formData.author,
      year: formData.year === "" ? "" : Number(formData.year),
      genre: formData.genre,
      read: Boolean(formData.read),
      rating:
        formData.read && formData.rating !== ""
          ? Number(formData.rating)
          : null,
    };

    const success = await onSubmit(payload);
    if (success && !editingBook) {
      setFormData(EMPTY_FORM);
    }
  }

  return (
    <section className="panel form-panel">
      <h2>{editingBook ? `Edit Book #${editingBook.id}` : "Add a New Book"}</h2>

      {formError && (
        <div className="error-banner" role="alert">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              placeholder="Book title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="field">
            <span>Author</span>
            <input
              type="text"
              placeholder="Author name"
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="field">
            <span>Year</span>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => handleChange("year", e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="field">
            <span>Genre</span>
            <select
              value={formData.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
              disabled={submitting}
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={formData.read}
              onChange={(e) => handleChange("read", e.target.checked)}
              disabled={submitting}
            />
            <span>Mark as Read</span>
          </label>

          <label className="field">
            <span>Rating (1–5)</span>
            <select
              value={formData.rating}
              onChange={(e) => handleChange("rating", e.target.value)}
              disabled={submitting || !formData.read}
            >
              <option value="">No rating</option>
              <option value="1">1 ★</option>
              <option value="2">2 ★★</option>
              <option value="3">3 ★★★</option>
              <option value="4">4 ★★★★</option>
              <option value="5">5 ★★★★★</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? "Saving..."
              : editingBook
                ? "Save Changes (PUT)"
                : "Add Book"}
          </button>

          {editingBook && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancelEdit}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
