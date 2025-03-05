import { Auth } from './Auth';
import { Player } from './Player';
import { Money } from './Money';
import { Card } from './Card';
import htmlElements from '../utils/htmlElements';
import { delay } from '../utils/delay';
import { hideElement } from '../utils/hideElement';

// Required HTMLElements
const {
	loginModal,
	gameOverModal,
	preGameDiv,
	gameOverModalHeader,
	gameOverModalBodyDiv,
	confetti,
	gameButtonsDiv,
	startBtn,
	mainGameDiv,
	moneyDiv,
	leaderboardNavBtn,
	homeNavBtn,
	statsNavBtn,
	hitBtn,
	standBtn,
	mainMenuBtn
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
	public auth: Auth = new Auth(this);

	// Players
	private dealer: Player = new Player(true);
	private user: Player = new Player(false);

	constructor() {
		// Event Listeners that referene game variables
		startBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();
			return this.init();
		});

		hitBtn.addEventListener('click', async (e: Event) => {
			e.preventDefault();

			if (!this.userAction) {
				return;
			}

			await this.user.deal(this.playingCards[this.cardIdx]);
			this.cardIdx++;

			if (this.user.total > 20) {
				this.endUserTurn();
			}

			return;
		});

		standBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			if (this.userAction) {
				this.endUserTurn();
			}

			return;
		});

		mainMenuBtn.addEventListener('click', () => {
			return this.preRound(false);
		});
	}

	private async init() {
		this.preGame = false;
		this.roundCount++;

		// Update DOM
		hideElement(preGameDiv);
		mainGameDiv.setAttribute('class', 'px-3 main"');
		[leaderboardNavBtn, homeNavBtn, statsNavBtn].forEach((element) => {
			hideElement(element);
		});
		moneyDiv.setAttribute('class', '');
		gameButtonsDiv.setAttribute(
			'class',
			'd-flex w-100 justify-content-center mb-5'
		);

		await delay(500);
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

		// Enable Game Buttons
		hitBtn.removeAttribute('disabled');
		standBtn.removeAttribute('disabled');

		// Initial end of game checks
		if (this.user.total == 21 || this.dealer.total == 21) {
			this.endUserTurn();
			return;
		}

		this.userAction = true;
	}

	public async preRound(skipMainScreen: boolean) {
		this.preGame = true;

		// Auth Check
		if (!this.auth.isLoggedIn) {
			loginModal.show();
			return;
		} else if (!this.auth.username || !this.auth.initialMoney) {
			await this.auth.getUserData();
		}

		// Clear stale data & UI
		this.reset();
		hideElement(gameButtonsDiv);

		// Set Cash & Bet
		if (!this.money.username) {
			this.money.amount = this.auth.initialMoney;
			this.money.username = this.auth.username;
		}
		this.money.populateMoney();
		this.money.populateBet();

		// Show Pregame Section
		preGameDiv.setAttribute('class', 'px-3');

		// Show navigation buttons & hide money display
		homeNavBtn.setAttribute('class', 'nav-link fw-bold py-1 px-0 active');
		leaderboardNavBtn.setAttribute('class', 'nav-link fw-bold py-1 px-0');
		statsNavBtn.setAttribute('class', 'nav-link fw-bold py-1 px-0');
		hideElement(moneyDiv);

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

	private endUserTurn() {
		this.userAction = false;

		// Disable Buttons
		hitBtn.setAttribute('disabled', '');
		standBtn.setAttribute('disabled', '');

		return this.dealerTurn();
	}

	private async dealerTurn() {
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

	private determineWinner(): WinTextObj {
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

	private async endGame() {
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

		// Reset Modals
		gameOverModal.hide();
		loginModal.hide();
	}
}
