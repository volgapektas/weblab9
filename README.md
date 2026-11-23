# Web Programming Lab 9

A simple full-stack Reading List app made with Express 5 and React. The backend is an in-memory REST API and the frontend connects to it using `fetch`.

## Folder Structure

- `server/` - Express backend (`server.js`, `booksStore.js`, `validate.js`)
- `client/` - React frontend (`src/api/books.js`, `src/components/`)

## How to Run

### 1. Server

    cd server
    npm install
    npm run dev

Runs on `http://localhost:3000` (can be changed with `PORT` and `CLIENT_ORIGIN`).

### 2. Client

    cd client
    npm install
    npm run dev

Runs on `http://localhost:5173` (API URL can be changed with `VITE_API_URL` in `client/.env`).

## API Endpoints

| Method | Path             | What it does                                                                | Status             |
| :----- | :--------------- | :-------------------------------------------------------------------------- | :----------------- |
| GET    | `/api/books`     | Get books (supports `genre`, `read`, `q`, `sort`, `order`, `limit`, `page`) | 200, 400           |
| GET    | `/api/books/:id` | Get one book by id                                                          | 200, 400, 404      |
| GET    | `/api/stats`     | Get book counts, average rating, and genre counts                           | 200                |
| GET    | `/api/crash`     | Test route that throws an error for the 500 handler                         | 500                |
| POST   | `/api/books`     | Add a new book (returns `Location` header)                                  | 201, 400, 409      |
| PUT    | `/api/books/:id` | Replace all fields of a book                                                | 200, 400, 404, 409 |
| PATCH  | `/api/books/:id` | Update some fields of a book                                                | 200, 400, 404, 409 |
| DELETE | `/api/books/:id` | Delete a book                                                               | 204, 400, 404      |

## curl --include Outputs

### 1. 200 OK - List with two query parameters (genre=fiction&sort=year&order=desc)

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 343
    ETag: W/"157-XibhOkGHE3Unf83j+c85f2lHvcA"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    [{"id":2,"title":"Serenad","author":"Zülfü Livaneli","year":2011,"genre":"fiction","read":true,"rating":5},{"id":3,"title":"Beyoğlu Rapsodisi","author":"Ahmet Ümit","year":2003,"genre":"fiction","read":true,"rating":4},{"id":1,"title":"Kürk Mantolu Madonna","author":"Sabahattin Ali","year":1943,"genre":"fiction","read":true,"rating":5}]

### 2. 200 OK - Get one book (GET /api/books/1)

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 119
    ETag: W/"77-NGxDwCYNLI0I8HipZhpd3MOqdBE"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"id":1,"title":"Kürk Mantolu Madonna","author":"Sabahattin Ali","year":1943,"genre":"fiction","read":true,"rating":5}

### 3. 200 OK - GET /api/stats before adding a book

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 112
    ETag: W/"70-J1EpLHpG/kZNhFMtVdm2TK7JeIQ"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"total":6,"read":3,"unread":3,"averageRating":4.67,"byGenre":{"fiction":3,"history":1,"fantasy":1,"science":1}}

### 4. 201 Created - Create a book with Location header

    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Location: /api/books/7
    Content-Type: application/json; charset=utf-8
    Content-Length: 108
    ETag: W/"6c-NxW0ODhGIz3GM0xV5ZzSsK5nfiw"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"id":7,"title":"Tutunamayanlar","author":"Oğuz Atay","year":1972,"genre":"fiction","read":true,"rating":5}

### 5. 200 OK - GET /api/stats after adding a book

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 112
    ETag: W/"70-IYkyOtajSC+EMLzgGeZAJzpaEVU"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"total":7,"read":4,"unread":3,"averageRating":4.75,"byGenre":{"fiction":4,"history":1,"fantasy":1,"science":1}}

