import express from "express";
import cors from "cors";
import { getAllBooks, getBookById } from "./booksStore.js";
import { parsePositiveInt, validateQueryOptions } from "./validate.js";

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

function filterAndSortBooks(books, options) {
  let result = [...books];

  if (options.genre !== null) {
    result = result.filter((book) => book.genre === options.genre);
  }

  if (options.read !== null) {
    result = result.filter((book) => book.read === options.read);
  }

  if (options.q !== null) {
    result = result.filter(
      (book) =>
        book.title.toLowerCase().includes(options.q) ||
        book.author.toLowerCase().includes(options.q),
    );
  }

  const direction = options.order === "desc" ? -1 : 1;

  result.sort((a, b) => {
    if (options.sort === "title" || options.sort === "author") {
      return a[options.sort].localeCompare(b[options.sort], "tr") * direction;
    }

    if (options.sort === "year") {
      return (a.year - b.year) * direction;
    }

    if (options.sort === "rating") {
      if (a.rating === null && b.rating === null) return 0;
      if (a.rating === null) return 1;
      if (b.rating === null) return -1;
      return (a.rating - b.rating) * direction;
    }

    return (a.id - b.id) * direction;
  });

  const startIndex = (options.page - 1) * options.limit;
  return result.slice(startIndex, startIndex + options.limit);
}

app.get("/api/books", async (req, res, next) => {
  try {
    const { options, error } = validateQueryOptions(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    const books = await getAllBooks();
    const filtered = filterAndSortBooks(books, options);
    return res.status(200).json(filtered);
  } catch (err) {
    return next(err);
  }
});

app.get("/api/stats", async (req, res, next) => {
  try {
    const books = await getAllBooks();
    const total = books.length;
    const readCount = books.filter((book) => book.read).length;
    const unreadCount = total - readCount;

    const ratedBooks = books.filter((book) => book.rating !== null);
    let averageRating = null;
    if (ratedBooks.length > 0) {
      const sum = ratedBooks.reduce((acc, book) => acc + book.rating, 0);
      averageRating = Number((sum / ratedBooks.length).toFixed(2));
    }

    const byGenre = {};
    for (const book of books) {
      byGenre[book.genre] = (byGenre[book.genre] || 0) + 1;
    }

    return res.status(200).json({
      total,
      read: readCount,
      unread: unreadCount,
      averageRating,
      byGenre,
    });
  } catch (err) {
    return next(err);
  }
});

app.get("/api/books/:id", async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params.id);
    if (id === null) {
      return res
        .status(400)
        .json({ error: "Book id must be a positive integer" });
    }

    const book = await getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (err) {
    return next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
