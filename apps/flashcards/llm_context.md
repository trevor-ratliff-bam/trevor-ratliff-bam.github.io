# LLM Context Memory

## Project Overview
This is a flashcard application built with HTML, CSS, and JavaScript that allows users to study vocabulary through interactive flashcards.

## Key Requirements
1. External data file integration for flashcard content
2. Interactive flashcards that flip on click
3. Navigation controls (next, previous, shuffle)
4. Deck title and description display
5. Progress tracking (current card/total cards)
6. Randomization toggle (default on)
7. Responsive design

## Data Format Specification
- JSON format with title, description, and cards array
- Each card has word and definition properties
- File should be placed in data/ directory

## Technical Implementation Details
- HTML5 for structure and semantic elements
- CSS for styling and animations (particularly flip effect)
- JavaScript for interactivity, file handling, and state management
- No external dependencies required
- Responsive design principles

## User Interface Components
1. Deck title and description header
2. Flashcard element with flip animation
3. Navigation controls (previous, next, shuffle)
4. Randomization toggle switch
5. Progress indicator showing current/total cards
6. File upload/input element

## State Management
- Current card index
- Card deck data
- Randomization flag
- Card flip state (front/back)

## File Structure
- index.html: Main application page
- style.css: Styling and animations
- script.js: Core logic and interactivity
- data/: Directory for flashcard data files
- README.md: Documentation

## Design Principles
- Clean, intuitive user interface
- Responsive layout for different screen sizes
- Accessible markup
- Smooth animations and transitions
- Minimal dependencies
- Easy to extend and customize