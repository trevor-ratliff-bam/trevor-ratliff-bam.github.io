// Flashcard Manager Class
class FlashcardManager {
  constructor() {
    // DOM elements - centralized access
    this.elements = {
      fileInput: document.getElementById("file-input"),
      prevBtn: document.getElementById("prev-btn"),
      nextBtn: document.getElementById("next-btn"),
      shuffleBtn: document.getElementById("shuffle-btn"),
      flashcard: document.getElementById("flashcard"),
      cardWord: document.getElementById("card-word"),
      cardDefinition: document.getElementById("card-definition"),
      progress: document.getElementById("progress"),
      deckTitle: document.getElementById("deck-title"),
      deckDescription: document.getElementById("deck-description"),
      randomizeToggle: document.getElementById("randomize-toggle"),
      controlsSection: document.getElementById("controls-section"),
      toggleControlsBtn: document.getElementById("toggle-controls"),
      searchInput: document.getElementById("search-input"),
      clearSearchBtn: document.getElementById("clear-search"),
      cardCounter: document.getElementById("card-counter"),
    };

    // Application state
    this.flashcards = [];
    this.originalOrder = [];
    this.currentCardIndex = 0;
    this.isRandomized = true;
    this.filteredCards = [];
    this.isInitialized = false;
  }

  // Initialize the application
  init() {
    if (this.isInitialized) return;

    // Set up event listeners
    this.setupEventListeners();

    // Initialize UI
    this.updateNavigationButtons();
    this.updateProgress();
    this.updateShuffleButton();
    this.updateCardCounter();

    this.isInitialized = true;
  }

  // Set up all event listeners
  setupEventListeners() {
    const {
      fileInput,
      prevBtn,
      nextBtn,
      shuffleBtn,
      flashcard,
      randomizeToggle,
      searchInput,
      clearSearchBtn,
      toggleControlsBtn,
      deckTitle,
    } = this.elements;

    fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
    prevBtn.addEventListener("click", () => this.showPreviousCard());
    nextBtn.addEventListener("click", () => this.showNextCard());
    shuffleBtn.addEventListener("click", () => this.shuffleCards());
    flashcard.addEventListener("click", () => this.flipCard());
    randomizeToggle.addEventListener("change", () =>
      this.toggleRandomization(),
    );
    searchInput.addEventListener("input", () => this.filterCards());
    clearSearchBtn.addEventListener("click", () => this.clearSearch());

    // Toggle controls button and deck title
    if (toggleControlsBtn) {
      toggleControlsBtn.addEventListener("click", () => this.toggleControls());
    }
    if (deckTitle) {
      deckTitle.addEventListener("click", () => this.toggleControls());
    }
  }

