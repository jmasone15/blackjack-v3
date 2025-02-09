import { Auth } from './Auth';
import { Player } from './Player';
import { Money } from './Money';
import { Card } from './Card';
import htmlElements from '../utils/htmlElements';
import { delay } from '../utils/delay';

// Required HTMLElements
const {
	loginModal,
	gameOverModal,
	preGameDiv,
	gameOverModalHeader,
	gameOverModalBodyDiv,
	confetti
} = htmlElements;

// Interfaces
interface WinTextObj {
	userWin: string;
	header: string;
	message: string;
}

export class Game {
	// Game Variables
	private preGame: boolean = true;
	private userAction: boolean = false;
	private money: Money = new Money(this);
	private playingCards: Card[] = [];
	private roundCount: number = 0;
	private cardIdx: number = 0;

	// Deck Variables
	private deckCount: number = 1;
	private suits: string[] = ['H', 'D', 'C', 'S'];
	private cards: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

	// Authentication
	private auth: Auth = new Auth(this);

	// Players
	private dealer: Player = new Player(true);
	private user: Player = new Player(false);

	private async init() {
		this.preGame = false;

		// Hide pregame section
		preGameDiv.setAttribute('class', 'd-none');

		this.roundCount++;

		await this.money.subtract();

		// Generate Shuffled Cards if needed.
		if (this.roundCount == 1) {
			this.createDeck();
			// this.setDefaultStartingCards();
		} else {
			this.reset();
		}

		// Deal Initial Cards
		for (let i = 0; i < 4; i++) {
			// Delay between deals
			await delay(500);

			if (i % 2 == 0) {
				await this.user.deal(this.playingCards[this.cardIdx]);
			} else {
				await this.dealer.deal(this.playingCards[this.cardIdx], i !== 3);
			}

			// Increment cardIdx
			this.cardIdx++;
		}

		await delay(500);

		// Initial end of game checks
		if (this.user.total == 21 || this.dealer.total == 21) {
			this.endUserTurn();
			return;
		}

		this.userAction = true;
	}

	public async preRound(skipMainScreen: boolean) {
		// Auth Check
		if (!this.auth.isLoggedIn) {
			loginModal.show();
			return;
		} else if (!this.auth.username || !this.auth.initialMoney) {
			await this.auth.getUserData();
		}

		// Clear stale data
		this.reset();
		gameOverModal.hide();
		loginModal.hide();
		this.preGame = true;

		// Set Cash & Bet
		if (!this.money.username) {
			this.money.amount = this.auth.initialMoney;
			this.money.username = this.auth.username;
		}
		this.money.populateMoney();
		this.money.populateBet();

		// Show Pregame Section
		preGameDiv.setAttribute('class', 'px-3');

		if (skipMainScreen) {
			return this.init();
		}
	}

	private createDeck() {
		// Generate Deck based on Game parameters.
		for (let i = 0; i < this.deckCount; i++) {
			this.suits.forEach((suit) => {
				this.cards.forEach((card) => {
					this.playingCards.push(new Card(suit, card));
				});
			});
		}

		// Shuffle using Fisher-Yates Algorithim.
		for (let i = this.playingCards.length - 1; i > 0; i--) {
			// Generate a random index from 0 to i.
			const randomIndex = Math.floor(Math.random() * (i + 1));

			// Swap elements at i and randomIndex.
			[this.playingCards[i], this.playingCards[randomIndex]] = [
				this.playingCards[randomIndex],
				this.playingCards[i]
			];
		}

		// Set Card Ids
		for (let i = 0; i < this.playingCards.length; i++) {
			this.playingCards[i].id = i;
		}
	}

	// endUserTurn() {
	// 	this.userAction = false;

	// 	// Handle Buttons
	// 	this.standBtn.turnOffButton();
	// 	this.splitBtn.turnOffButton();
	// 	this.doubleBtn.turnOffButton();
	// 	this.hitBtn.turnOffButton();

	// 	return this.dealerTurn();
	// }

	async dealerTurn() {
		this.dealer.hand[1].flipCard();
		this.dealer.hideTotal = false;
		this.dealer.calculateHandTotal();

		await delay(500);

		if (this.user.total < 21) {
			while (this.dealer.total < 17) {
				await this.dealer.deal(this.playingCards[this.cardIdx]);
				this.cardIdx++;
			}
		}

		return this.endGame();
	}

	determineWinner(): WinTextObj {
		let userWin = '';
		let header = '';
		let message = '';

		if (this.dealer.total > 21) {
			userWin = 'yes';
			header = 'You win!';
			message = 'Dealer Bust.';
		} else if (this.user.total > 21) {
			userWin = 'no';
			header = 'You lose!';
			message = 'User Bust.';
		} else if (this.dealer.total == this.user.total) {
			userWin = 'push';
			header = 'Push';
			message = "Y'all tied.";
		} else if (this.dealer.total == 21) {
			userWin = 'no';
			header = 'You lose!';
			message = 'Dealer Blackjack.';
		} else if (this.user.total == 21) {
			userWin = 'yes';
			header = 'You win!';
			message = 'User Blackjack.';
		} else if (this.dealer.total > this.user.total) {
			userWin = 'no';
			header = 'You lose!';
			message = 'Dealer has better hand.';
		} else {
			userWin = 'yes';
			header = 'You win!';
			message = 'User has better hand.';
		}

		return {
			userWin,
			header,
			message
		};
	}

	async endGame() {
		const { userWin, header, message } = this.determineWinner();

		gameOverModalHeader.innerText = header;
		gameOverModalBodyDiv.innerText = message;
		gameOverModal.show();

		// Confetti toss
		if (userWin === 'yes') {
			await delay(250);
			this.money.add(true);
			await confetti.addConfetti({ confettiNumber: 500 });
			confetti.clearCanvas();
		} else if (userWin === 'push') {
			this.money.add(false);
		}
	}

	private reset() {
		// Clear stale Player data
		this.dealer = new Player(true);
		this.user = new Player(false);

		// Clear stale UI elements
		this.user.reset();
		this.dealer.reset();
	}
}
