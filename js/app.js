// Variables
const symbols = [
      'fa-anchor',
      'fa-anchor',
      'fa-bicycle',
      'fa-bicycle',
      'fa-paper-plane-o',
      'fa-paper-plane-o',
      'fa-diamond',
      'fa-diamond',
      'fa-bomb',
      'fa-bomb',
      'fa-leaf',
      'fa-leaf',
      'fa-cube',
      'fa-cube',
      'fa-bolt',
      'fa-bolt',
      ],
      deck = document.getElementById('deck'),
      restartBtn = document.getElementById('restart'),
      winInfo = document.getElementById('modal'),
      againBtn = document.getElementById('play-again'),
      score = document.querySelectorAll('#score i'),
      sec = document.getElementById('seconds'),
      min = document.getElementById('minutes');

/*
 * Variables which are going to be reassigned later:
 * - @cardsCollection - list of css classes to compare by checkCards()
 * - @moves - number of user moves incremented by updateMoves()
 * - @rating - variable determining star rating of the player used by updateRating(),
 * - @matchedCards - number of cards passed by acceptCards()
 * - @seconds,@minutes - numbers used by timer(), startTimer(), stopTimer(), resetTimer()
 */
let cards = [],
    cardsCollection = [],
    moves = 0,
    rating = 3,
    matchedCards = 0,
    comboCounter = 0,
    seconds = 0,
    minutes = 0;
    
/*
 * Display the cards on the page with createDeck().
 *   - shuffle the list of symbols using shuffle();
 *   - loop through symbols and create card HTML.
 *   - add each card's HTML to the page.
 *   - add each card to cards array.
 *   - listen for the click event on created HTML cards with activateCard().
 */
createDeck();

function createDeck(){
  let shuffledSymbols = shuffle(symbols);
    
  for (let i = 0; i < shuffledSymbols.length; i++) {
    const card = document.createElement('li'),
          cardSymbol = document.createElement('i');
    
    cardSymbol.classList.add('fa',shuffledSymbols[i]);
    card.append(cardSymbol);
    card.classList.add('card');
    deck.append(card);
    cards.push(card);
  }
  
  activateCard();
}

/* Shuffle function from http://stackoverflow.com/a/2450976
* @ param {array} array - Array of elements to shuffle
*/
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
* Add event listener to each cards in the @cards list.
* Fire game functions. Do it only when item wasn't cliked and @cardsCollection array has two items in it.
*/
function activateCard(){
  for (let i = 0; i < cards.length; i++) {
    
    cards[i].addEventListener('click', (e) => {
      if (!(e.target.classList.contains('open')) && (cardsCollection.length <= 1)){
        addCards(e.target);
        showCard(e.target);
        checkCards();
        updateMoves(moves);
        updateRating(moves);
        checkWin(matchedCards);
        console.log(comboCounter);
        if(moves === 1){
          startTimer();
        }
      }
    });
  }
}

/*
* Invoked by activateCard().
* Add clicked card to cards collection array.
* @param {object} item - Target of event listener
*/
function addCards(item){
  let card = item.firstElementChild.className;
      
  cardsCollection.push(card);
}

/*
* Invoked by activateCard().
* Add css classes to clicked item.
* @param {object} item - Target of event listener
*/
function showCard(item){
  item.classList.add('open','show','flip');
  moves++;
}

/*
* Invoked by activateCard().
* Check number of cards in cardsCollection array, and compare them.
* Fire function depending on the result.
*/
function checkCards(){
  if ((cardsCollection.length === 2) && (cardsCollection[0] != cardsCollection[1])) {
    dismisCards();
  } else if (cardsCollection[0] === cardsCollection[1]) {
    acceptCards();
  }
}

// Invoked by checkCards(). Remove css classes from cards in cardsCollection array.
function dismisCards(){
  for (let i = 0; i < cards.length; i++) {
    setTimeout(()=>{cards[i].classList.remove('open','show','flip'), cardsCollection = []},1000);
  }
  comboCounter = 0;
}

// Invoked by checkCards(). Increases matchedCards variable.
function acceptCards(){
  let winCards = document.querySelectorAll('div .open');
  comboCounter++;
  combo(comboCounter);
  for (let i = 0; i < winCards.length; i++) {
    animateCard(winCards[i]);
    cardsCollection = [];
    matchedCards++;
  }
}

