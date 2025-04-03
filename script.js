// Word List
const wordList = [
  'gold',
  'luck',
  'clover',
  'rain',
  'charm',
  'parade',
  'leprechaun',
  'treasure',
  'celebration',
'greenery',
  'shenanigans',
'tradition'
]

//declare variables


let selectedWord = ''
let displayedWord = ''
let wrongGuesses = 0
let guessedLetters = []
let wins = 0
let losses = 0
const maxMistakes = 6

// Start Game Function (runs everything)
function startGame (level) {
  //reset game
  wrongGuesses = 0
  guessedLetters = []

  // Set initial image to 6 coins
  document.getElementById('shamrock').src = 'imgs/6-coins.jpg'

  selectedWord = getRandomWord(level)
  displayedWord = '_'.repeat(selectedWord.length)

  updateDifficultyDisplay(level)
  updateUI()

  //Show Game Area/Difficulty Display , hide selection buttons
  document.getElementById('gameArea').classList.remove('d-none')
  document.getElementById('gameArea').classList.add('d-block')

  document.getElementById('difficultyBox').classList.remove('d-none')
  document.getElementById('difficultyBox').classList.add('d-block')

  document.getElementById('difficultySelection').classList.add('d-none')
  //Auto-focus on input
  document.getElementById('letterInput').focus()

  document.getElementById("mainHeader").remove();
}

function getRandomWord (level) {
  let filteredWords = wordList.filter(word => {
    if (level === 'easy') return word.length <= 4
    if (level === 'medium') return word.length >= 5 && word.length <= 7
    if (level === 'hard') return word.length >= 8
  })
  return filteredWords[Math.floor(Math.random() * filteredWords.length)]
}

//update Difficulty Display
function updateDifficultyDisplay (level) {
  let difficultyBox = document.getElementById('difficultyBox')
  difficultyBox.classList.remove('easy', 'medium', 'hard')

  if (level === 'easy') {
    difficultyBox.textContent = 'Difficulty: Easy 🍀'
    difficultyBox.classList.add('easy')
  } else if (level === 'medium') {
    difficultyBox.textContent = 'Difficulty: Medium 🌟'
    difficultyBox.classList.add('medium')
  } else if (level === 'hard') {
    difficultyBox.textContent = 'Difficulty: Hard 💀'
    difficultyBox.classList.add('hard')
  }
}
function updateUI() {
  document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ') // Show word progress with spaces
}

function guessLetter () {
  let inputField = document.getElementById('letterInput') // Get input field
  let guessedLetter = inputField.value.toLowerCase() // Convert input to lowercase

  function showCustomAlert(message, type) {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
      alertDiv.setAttribute('role', 'alert');
      alertDiv.innerHTML = `
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

                                                                                                                                  // Insert alert before the game area
      const gameArea = document.getElementById('gameArea');
      gameArea.parentNode.insertBefore(alertDiv, gameArea);

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
          alertDiv.remove();
      }, 3000);
  }

  //Check if input is a valid letter (A-Z)
  if (!guessedLetter.match(/^[a-z]$/)){
    showCustomAlert('Please enter a valid letter (A-Z)!', 'warning')
    inputField.value = '' // Clear input field
    return // Exit function
  }


  //Check if letter was already guessed
  if(guessedLetters.includes(guessedLetter)){
    showCustomAlert(`You already guessed '${guessedLetter}'. Try a different letter!`, 'info')
    inputField.value = '' // Clear input field
    return
  }

  //Store guessed letter
  guessedLetters.push(guessedLetter)

  //Check if guessed letter is in the selected word
  if (selectedWord.includes(guessedLetter)){
    updateCorrectGuess(guessedLetter)
  } else {
    updateWrongGuess(guessedLetter)
  }

  inputField.value = '' // Clear input field
  document.getElementById('letterInput').focus() // Refocus input field for next guess

}

function playSound(correct) {
  const sound = new Audio(correct ? 'Correct.mp3' : 'Wrong.mp3');
  sound.play();
}

function updateWrongGuess(guessedLetter){ 
  wrongGuesses++
  document.getElementById('wrongLetters').textContent += `${guessedLetter}`

  // Update image based on wrong guesses
  const imageNames = ['6-coins.jpg', '5-coins.webp', '4-coins.jpg', '3-coins.jpg', '2-coins.jpg', '1-coin.jpg'];
  const imageIndex = wrongGuesses;
  document.getElementById('shamrock').src = `imgs/${imageNames[imageIndex]}`;

  playSound(false);
  updateUI(); // Update UI to reflect change

  if (wrongGuesses >= maxMistakes){
    endGame(false);
    document.getElementById('letterInput').disabled = true;
    document.getElementById('guessBtn').disabled = true;
    return;
  }
}

function updateCorrectGuess(guessedLetter){
  let newDisplayedWord =''
  playSound(true);

  for (let i=0; i < selectedWord.length; i++){
    if (selectedWord[i] === guessedLetter){
      newDisplayedWord += guessedLetter // Replace underscore with correct letter
    }else{
    newDisplayedWord += displayedWord[i] // Keep existing correct letters
    }
  }

  displayedWord = newDisplayedWord
  updateUI()

  //  Check if the player has guessed all letters
  if (!displayedWord.includes('_')) {
    endGame(true)
  }

}

function endGame(isWin) {
  // Update score
  if (isWin) {
      wins++;
      document.getElementById('winsCount').textContent = wins;
  } else {
      losses++;
      document.getElementById('lossesCount').textContent = losses;
  }

  let messageBox = document.createElement("div");
  messageBox.id = "gameMessage";
  messageBox.classList.add("alert", "mt-3", "fw-bold");

  if (isWin) {
      messageBox.textContent = "Congratulations! You have guessed the correct word!";
      messageBox.classList.add("alert-success");
  } else {
      messageBox.textContent = "You guessed wrong, the word was " + selectedWord + "!";
      messageBox.classList.add("alert-danger");
      document.getElementById('shamrock').src = 'imgs/X.jpg';
  }

  let gameArea = document.getElementById("gameArea");
  let existingMessage = document.getElementById("gameMessage");
  if (existingMessage) {
      existingMessage.remove();
  }

  gameArea.appendChild(messageBox);
}



function restartGame(){
  // Reset game state
  wrongGuesses = 0
  guessedLetters = []
  document.getElementById('wrongLetters').textContent = "Wrong Guesses: "

  // Re-enable input and button
  document.getElementById('letterInput').disabled = false
  document.getElementById('guessBtn').disabled = false

  // Hide game area and message
  document.getElementById('gameArea').classList.add('d-none')
  document.getElementById('difficultyBox').classList.add('d-none')

  // Show difficulty selection
  document.getElementById('difficultySelection').classList.remove('d-none')

  // Recreate main header if it was removed
  if (!document.getElementById('mainHeader')) {
      const headerRow = document.createElement('div')
      headerRow.className = 'row justify-content-center'

      const headerCol = document.createElement('div')
      headerCol.className = 'col-12 text-center'

      const header = document.createElement('h1')
      header.id = 'mainHeader'
      header.className = 'mb-4'
      header.textContent = 'Shamrock Hangman'

      headerCol.appendChild(header)
      headerRow.appendChild(headerCol)
      document.querySelector('main').prepend(headerRow)
  }

  // Remove end game message if it exists
  const gameMessage = document.getElementById('gameMessage')
  if (gameMessage) {
      gameMessage.remove()
  }
}

// Add event listener to allow adding tasks by pressing Enter
document.getElementById("letterInput").addEventListener("keyup", function (event) {
if (event.key === "Enter") {
    guessLetter();
}
});