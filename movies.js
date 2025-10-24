// Grab elements from the DOM (run after DOM is parsed via defer in HTML)
const moviesWrapper = document.querySelector(".movies");
const searchInput = document.querySelector(".search__input");
const searchInfo = document.querySelector(".search-info");

// Global Movies Variable
let currentMovies = [];

// Handle search from input change
function searchChange(event) {
  const value = (event?.target?.value || "").trim();
  if (!value) {
    searchInfo.textContent = "Search Results";
    moviesWrapper.innerHTML = "";
    currentMovies = [];
    return;
  }
  searchInfo.textContent = `Search Results for "${value}"`;
  renderMovies(value);
}

// Optional: handle search button click
function searchSubmit() {
  const value = (searchInput?.value || "").trim();
  searchChange({ target: { value } });
}

// Fetch and render movies from OMDb API
async function renderMovies(searchTerm) {
  try {
    if (!searchTerm) return;
    // show loading spinner
    moviesWrapper.innerHTML = `<div class="movies__loading"><i class="fas fa-spinner"></i></div>`;

    const response = await fetch(
      `https://omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=baf42048`
    );
    const data = await response.json();

    // Normalize results
    currentMovies = Array.isArray(data?.Search) ? data.Search : [];

    displayMovies(currentMovies);
  } catch (err) {
    console.error("Failed to fetch movies", err);
    moviesWrapper.innerHTML = `<p>Something went wrong. Please try again.</p>`;
  }
}

// Render list of movies into the DOM
function displayMovies(movieList = []) {
  if (!moviesWrapper) return;

  if (!movieList.length) {
    moviesWrapper.innerHTML = `<p>No results found.</p>`;
    return;
  }

  const html = movieList
    .slice(0, 6)
    .map((movie) => {
      const poster =
        movie.Poster && movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/300x445?text=No+Image";
      const yearText = movie.Year || "N/A";
      return `
      <div class="movie">
        <img src="${poster}" alt="${movie.Title}" />
        <h2>${movie.Title}</h2>
        <h4>${yearText}</h4>
        <button type="button">Learn More</button>
      </div>
      `;
    })
    .join("");

  moviesWrapper.innerHTML = html;
}

// Handle sort changes
function sortChange(event) {
  const sortOption = event?.target?.value;
  if (!sortOption || !currentMovies.length) {
    displayMovies(currentMovies);
    return;
  }

  const toYear = (y) => {
    // OMDb can return "2018–" for series; parseInt handles leading digits
    const n = parseInt(y, 10);
    return Number.isFinite(n) ? n : -Infinity; // treat invalid years as oldest
  };

  let sortedMovies = [...currentMovies];

  if (sortOption === "newest") {
    sortedMovies.sort((a, b) => toYear(b.Year) - toYear(a.Year));
  } else if (sortOption === "oldest") {
    sortedMovies.sort((a, b) => toYear(a.Year) - toYear(b.Year));
  }

  displayMovies(sortedMovies);
}

// Expose functions for inline HTML handlers
window.searchChange = searchChange;
window.searchSubmit = searchSubmit;
window.sortChange = sortChange;
