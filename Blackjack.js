// Instantiate variables
var playerHand, dealerHand = [];
var playerHandValue, dealerHandValue, stayClickCount = 0, hitClickCount = 0;

// Creates the deck in unshuffled order
var createDeck = function() {
  var deck = [];
  var suitType;
  // Creates the card names
	var cardNames = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  // Runs a loop to put each card with a suit number
  for(var suit = 0; suit < 4; suit++) {
    // Runs a loop to match each object in the cardName array with a number
    for(var val = 0; val < 13; val++) {
      var cardValue = val + 1;
      // Makes J, Q, and K equal 10
      if(cardValue >= 11 && cardValue <=13) {
        cardValue = 10;
      } 
      // Makes A equal 11
      else if (cardValue === 1) {
        cardValue = 11;
      }
      // Matches the suit number with a suit
      if(suit == 0){
        suitType = 'Jacks';
      } else if(suit == 1){
        suitType = 'Spades';
      } else if(suit == 2){
        suitType = 'Hearts';
      } else if(suit == 3){
        suitType = 'Diamonds';
      }
      // Places each card into the deck
      deck.push({'val' : cardValue, 'name' : cardNames[val], 'suit' : suitType});	
    }
  }
	return deck;
};

// Shuffles the contents to the deck into a random order
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // Runs until no more variables
  while (0 !== currentIndex) {
    // Picks a remaining card
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // Swaps the cards around
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Creates the deck and shuffles the cards
function createAndShuffleDeck(){
  // Runs the createDeck function and then shuffles the deck
  deck = createDeck();
  shuffledDeck = shuffle(deck);
  
  // Test check for double aces
  //deck[0] = ({'val' : 11, 'name' : "A", 'suit' : "Hearts"})
  //deck[1] = ({'val' : 11, 'name' : "A", 'suit' : "Jacks"})
  //deck[2] = ({'val' : 11, 'name' : "A", 'suit' : "Spades"})
  //deck[3] = ({'val' : 11, 'name' : "A", 'suit' : "Clubs"})

  // Sets the first 2 cards for the player and dealer
  playerHand = [deck[0], deck[2]];
  dealerHand = [deck[1], deck[3]];
	// Sets the starting value of the player and dealer hands
  playerHandValue = playerHand[0].val + playerHand[1].val;
  dealerHandValue = dealerHand[0].val + dealerHand[1].val;
}

// Runs the function that adds the next card to the player's deck when they choose the 'Hit' button
$( '#playerHitButton' ).on("click", function(){
	// Sets buttonClickCount to 1 to make the first if in the checkForWin function not be thrown
  hitClickCount = 1;
  // Takes the length of both decks to find the next card in the deck
  var nextCard = playerHand.length + dealerHand.length;
  // Puts the next card in the deck into the players hand
  playerHand.push(deck[nextCard]);
  // Takes the length of the playerHand array and substracts 1 to find the new card's position in the array
  var playerHandLength = playerHand.length - 1;
  // Appends the new card to the player's list of cards
  $('#playerCards').append('<p>&nbsp;&nbsp;' + playerHand[playerHandLength].name + ' of ' + playerHand[playerHandLength].suit + '</p>'); 
  // Resets the playerHandValue to 0 and runs a for loop that adds up the player's hand value
  playerHandValue = 0;
  for(var i = 0; i < playerHand.length; i++) {
    playerHandValue += playerHand[i].val;
  	setPlayerValueHtml(playerHandValue);
  }
  // Checks to see if the player or dealer has won after the player hits
  checkForWin(playerHandValue, dealerHandValue);
});

// Adds the next card to the dealers's deck when called
function dealerHit(){
  // Takes the length of both decks to find the next card in the deck
  var nextCard = playerHand.length + dealerHand.length;
  // Puts the next card in the deck into the dealer's hand
  dealerHand.push(deck[nextCard]);
  // Takes the length of the dealerHand array and substracts 1 to find the new card's position in the array
  var dealerHandLength = dealerHand.length - 1;
  // Appends the new card to the dealer's list of cards
  $('#dealerCards').append('<p>&nbsp;&nbsp;' + dealerHand[dealerHandLength].name + ' of ' + dealerHand[dealerHandLength].suit + '</p>');
  // Resets the dealerHandValue to 0 and runs a for loop that adds up the dealer's hand value
  dealerHandValue = 0;
  for(var x = 0; x < dealerHand.length; x++) {
    dealerHandValue += dealerHand[x].val;
    setDealerValueHtml(dealerHandValue);
  }
  // Checks to see if the player or dealer has won after the dealer hits
  checkForWin(playerHandValue, dealerHandValue);
}

// Next 2 functions display the values for both players
function setPlayerValueHtml(playerHandValue){
	$('#playerCardsValue').html('<p style="font-weight:bold;">&nbsp;&nbsp;Player Hand Value: ' + playerHandValue + '</p>');
}
function setDealerValueHtml(dealerHandValue){
	$('#dealerCardsValue').html('<p style="font-weight:bold;">&nbsp;&nbsp;Dealer Hand Value: ' + dealerHandValue + '</p>');
}

// Next 3 functions display who wins depending on which is called
function bothWin() {
	$('#winnerContainer').append("<p style='background:#F0E68C;'><strong>Player and Dealer</strong> have tied.</p>");
}
function playerWins() {
	$('#winnerContainer').append("<p style='background:#90EE90;'>The <strong>player</strong> has won the game!</p>");
}
function dealerWins() {
	$('#winnerContainer').append("<p style='background:#FF6347'>The <strong>Dealer</strong> has won the game.</p>");
}

// Checks to see if either player has won with current cards in each hand
function checkForWin(playerHandValueIncoming, dealerHandValueIncoming) {
	// Runs the player and dealer hand through aceChecker
  var playerHandValue;
  var dealerHandValue;
  
  // Runs aceChecker if the player deck is greater than 21 to see if it contains an "A" tp reduce
  if (playerHandValueIncoming > 21) {
  	playerHandValue = aceChecker(playerHand, playerHandValueIncoming, 1);
  } else {
  	playerHandValue = playerHandValueIncoming;
  }
  // Runs aceChecker if the dealer deck is greater than 21 to see if it contains an "A" tp reduce
  if (dealerHandValueIncoming > 21) {
  	dealerHandValue = aceChecker(dealerHand, dealerHandValueIncoming, 2);
  } else {
  	dealerHandValue = dealerHandValueIncoming;
  }
  
  //playerHandValue = 21;
  //dealerHandValue = 21;
  //playerHandValue = 22;
  //dealerHandValue = 22;
  //playerHandValue = 17;
  //dealerHandValue = 17;
  
  // Check to see if either player wins with first 2 cards
  if (playerHand.length == 2 && dealerHand.length == 2 && playerHandValue < 22 && dealerHandValue < 22 && hitClickCount == 0 && stayClickCount == 0) {
    // Both players have 21 and tie
    if (playerHandValue == 21 && dealerHandValue == 21) {
      disablePlayerButtons();
      bothWin();
    }
    // Player has 21 with opening two cards
    else if (playerHandValue == 21 && dealerHandValue < 21) {
      disablePlayerButtons();
      playerWins();
    }
    // Dealer has 21 with opening two cards
    else if (dealerHandValue == 21 && playerHandValue < 21) {
      disablePlayerButtons();
      dealerWins();
    }
  }
  // Runs if neither player has 21 with first two cards
  else if (hitClickCount == 1 || stayClickCount == 1){
  	console.log('this is running');
    // Both players have 21 and tie
    if (playerHandValue == 21 && dealerHandValue == 21) {
      disablePlayerButtons();
      bothWin();
    }
    // Dealer has 21 and player has less than 21, dealer wins
    else if (dealerHandValue == 21 && playerHandValue < 21) {
      disablePlayerButtons();
      dealerWins();
    }
    // Player has 21 and dealer has less than 21 but more than 16, player wins
    else if (playerHandValue == 21 && dealerHandValue < 21 && dealerHandValue > 16) {
      disablePlayerButtons();
      playerWins();
    }
    // Player has 21 but the dealer has less than 17. Dealer hits until greater than 16
    else if (playerHandValue == 21 && dealerHandValue < 17) {
      dealerHit();
    }
    // Player's hand is greater than dealer's while dealer has greater than 16 but less than 21, player wins
    else if (playerHandValue < 22 && playerHandValue > dealerHandValue && dealerHandValue > 16 && dealerHandValue < 21) {
      disablePlayerButtons();
      playerWins();
    }
    // Player has greater than 21 and busted but dealer has less than 17 so hits until 17 or greater
    else if (playerHandValue > 21 && dealerHandValue < 17) {
      disablePlayerButtons();
      dealerHit();
    }
    // Player has less than 21 but dealer has less than 17 so hits until 17 or greater
    else if (playerHandValue < 21 && dealerHandValue < 17 && stayClickCount == 1) {
      disablePlayerButtons();
      dealerHit();
    }
    // Player has greater 21 and busted, dealer has 17 or greater and wins
    else if (playerHandValue > 21 && dealerHandValue > 16) {
      disablePlayerButtons();
      dealerWins();
    }
    // Player has 21 or less and dealer has greater than 21, player wins
    else if (playerHandValue < 22 && dealerHandValue > 21) {
      disablePlayerButtons();
      playerWins();
    }
    // Player has 21 or less and dealer has greater than 16 and more than player, dealer wins
    else if (playerHandValue < 22 && dealerHandValue > 16 && dealerHandValue > playerHandValue && stayClickCount > 0) {
      disablePlayerButtons();
      dealerWins();
    }
    // Both players have same score and dealer has greater than 16, players tie
    else if (playerHandValue == dealerHandValue && dealerHandValue > 16) {
      disablePlayerButtons();
      bothWin();
    }
  }
}
// Enables player buttons and disables dealer buttons
function enablePlayerButtons() {
  $('#playerHitButton').prop("disabled", false);
  $('#playerStayButton').prop("disabled", false);
}
// Disables the player buttons
function disablePlayerButtons() {
  $('#playerHitButton').prop("disabled", true);
  $('#playerStayButton').prop("disabled", true);
}

// Simulates the dealers turn
function dealerTurn(){
	checkForWin(playerHandValue, dealerHandValue);
  // Continues to run as long as the dealer's hand is less than 17
  while (dealerHandValue < 17) {
    dealerHit();
	}
}

// Checks for aces in the deck
function aceChecker(currentDeck, currentDeckValue, deckSent) { // deckSent determines which deck, player or dealer, was sent
	//console.log(deck[0], deck[1], deck[2], deck[3]);
  //console.log(deck[0].name);
  //console.log(playerHand[0], playerHand[1]);
  //console.log(dealerHand[0], dealerHand[1]);
  console.log("Coming from aceChecker");
  console.log(currentDeck);
  console.log(currentDeckValue);
  console.log(deckSent);
  
  // First checks to seee if the deck value is greater than 21
  if (currentDeckValue > 21) {
  	// Runs a for loop across the length of the current deck being checked
    for (var y = 0; y < currentDeck.length; y++) {
    	// Runs if the deck is greater than 21 and has a card with 'A' that has a value of '11'
    	if (currentDeckValue > 21 && currentDeck[y].name == "A" && currentDeck[y].val == 11) {
      	// Reduces the current value of the 'A' from '11' to '1' and sets it
        currentDeckValue -= 10;
        currentDeck[y].val = 1;
        // Uses deckSent to determine which deck was sent and updates the HTML value
        if (deckSent == 1) {
        	setPlayerValueHtml(currentDeckValue);
       	} else if (deckSent == 2) {
        	setDealerValueHtml(currentDeckValue);
        }
        return currentDeckValue;
      }
    }
    return currentDeckValue;
  }
  else {
    return currentDeckValue;
  }
}

// Disables player buttons when player chooses to 'Stay'
$( "#playerStayButton" ).on("click", function(){
	stayClickCount = 1;
  disablePlayerButtons();
  dealerTurn(); 
});

// Empties the displayed player, dealer, and winner contents
function clearContents() {
	$('#playerCards').empty();
  $('#playerCardsValue').empty();
  $('#dealerCards').empty();
  $('#dealerCardsValue').empty();
  $('#winnerContainer').empty();
}

// Executes when user presses new game button
$( '#newGameButton' ).on("click", function(){
	stayClickCount = 0;
  hitClickCount = 0;
  createAndShuffleDeck();
  clearContents();
  loadPlayersHands();
  enablePlayerButtons();
  checkForWin(playerHandValue, dealerHandValue);
})

// Function to load both players hands and display on page
function loadPlayersHands() {
	// Player cards and value
  $('#playerCards').append('<p>&nbsp;&nbsp;' + playerHand[0].name + ' of ' + playerHand[0].suit + '</p>');
  $('#playerCards').append('<p>&nbsp;&nbsp;' + playerHand[1].name + ' of ' + playerHand[1].suit + '</p>');
  $('#playerCardsValue').append('<p style="font-weight:bold;">&nbsp;&nbsp;Player Hand Value: ' + playerHandValue + '</p>');

  // Dealer card(s) and value
  $('#dealerCards').append('<p>&nbsp;&nbsp;' + dealerHand[0].name + ' of ' + dealerHand[0].suit + '</p>');
  $('#dealerCards').append('<p>&nbsp;&nbsp;' + dealerHand[1].name + ' of ' + dealerHand[1].suit + '</p>');
  $('#dealerCardsValue').append('<p style="font-weight:bold;">&nbsp;&nbsp;Dealer Value: ' + dealerHandValue + '</p>');
}

// Call inital functions on load
createAndShuffleDeck();
loadPlayersHands();
checkForWin(playerHandValue, dealerHandValue);