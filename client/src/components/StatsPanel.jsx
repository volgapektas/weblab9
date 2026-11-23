export default function StatsPanel({ stats, loading }) {
  if (loading && !stats) {
    return (
      <section className="panel stats-panel">
        <h2>Statistics</h2>
        <p className="muted">Loading statistics...</p>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  const genreEntries = Object.entries(stats.byGenre || {});

  return (
    <section className="panel stats-panel">
      <h2>Statistics</h2>
      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">Total Books</span>
          <strong className="stat-value">{stats.total}</strong>
        </div>
        <div className="stat-box">
          <span className="stat-label">Read</span>
          <strong className="stat-value">{stats.read}</strong>
        </div>
        <div className="stat-box">
          <span className="stat-label">Unread</span>
          <strong className="stat-value">{stats.unread}</strong>
        </div>
        <div className="stat-box">
          <span className="stat-label">Average Rating</span>
          <strong className="stat-value">
            {stats.averageRating !== null
              ? `${stats.averageRating} / 5`
              : "N/A"}
          </strong>
        </div>
      </div>

      {genreEntries.length > 0 && (
        <div className="genre-breakdown">
          <span className="stat-label">By Genre: </span>
          {genreEntries.map(([genre, count]) => (
            <span key={genre} className="badge">
              {genre}: {count}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