  // Handle file selection
  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.loadFlashcards(data);
      } catch (error) {
        this.showError("Error parsing JSON file: " + error.message);
      }
    };
    reader.readAsText(file);
  }

  // Load flashcards from data
  loadFlashcards(data) {
    if (!data.cards || !Array.isArray(data.cards)) {
      this.showError("Invalid data format. Expected an array of cards.");
      return;
    }

    this.flashcards = data.cards;
    this.originalOrder = [...this.flashcards];
    this.elements.deckTitle.textContent = data.title || "Flashcard Deck";
    this.elements.deckDescription.textContent =
      data.description || "No description provided";

    if (this.flashcards.length > 0) {
      this.currentCardIndex = 0;
      this.filteredCards = [...this.flashcards];

      // If randomization is enabled, shuffle the cards
      if (this.isRandomized) {
        this.shuffleCards();
      } else {
        // Restore original order
        this.flashcards = [...this.originalOrder];
      }

      this.updateNavigationButtons();
      this.updateProgress();
      this.updateShuffleButton();
      this.updateCardCounter();
      this.displayCard();
    } else {
      this.elements.cardWord.textContent = "No cards available";
      this.elements.cardDefinition.textContent =
        "Please load a valid data file";
    }
  }

  // Display current card
  displayCard() {
    if (this.flashcards.length === 0) return;

    const currentCard = this.flashcards[this.currentCardIndex];
    this.elements.cardWord.textContent = currentCard.word || "";
    this.elements.cardDefinition.textContent = currentCard.definition || "";

    // Reset flip state
    this.elements.flashcard.classList.remove("flipped");
  }

  // Flip the card
  flipCard() {
    if (this.flashcards.length === 0) return;
    this.elements.flashcard.classList.toggle("flipped");
  }

  // Show previous card
  showPreviousCard() {
    if (this.flashcards.length === 0) return;

    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.displayCard();
      this.updateNavigationButtons();
      this.updateProgress();
      this.updateCardCounter();
    }
  }

  // Show next card
  showNextCard() {
    if (this.flashcards.length === 0) return;

    if (this.currentCardIndex < this.flashcards.length - 1) {
      this.currentCardIndex++;
      this.displayCard();
      this.updateNavigationButtons();
      this.updateProgress();
      this.updateCardCounter();
    }
  }

  // Shuffle cards using Fisher-Yates algorithm
  shuffleCards() {
    if (this.flashcards.length <= 1) return;
    if (!this.isRandomized) return;

    // Fisher-Yates shuffle algorithm
    for (let i = this.flashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.flashcards[i], this.flashcards[j]] = [
        this.flashcards[j],
        this.flashcards[i],
      ];
    }

    this.currentCardIndex = 0;
    this.displayCard();
    this.updateNavigationButtons();
    this.updateProgress();
  }

  // Update navigation button states
  updateNavigationButtons() {
    const { prevBtn, nextBtn } = this.elements;
    prevBtn.disabled = this.currentCardIndex === 0;
    nextBtn.disabled = this.currentCardIndex === this.flashcards.length - 1;
  }

  // Update progress display
  updateProgress() {
    const { progress } = this.elements;
    if (this.flashcards.length > 0) {
      progress.textContent = `${this.currentCardIndex + 1} / ${this.flashcards.length}`;
    } else {
      progress.textContent = "0 / 0";
    }
  }

  // Update card counter display
  updateCardCounter() {
    const { cardCounter } = this.elements;
    if (cardCounter) {
      if (this.flashcards.length > 0) {
        cardCounter.textContent = `Card ${this.currentCardIndex + 1} of ${this.filteredCards.length}`;
      } else {
        cardCounter.textContent = "No cards";
      }
    }
  }

  // Update shuffle button based on randomization toggle
  updateShuffleButton() {
    const { shuffleBtn } = this.elements;
    shuffleBtn.disabled = !this.isRandomized || this.flashcards.length <= 1;
  }

  // Toggle randomization
  toggleRandomization() {
    this.isRandomized = this.elements.randomizeToggle.checked;
    this.updateShuffleButton();

    if (this.isRandomized && this.flashcards.length > 1) {
      this.shuffleCards();
    } else if (!this.isRandomized && this.flashcards.length > 1) {
      this.flashcards = [...this.originalOrder];
      this.currentCardIndex = 0;
      this.displayCard();
      this.updateNavigationButtons();
      this.updateProgress();
      this.updateCardCounter();
    }
  }

  // Filter cards based on search input
  filterCards() {
    const searchTerm = this.elements.searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
      // If search is empty, show all cards
      this.flashcards = [...this.originalOrder];
      this.currentCardIndex = 0;
    } else {
      // Filter cards that match the search term in word or definition
      this.filteredCards = this.flashcards.filter(
        (card) =>
          card.word.toLowerCase().includes(searchTerm) ||
          card.definition.toLowerCase().includes(searchTerm),
      );

      if (this.filteredCards.length > 0) {
        // Set current card to the first match
        this.currentCardIndex = 0;
      } else {
        // No matches found
        this.currentCardIndex = -1;
      }
    }

    // Update display if there are cards to show
    if (this.filteredCards.length > 0) {
      this.flashcards = [...this.filteredCards];
      this.displayCard();
    } else {
      // No cards to display
      this.elements.cardWord.textContent = "No matching cards found";
      this.elements.cardDefinition.textContent = "Try a different search term";
    }
    this.updateNavigationButtons();
    this.updateProgress();
    this.updateCardCounter();
  }

  // Clear search
  clearSearch() {
    this.elements.searchInput.value = "";
    this.flashcards = [...this.originalOrder];
    this.currentCardIndex = 0;
    this.shuffleCards();
    this.displayCard();
    this.updateNavigationButtons();
    this.updateProgress();
    this.updateCardCounter();
  }

  // Toggle controls section visibility
  toggleControls() {
    const { controlsSection, toggleControlsBtn } = this.elements;
    if (controlsSection) {
      controlsSection.classList.toggle("hidden");

      // Update button text
      if (toggleControlsBtn) {
        toggleControlsBtn.textContent = controlsSection.classList.contains(
          "hidden",
        )
          ? "🞂"
          : "🞃";
      }
    }
  }

  // Show error message to user
  showError(message) {
    alert(message);
  }
}

// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const flashcardManager = new FlashcardManager();
  flashcardManager.init();

  // Register service worker for PWA functionality
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((error) => {
          console.log("SW registration failed: ", error);
        });
    });
  }

  // Add touch support for mobile devices
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    // Add touch-friendly class to body for specific mobile styling
    document.body.classList.add("touch-device");
  }

  // Theme toggle functionality
  const toggleThemeBtn = document.getElementById("toggle-theme");
  const darkModeToggleLink = document.getElementById("dark-mode-toggle");

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    darkModeToggleLink.href = "dark-mode.css";
    toggleThemeBtn.textContent = "☀️ Light Mode";
  }

  // Add click event listener
  toggleThemeBtn.addEventListener("click", function () {
    if (darkModeToggleLink.href.includes("dark")) {
      darkModeToggleLink.href = "";
      toggleThemeBtn.textContent = "🌓 Dark Mode";
      localStorage.setItem("theme", "light");
    } else {
      darkModeToggleLink.href = "dark-mode.css";
      toggleThemeBtn.textContent = "☀️ Light Mode";
      localStorage.setItem("theme", "dark");
    }
  });
});