### 6. 400 Bad Request - Invalid request body

    HTTP/1.1 400 Bad Request
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 69
    ETag: W/"45-aduA4SqA9wur66eJUqrOhp66vfs"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"error":"Title must be between 1 and 100 characters after trimming"}

### 7. 400 Bad Request - Repeated query parameter (?genre=fiction&genre=history)

    HTTP/1.1 400 Bad Request
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 54
    ETag: W/"36-9SEUpnUx1GLF+4knO8j4ESs0EvU"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"error":"Query parameter 'genre' cannot be repeated"}

### 8. 404 Not Found - Missing book (GET /api/books/999)

    HTTP/1.1 404 Not Found
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 26
    ETag: W/"1a-9K7Ys+5Z9m3qczPTmMk82VGBL7g"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"error":"Book not found"}

### 9. 409 Conflict - Duplicate title and author

    HTTP/1.1 409 Conflict
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 64
    ETag: W/"40-Y8ZVtnRDFrTFCmvse+K/kdGoMVg"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"error":"A book with the same title and author already exists"}

### 10. 200 OK - PUT followed by PATCH on the same book (id=7)

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 108
    ETag: W/"6c-fmcyaD1M4TR9eeCcry2OmBZ9ErI"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"id":7,"title":"Tutunamayanlar","author":"Oğuz Atay","year":1971,"genre":"fiction","read":true,"rating":4}

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 108
    ETag: W/"6c-CPqBM/9u/QdtJT1AUvnXfnwXp+M"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"id":7,"title":"Tutunamayanlar","author":"Oğuz Atay","year":1971,"genre":"fiction","read":true,"rating":5}

### 11. 204 No Content followed by 404 Not Found on repeated DELETE

    HTTP/1.1 204 No Content
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    HTTP/1.1 404 Not Found
    X-Powered-By: Express
    Access-Control-Allow-Origin: http://localhost:5173
    Vary: Origin
    Content-Type: application/json; charset=utf-8
    Content-Length: 26
    ETag: W/"1a-9K7Ys+5Z9m3qczPTmMk82VGBL7g"
    Date: Mon, 23 Nov 2026 18:10:45 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"error":"Book not found"}

## Self-Study Questions

1. **What happens if `express.json()` is after the routes?**
   `req.body` stays `undefined` when `POST /api/books` runs because the body is not parsed yet. Our validation catches this and returns `400 Bad Request` instead of crashing. Express runs middleware in the exact order we write them.

2. **CORS on `GET` vs `POST`:**
   A `GET` request sends the `Origin` header directly and gets `Access-Control-Allow-Origin` back. A `POST` with `Content-Type: application/json` makes the browser send an `OPTIONS` preflight request first to check if `POST` and `Content-Type` are allowed.

3. **Why `PUT` and `PATCH` validate differently:**
   `PUT` replaces the whole book, so all required fields must be sent. `PATCH` only updates the fields we pass, so missing fields keep their old values before we check rules like `rating` when `read` is `false`.

4. **Why `GET /api/books?q=dune` does not need `Content-Type: application/json`:**
   `GET` requests have no request body; everything is in the URL. Adding `Content-Type` is pointless and causes an extra `OPTIONS` preflight request.

5. **Why `localeCompare` is better than `<` and `>` for strings:**
   `<` and `>` compare character codes, so uppercase `"Z"` comes before lowercase `"a"` and Turkish characters like `"Ç"`, `"İ"`, `"Ö"`, `"Ş"`, `"Ü"` get sorted wrong. `localeCompare` sorts alphabetically like a human expects.

6. **How Express 5 handles rejected promises in `async` routes:**
   In Express 4, an uncaught promise error in an `async` route could hang the request if we forgot `try/catch`. Express 5 catches rejected promises automatically and sends them to the error middleware.

7. **Why `AbortController` is needed in the search input:**
   If you type fast, an older request might finish after a newer one and overwrite the list with old results. `AbortController` cancels the previous request whenever the search or filter changes.