/*Invoked by acceptCards().
* Fires combo notifiaction. Updates moves counter.
* @ param {number} num - nubmer to compare and to print in combo notification.
*/
function combo(num){
  const comboWindow = document.getElementById('combo'),
        comboNumber = document.getElementById('combo-number');
  
  if (num >= 2) {
    comboNumber.textContent = num;
    comboWindow.classList.add('scaleUp');
    setTimeout(()=>{comboWindow.classList.remove('scaleUp')}, 800);
    moves--;
    updateMoves(moves);
    updateRating(moves);
  }
}

// Invoked by acceptCards(). @ param {object} item - item to add/remove css styles.
function animateCard(item){
  item.classList.add('match');
  item.classList.remove('open', 'show');
  setTimeout(()=>{item.style.opacity = 0},1000);
}

/*
* Invoked by activateCard().
* Display number of moves to the player.
* @ param {number} num - value of moves variable.
*/
function updateMoves(num){
  const movesCounter = document.getElementById('moves');
  movesCounter.textContent = num;
}

/*
* Invoked by activateCard().
* Compare number of moves with star rating.
* Decrease rating accordingly to number of moves.
* @ param {number} num - value of moves variable.
*/
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
  }
}

/*
* Invoked by activateCard().
* Check if number of matched cards is equal to overall number of cards in the dec.
* @ param {number} num - value of acceptedCards variable.
*/
function checkWin(num){
  if (num === cards.length) {
    finalMessage();
    stopTimer();
  }
}

// Invoked by checkWin(). Display modal message if checkWin() condition is true.
function finalMessage() {
  const finalCount = document.getElementById('moves-final-count'),
        seconds = document.getElementById('final-seconds'),
        minutes = document.getElementById('final-minutes');
  
  winInfo.style.display = 'block';
  finalCount.textContent = moves;
  displayRating(rating);
  printTime(minutes,seconds);
}

//Saves user name and score in sessionStorage
document.getElementById('save-result').addEventListener('click',()=>{
  saveUser();
});

//Invoked by save-result button. Adds new user score name and score to sessionStorage.
function saveUser(){
  let userName = document.getElementById('user-name').value;
  
  console.log(userName);
  
  sessionStorage.setItem(userName,moves);
  
  addUserScore(userName);
}

/*
* Invoked by saveUser(), displayResults().
* @ param {string} key - sessionStorage key.
* Creates paragraph with user name and score.
*/
function addUserScore(key){
  const tableName = sessionStorage.getItem( key ),
        resultsParagraph = document.createElement('p'),
        results = document.getElementById('results');
  
  results.append(resultsParagraph);
  resultsParagraph.textContent = `${key} scored ${tableName}`;
}

/*
* Invoked by finalMessage().
* Display star rating in modal message based on rating variable.
* @ param {number} num - value of rating variable.
*/
function displayRating(num){
  const finalRating = document.getElementById('final-rating');
  
  switch (num) {
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

/*
* Set of timer functions : startTimer(), stopTimer(), resetTimer().
* timer() - increases seconds and minutes variables.
*/
// Invoked by activateCard().
function startTimer() {
  interval = setInterval(timer,1000);
}

// Invoked by checkWin().
function stopTimer(){
  clearInterval(interval);
}

// Invoked by resetGame().
function resetTimer(){
  seconds = 0;
  minutes = 0;
  stopTimer();
  printTime(min,sec);
}

// Invoked by startTimer().
function timer(){
  if ((seconds >= 0) && (seconds < 59)) {
    seconds++
  } else {
    minutes++;
    seconds = 0;
  }
  printTime(min,sec);
};

/*
* Invoked by timer(), resetTimer(), finalMessage().
* Display time from startTimer()
* @ param {object} elem1,elem2 - place to display time.
*/
function printTime(elem1,elem2){
  if (minutes < 10) {
    elem1.textContent = `0${minutes}`;
  } else {
    elem1.textContent = minutes;
  }
  
  if (seconds < 10) {
    elem2.textContent = `0${seconds}`;
  } else {
    elem2.textContent = seconds;
  }
}

restartBtn.addEventListener('click', () => {
  restartGame();
});

// Hide modal window and restart game
againBtn.addEventListener('click', () => {
  winInfo.style.display = 'none';
  restartGame();
});

// Reset all variables to initial value, remove cards HTML and create new set, reset timer.
function restartGame(){
  cardsCollection = [];
  cards = [];
  matchedCards = 0;
  moves = 0;
  rating = 3;
  comboCounter = 0;
  updateRating(0);
  updateMoves(0);
  resetDeck();
  createDeck();
  resetTimer();
}

// Remove all cards HTML
function resetDeck(){
  while(deck.firstChild){
    deck.removeChild(deck.firstChild);
  }
}