const movieInput = document.getElementById("movieInput");

const themeBtn = document.getElementById("themeBtn");
const searchBtn = document.getElementById("searchBtn");

const yearFilter = document.getElementById("yearFilter");
const typeFilter = document.getElementById("typeFilter");

const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");

const movieContainer = document.getElementById("movieContainer");
const favoriteContainer = document.getElementById("favoriteContainer");

const movieModal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");

const closeBtn = document.querySelector(".close");

let currentMovies = [];

searchBtn.addEventListener("click", searchMovie);

movieInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchMovie();
  }
});

closeBtn.addEventListener("click", () => {
  movieModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === movieModal) {
    movieModal.style.display = "none";
  }
});

function searchMovie() {
  const movie = movieInput.value.trim();

  if (movie === "") {
    showError("Please enter a movie name.");
    return;
  }

  getMovies(movie);
}

async function getMovies(movie) {
  showLoader();

  try {
    let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(movie)}`;

    if (yearFilter.value !== "") {
      url += `&y=${yearFilter.value}`;
    }

    if (typeFilter.value !== "") {
      url += `&type=${typeFilter.value}`;
    }

    const response = await fetch(url);

    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error);
    }

    currentMovies = data.Search;

    displayMovies(currentMovies);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
}

function displayMovies(movies) {
  movieContainer.innerHTML = "";

  movies.forEach((movie) => {
    const poster =
      movie.Poster === "N/A"
        ? "https://via.placeholder.com/300x450?text=No+Image"
        : movie.Poster;

    const card = document.createElement("div");

    card.className = "movie-card";

    card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">

            <div class="movie-content">

                <h3>${movie.Title}</h3>

                <p><strong>Year:</strong>${movie.Year}</p>

                <p><strong>Type:</strong>${movie.Type}</p>

                <button 
                    class="details-btn"
                    onclick="getMovieDetails('${movie.imdbID}')"
                >
                    View Details
                </button>

                <button 
                    class="favorite-btn"
                    onclick="addFavorite('${movie.imdbID}')"
                >
                    ❤ Add Favorite
                </button>

            </div>

        `;

    movieContainer.appendChild(card);
  });
}

function showLoader() {
  loader.classList.remove("hidden");

  errorMessage.classList.add("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError(message) {
  errorMessage.textContent = message;

  errorMessage.classList.remove("hidden");
}

async function getMovieDetails(imdbID) {
  showLoader();

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`,
    );

    const movie = await response.json();

    if (movie.Response === "False") {
      throw new Error(movie.Error);
    }

    showMovieModal(movie);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
}

function showMovieModal(movie) {
  const poster =
    movie.Poster === "N/A"
      ? "https://via.placeholder.com/300x450?text=No+Image"
      : movie.Poster;

  modalBody.innerHTML = `
    
    <div class="modal-body">

        <img src="${poster}" alt="${movie.Title}">

        <div class="modal-info">

            <h2>${movie.Title}</h2>

            <p><strong>ImDb Rating:</strong> ⭐ ${movie.imdbRating}</p>

            <p><strong>Genre:</strong> ${movie.Genre}</p>

            <p><strong>Released:</strong> ${movie.Released}</p>

            <p><strong>Runtime:</strong> ${movie.Runtime}</p>

            <p><strong>Language:</strong> ${movie.Language}</p>

            <p><strong>Country:</strong> ${movie.Country}</p>

            <p><strong>Director:</strong>  ${movie.Director}</p>

            <p><strong>Writer:</strong>  ${movie.Writer}</p>

            <p><strong>Actors:</strong>  ${movie.Actors}</p>

            <p><strong>Awards:</strong> 🏆 ${movie.Awards}</p>

            <p><strong>Plot:</strong></p>

            <p>${movie.Plot}</p>

        </div>

    </div>

    `;

  movieModal.style.display = "flex";
}

function addFavorite(imdbID) {
  const movie = currentMovies.find((m) => m.imdbID === imdbID);

  if (!movie) return;

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const exists = favorites.some((item) => item.imdbID === imdbID);

  if (exists) {
    alert("Movie already exists in Favorites");
    return;
  }

  favorites.push(movie);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  loadFavorites();
}

function loadFavorites() {
  favoriteContainer.innerHTML = "";

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.forEach((movie) => {
    const poster =
      movie.Poster === "N/A"
        ? "https://via.placeholder.com/300x450?text=No+Image"
        : movie.Poster;

    const card = document.createElement("div");

    card.className = "movie-card";

    card.innerHTML = `
        <img src="${poster}" alt="${movie.Title}">

        <div class="movie-content">

            <h3>${movie.Title}</h3>

            <p><strong>Year:</strong> ${movie.Year}</p>

            <p><strong>Type:</strong> ${movie.Type}</p>

            <button class="details-btn"
            onclick="getMovieDetails('${movie.imdbID}')">
            View Details
            </button>

            <button class="favorite-btn"
            onclick="removeFavorite('${movie.imdbID}')">
            🗑 Remove
            </button>

        </div>
    `;

    favoriteContainer.appendChild(card);
  });
}

function removeFavorite(imdbID) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.filter((movie) => movie.imdbID !== imdbID);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  loadFavorites();
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

themeBtn.addEventListener("click", toggleTheme);

function loadTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

function populateYears() {
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= 1950; year--) {
    const option = document.createElement("option");

    option.value = year;

    option.textContent = year;

    yearFilter.appendChild(option);
  }
}

yearFilter.addEventListener("change", () => {
  if (movieInput.value.trim() !== "") {
    searchMovie();
  }
});

typeFilter.addEventListener("change", () => {
  if (movieInput.value.trim() != "") {
    searchMovie();
  }
});

function saveSearchHistory(movieName) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  history = history.filter((item) => item !== movieName);

  history.unshift(movieName);

  if (history.length > 5) {
    history.pop();
  }

  localStorage.setItem("history", JSON.stringify(history));
}

const oldSearchMovie = searchMovie;

searchMovie = function () {
  const movie = movieInput.value.trim();

  if (movie === "") {
    showError("Please enter a movie name.");
    return;
  }

  saveSearchHistory(movie);
  oldSearchMovie();
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    movieModal.style.display = "none";
  }
});

function initializeApp() {
  populateYears();

  loadFavorites();

  loadTheme();
}

initializeApp();