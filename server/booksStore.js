const delay = (ms = 25) => new Promise((resolve) => setTimeout(resolve, ms));

const initialBooks = [
  {
    id: 1,
    title: "Kürk Mantolu Madonna",
    author: "Sabahattin Ali",
    year: 1943,
    genre: "fiction",
    read: true,
    rating: 5,
  },
  {
    id: 2,
    title: "Serenad",
    author: "Zülfü Livaneli",
    year: 2011,
    genre: "fiction",
    read: true,
    rating: 5,
  },
  {
    id: 3,
    title: "Beyoğlu Rapsodisi",
    author: "Ahmet Ümit",
    year: 2003,
    genre: "fiction",
    read: true,
    rating: 4,
  },
  {
    id: 4,
    title: "Gazi Mustafa Kemal Atatürk",
    author: "İlber Ortaylı",
    year: 2018,
    genre: "history",
    read: false,
    rating: null,
  },
  {
    id: 5,
    title: "Puslu Kıtalar Atlası",
    author: "İhsan Oktay Anar",
    year: 1995,
    genre: "fantasy",
    read: false,
    rating: null,
  },
  {
    id: 6,
    title: "İnsanın Fabrika Ayarları",
    author: "Sinan Canan",
    year: 2019,
    genre: "science",
    read: false,
    rating: null,
  },
];

let books = initialBooks.map((book) => ({ ...book }));
let nextId = 7;

export async function getAllBooks() {
  await delay();
  return books.map((book) => ({ ...book }));
}

export async function getBookById(id) {
  await delay();
  const found = books.find((book) => book.id === id);
  return found ? { ...found } : null;
}

export async function hasDuplicateBook(title, author, excludeId = null) {
  await delay();
  const normTitle = title.trim().toLowerCase();
  const normAuthor = author.trim().toLowerCase();

  return books.some(
    (book) =>
      book.id !== excludeId &&
      book.title.trim().toLowerCase() === normTitle &&
      book.author.trim().toLowerCase() === normAuthor,
  );
}

export async function createBook(bookData) {
  await delay();
  const newBook = {
    id: nextId,
    title: bookData.title,
    author: bookData.author,
    year: bookData.year,
    genre: bookData.genre,
    read: bookData.read,
    rating: bookData.rating,
  };
  nextId += 1;
  books = [...books, newBook];
  return { ...newBook };
}

export async function replaceBook(id, bookData) {
  await delay();
  const exists = books.some((book) => book.id === id);
  if (!exists) {
    return null;
  }

  const updatedBook = {
    id,
    title: bookData.title,
    author: bookData.author,
    year: bookData.year,
    genre: bookData.genre,
    read: bookData.read,
    rating: bookData.rating,
  };

  books = books.map((book) => (book.id === id ? updatedBook : book));
  return { ...updatedBook };
}

export async function updateBookPartial(id, mergedData) {
  await delay();
  const exists = books.some((book) => book.id === id);
  if (!exists) {
    return null;
  }

  const updatedBook = {
    id,
    title: mergedData.title,
    author: mergedData.author,
    year: mergedData.year,
    genre: mergedData.genre,
    read: mergedData.read,
    rating: mergedData.rating,
  };

  books = books.map((book) => (book.id === id ? updatedBook : book));
  return { ...updatedBook };
}

export async function deleteBook(id) {
  await delay();
  const exists = books.some((book) => book.id === id);
  if (!exists) {
    return false;
  }

  books = books.filter((book) => book.id !== id);
  return true;
}
