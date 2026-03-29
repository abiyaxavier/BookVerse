const container = document.getElementById("book-list");
const topContainer = document.getElementById("top-books");
const valueContainer = document.getElementById("value-books");
const genreFilter = document.getElementById("genreFilter");
const ratingFilter = document.getElementById("ratingFilter");

let filteredBooks = [...books];

// 🔹 Add scores
books.forEach(book => {
  book.valueScore = book["User Rating"] / book["Price"];
  book.popularityScore = (book["User Rating"] * 20) + Math.log(book["Reviews"]);
});

// 🎨 Random color
function getColor() {
  const colors = ["blue", "green", "orange"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 🔹 Create card (CLICKABLE)
function createCard(book) {
  const div = document.createElement("div");
  div.className = "card " + getColor();

  div.innerHTML = `
    <h3>${book["Name"]}</h3>
    <p>✍ ${book["Author"]}</p>
    <p>⭐ ${book["User Rating"]}</p>
    <p>💰 $${book["Price"]}</p>
  `;

  // 👉 click to open details
  div.onclick = () => showBookDetails(book);

  return div;
}

// 🔹 Display function
function displayBooks(data, element) {
  element.innerHTML = "";
  data.forEach(book => {
    element.appendChild(createCard(book));
  });
}

// 🔥 Top 10 Popular
function getTopBooks() {
  return [...books]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 10);
}

// 💰 Best Value
function getValueBooks() {
  return [...books]
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, 10);
}

// 🔽 Fill genre dropdown
function loadGenres() {
  if (!genreFilter) return;

  const genres = [...new Set(books.map(b => b.Genre))];

  genres.forEach(g => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;
    genreFilter.appendChild(option);
  });
}

// 🔍 FILTER FUNCTION
function applyFilters() {
  const genre = genreFilter.value;
  const rating = ratingFilter.value;

  filteredBooks = books.filter(book => {
    const genreMatch = genre === "all" || book.Genre === genre;
    const ratingMatch =
      rating === "all" || book["User Rating"] >= parseFloat(rating);

    return genreMatch && ratingMatch;
  });

  displayBooks(filteredBooks, container);
}

// 🔍 SEARCH (works with filters too)
function searchBooks() {
  const text = document.getElementById("search").value.toLowerCase();

  const searched = filteredBooks.filter(book =>
    book["Name"].toLowerCase().includes(text)
  );

  displayBooks(searched, container);
}

// 📖 BOOK DETAILS MODAL
function showBookDetails(book) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");

  body.innerHTML = `
    <h2>${book["Name"]}</h2>
    <p><b>Author:</b> ${book["Author"]}</p>
    <p><b>Rating:</b> ${book["User Rating"]}</p>
    <p><b>Reviews:</b> ${book["Reviews"]}</p>
    <p><b>Price:</b> $${book["Price"]}</p>
    <p><b>Genre:</b> ${book.Genre}</p>
    <p><b>Year:</b> ${book.Year}</p>
  `;

  modal.style.display = "block";
}

// ❌ Close modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// 🚀 INIT
loadGenres();

displayBooks(books, container);
displayBooks(getTopBooks(), topContainer);
displayBooks(getValueBooks(), valueContainer);