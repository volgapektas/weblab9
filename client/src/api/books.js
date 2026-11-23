const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const { body, headers, ...restOptions } = options;

  const finalHeaders = {
    ...(headers || {}),
  };

  const fetchOptions = {
    ...restOptions,
    headers: finalHeaders,
  };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, fetchOptions);

  if (response.status === 204) {
    return null;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data && data.error
        ? data.error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export function fetchBooks(filters = {}, signal) {
  const params = new URLSearchParams();

  if (filters.q && filters.q.trim() !== "") {
    params.set("q", filters.q.trim());
  }
  if (filters.genre && filters.genre !== "all") {
    params.set("genre", filters.genre);
  }
  if (filters.read === "true" || filters.read === "false") {
    params.set("read", filters.read);
  }
  if (filters.sort && filters.sort !== "id") {
    params.set("sort", filters.sort);
  }
  if (filters.order && filters.order !== "asc") {
    params.set("order", filters.order);
  }

  const queryString = params.toString();
  const path = queryString ? `/api/books?${queryString}` : "/api/books";

  return request(path, { method: "GET", signal });
}

export function fetchStats(signal) {
  return request("/api/stats", { method: "GET", signal });
}

export function createBook(bookData) {
  return request("/api/books", {
    method: "POST",
    body: bookData,
  });
}

export function replaceBook(id, bookData) {
  return request(`/api/books/${id}`, {
    method: "PUT",
    body: bookData,
  });
}

export function patchBook(id, partialData) {
  return request(`/api/books/${id}`, {
    method: "PATCH",
    body: partialData,
  });
}

export function deleteBook(id) {
  return request(`/api/books/${id}`, {
    method: "DELETE",
  });
}
