// Variables
const deck = document.getElementById('deck'),
      cards = document.querySelectorAll('.card'),
      restartBtn = document.getElementById('restart'),
      winInfo = document.getElementById('modal'),
      againBtn = document.getElementById('play-again'),
      score = document.querySelectorAll('#score i'),
      sec = document.getElementById('seconds'),
      min = document.getElementById('minutes');

let cardsCollection = [],
    moves = 0,
    rating = 3,
    matchedCards = 0,
    seconds = 0,
    minutes = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
resetDeck();

function resetDeck(){
  cardsArray = Array.from(cards);

  shuffledCards = shuffle(cardsArray);

  for (let i = 0; i < shuffledCards.length; i++) {
    deck.append(shuffledCards[i]);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Event listener for cards clicked
for (let i = 0; i < cards.length; i++) {
  
  cards[i].addEventListener('click', (e) => {
    if (cardsCollection.length <= 1){
      addCards(e);
      showCard(e);
      checkCards();
      updateMoves(moves);
      updateRating(moves);
      checkWin(matchedCards);
      if(moves === 1){
        startTimer();
      }
    }
  });
}

// Add cards to the checking list
function addCards(item){
  let card = item.target.firstElementChild.className;
      
  cardsCollection.push(card);
}

// Show clicked card
function showCard(item){
  item.target.classList.add('open','show','flip');
  moves++;
}

// Check cards for match. If doesn't match dismiss them.
function checkCards(){
  if ((cardsCollection.length === 2) && (cardsCollection[0] != cardsCollection[1])) {
    dismisCards();
  } else if (cardsCollection[0] === cardsCollection[1]) {
    acceptCards();
  }
}

function dismisCards(){
  for (let i = 0; i < cards.length; i++) {
    setTimeout(()=>{cards[i].classList.remove('open','show','flip'), cardsCollection = []},1000);
  }
}

function acceptCards(){
  let winCards = document.querySelectorAll('div .open');
  
  for (let i = 0; i < winCards.length; i++) {
    winCards[i].classList.add('match');
    winCards[i].classList.remove('open', 'show');
    cardsCollection = [];
    matchedCards++;
  }
}

// Update moves counter
function updateMoves(num){
  const movesCounter = document.getElementById('moves');
  movesCounter.textContent = num;
}

// Compare moves with star rating
function updateRating(num){
  switch (num) {
    case 0:
      for (let i = 0; i < score.length; i++) {
        score[i].style.color = '#000';
      }
      break;
    case 20:
      score[2].style.color = '#fff';
      rating--;
      break;
    case 35:
      score[1].style.color = '#fff';
      rating--;
      break;
    case 40:
      score[0].style.color = '#fff';
      rating--;
      break;
  }
}

// Check for win
function checkWin(num){
  if (num === cards.length) {
    finalMessage();
    stopTimer();
  }
}

// Display modal when game is finished
function finalMessage() {
  const finalCount = document.getElementById('moves-final-count'),
        seconds = document.getElementById('final-seconds'),
        minutes = document.getElementById('final-minutes');
  
  winInfo.style.display = 'block';
  finalCount.textContent = moves;
  displayRating(rating);
  printTime(minutes,seconds);
}

// Rating for modal message
function displayRating(num){
  const finalRating = document.getElementById('final-rating');
  
  switch (num) {
    case 0:
      finalRating.textContent = '0 stars :(';
      break;
    case 1:
      finalRating.innerHTML = '<i class="fa fa-star"></i>';
      break;
    case 2:
      finalRating.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i>';
      break;
    case 3:
      finalRating.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
      break;
      
  }
}

// Timer
function startTimer() {
  interval = setInterval(timer,1000);
}

function stopTimer(){
  clearInterval(interval);
}

function resetTimer(){
  seconds = 0;
  minutes = 0;
  stopTimer();
  printTime(min,sec);
}
        
function timer(){
  if ((seconds >= 0) && (seconds < 59)) {
    seconds++
  } else {
    minutes++;
    seconds = 0;
  }
  printTime(min,sec);
};

function printTime(elem1,elem2){
  if (minutes < 10) {
    elem1.textContent = '0' + minutes;
  } else {
    elem1.textContent = minutes;
  }
  
  if (seconds < 10) {
    elem2.textContent = '0' + seconds;
  } else {
    elem2.textContent = seconds;
  }
}

// Restart button, Play again button
restartBtn.addEventListener('click', () => {
  restartGame();
  resetTimer();
});

againBtn.addEventListener('click', () => {
  winInfo.style.display = 'none';
  restartGame();
});

function restartGame(){
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove('match' , 'open' , 'show');
  }
  cardsCollection = [];
  matchedCards = 0;
  moves = 0;
  rating = 3;
  updateRating(0);
  updateMoves(0);
  resetDeck();
  resetTimer();
}