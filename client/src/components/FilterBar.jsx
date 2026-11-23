const GENRES = [
  "fiction",
  "non-fiction",
  "science",
  "history",
  "fantasy",
  "other",
];

export default function FilterBar({ filters, onChange, onReset }) {
  function handleFieldChange(field, value) {
    onChange({
      ...filters,
      [field]: value,
    });
  }

  return (
    <section className="panel filter-panel">
      <h2>Search, Filter & Sort</h2>
      <div className="filter-grid">
        <label className="field">
          <span>Search (Title or Author)</span>
          <input
            type="text"
            placeholder="e.g. Sabahattin Ali, Serenad..."
            value={filters.q}
            onChange={(e) => handleFieldChange("q", e.target.value)}
          />
        </label>

        <label className="field">
          <span>Genre</span>
          <select
            value={filters.genre}
            onChange={(e) => handleFieldChange("genre", e.target.value)}
          >
            <option value="all">All genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Status</span>
          <select
            value={filters.read}
            onChange={(e) => handleFieldChange("read", e.target.value)}
          >
            <option value="all">All books</option>
            <option value="true">Read</option>
            <option value="false">Unread</option>
          </select>
        </label>

        <label className="field">
          <span>Sort By</span>
          <select
            value={filters.sort}
            onChange={(e) => handleFieldChange("sort", e.target.value)}
          >
            <option value="id">Default (ID)</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        <label className="field">
          <span>Order</span>
          <select
            value={filters.order}
            onChange={(e) => handleFieldChange("order", e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <div className="field filter-actions">
          <button type="button" className="btn-secondary" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
