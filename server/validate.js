export const ALLOWED_GENRES = [
  "fiction",
  "non-fiction",
  "science",
  "history",
  "fantasy",
  "other",
];

const ALLOWED_SORT_FIELDS = ["title", "author", "year", "rating"];
const ALLOWED_ORDERS = ["asc", "desc"];

export function parsePositiveInt(value) {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? value : null;
  }
  if (typeof value === "string" && /^[1-9]\d*$/.test(value.trim())) {
    const num = Number(value.trim());
    return Number.isSafeInteger(num) ? num : null;
  }
  return null;
}

export function validateCompleteBook(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const currentYear = new Date().getFullYear();

  if (typeof body.title !== "string") {
    return { error: "Title is required and must be a string" };
  }
  const title = body.title.trim();
  if (title.length < 1 || title.length > 100) {
    return {
      error: "Title must be between 1 and 100 characters after trimming",
    };
  }

  if (typeof body.author !== "string") {
    return { error: "Author is required and must be a string" };
  }
  const author = body.author.trim();
  if (author.length < 1 || author.length > 100) {
    return {
      error: "Author must be between 1 and 100 characters after trimming",
    };
  }

  if (
    typeof body.year !== "number" ||
    !Number.isInteger(body.year) ||
    body.year < 1000 ||
    body.year > currentYear
  ) {
    return { error: `Year must be an integer between 1000 and ${currentYear}` };
  }

  if (typeof body.genre !== "string" || !ALLOWED_GENRES.includes(body.genre)) {
    return {
      error: `Genre must be one of: ${ALLOWED_GENRES.join(", ")}`,
    };
  }

  let read = false;
  if (body.read !== undefined) {
    if (typeof body.read !== "boolean") {
      return { error: "Read must be a boolean" };
    }
    read = body.read;
  }

  let rating = null;
  if (body.rating !== undefined && body.rating !== null) {
    if (
      typeof body.rating !== "number" ||
      !Number.isInteger(body.rating) ||
      body.rating < 1 ||
      body.rating > 5
    ) {
      return { error: "Rating must be an integer between 1 and 5, or null" };
    }
    rating = body.rating;
  }

  if (rating !== null && !read) {
    return { error: "A rating is allowed only when read is true" };
  }

  return {
    data: {
      title,
      author,
      year: body.year,
      genre: body.genre,
      read,
      rating,
    },
  };
}

export function validatePatchBook(existingBook, body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const nextRead = body.read !== undefined ? body.read : existingBook.read;

  let nextRating;
  if (body.rating !== undefined) {
    nextRating = body.rating;
  } else if (body.read === false) {
    nextRating = null;
  } else {
    nextRating = existingBook.rating;
  }

  const mergedCandidate = {
    title: body.title !== undefined ? body.title : existingBook.title,
    author: body.author !== undefined ? body.author : existingBook.author,
    year: body.year !== undefined ? body.year : existingBook.year,
    genre: body.genre !== undefined ? body.genre : existingBook.genre,
    read: nextRead,
    rating: nextRating,
  };

  return validateCompleteBook(mergedCandidate);
}

export function validateQueryOptions(query) {
  const keys = ["genre", "read", "q", "sort", "order", "limit", "page"];
  for (const key of keys) {
    if (Array.isArray(query[key])) {
      return { error: `Query parameter '${key}' cannot be repeated` };
    }
  }

  let genre = null;
  if (query.genre !== undefined) {
    if (
      typeof query.genre !== "string" ||
      !ALLOWED_GENRES.includes(query.genre)
    ) {
      return { error: `Invalid genre. Allowed: ${ALLOWED_GENRES.join(", ")}` };
    }
    genre = query.genre;
  }

  let read = null;
  if (query.read !== undefined) {
    if (query.read === "true") {
      read = true;
    } else if (query.read === "false") {
      read = false;
    } else {
      return { error: "Query parameter 'read' must be 'true' or 'false'" };
    }
  }

  let q = null;
  if (query.q !== undefined) {
    if (typeof query.q !== "string") {
      return { error: "Query parameter 'q' must be a string" };
    }
    const trimmed = query.q.trim();
    if (trimmed.length > 0) {
      q = trimmed.toLowerCase();
    }
  }

  let sort = "id";
  if (query.sort !== undefined) {
    if (
      typeof query.sort !== "string" ||
      !ALLOWED_SORT_FIELDS.includes(query.sort)
    ) {
      return {
        error: `Invalid sort field. Allowed: ${ALLOWED_SORT_FIELDS.join(", ")}`,
      };
    }
    sort = query.sort;
  }

  let order = "asc";
  if (query.order !== undefined) {
    if (
      typeof query.order !== "string" ||
      !ALLOWED_ORDERS.includes(query.order)
    ) {
      return { error: "Query parameter 'order' must be 'asc' or 'desc'" };
    }
    order = query.order;
  }

  let limit = 50;
  if (query.limit !== undefined) {
    const parsedLimit = parsePositiveInt(query.limit);
    if (parsedLimit === null || parsedLimit < 1 || parsedLimit > 50) {
      return {
        error: "Query parameter 'limit' must be an integer between 1 and 50",
      };
    }
    limit = parsedLimit;
  }

  let page = 1;
  if (query.page !== undefined) {
    const parsedPage = parsePositiveInt(query.page);
    if (parsedPage === null || parsedPage < 1) {
      return { error: "Query parameter 'page' must be a positive integer" };
    }
    page = parsedPage;
  }

  return {
    options: {
      genre,
      read,
      q,
      sort,
      order,
      limit,
      page,
    },
  };
}
