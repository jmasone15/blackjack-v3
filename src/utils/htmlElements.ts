import { resetNavLinks } from './resetNavLinks';
import { Modal } from 'bootstrap';
import JSConfetti from 'js-confetti';

// This file holds all DOM references within TypeScript. Keeps the main files cleaner, other files will simply reference.
// Does not hold all possible event listeners. Only the ones that do not rely on game variables to run.

class HTMLElements {
	startBtn = document.getElementById('start-btn') as HTMLElement;
	preGameDiv = document.getElementById('pre-game') as HTMLElement;
	mainGameDiv = document.getElementById('main-game') as HTMLElement;
	navDiv = document.getElementById('nav') as HTMLElement;
	leaderboardNavBtn = document.getElementById('leaderboard-btn') as HTMLElement;
	leaderboardDiv = document.getElementById('leaderboard') as HTMLElement;
	homeNavBtn = document.getElementById('home-btn') as HTMLElement;
	statsNavBtn = document.getElementById('stats-btn') as HTMLElement;
	statsDiv = document.getElementById('stats') as HTMLElement;
	navHeader = document.getElementById('nav-header') as HTMLElement;
	moneyDiv = document.getElementById('money-div') as HTMLElement;
	moneyTextEl = document.getElementById('money-text') as HTMLElement;
	currentBetEl = document.getElementById('current-bet') as HTMLElement;
	gameButtonsDiv = document.getElementById('game-buttons') as HTMLElement;
	changeBetBtn = document.getElementById('bet-btn') as HTMLElement;
	preGameBtnsDiv = document.getElementById('pre-game-btns') as HTMLElement;
	setBetDiv = document.getElementById('set-bet') as HTMLElement;
	betDisplay = document.getElementById('bet-display') as HTMLElement;
	betInput = document.getElementById('bet-input') as HTMLInputElement;
	betConfirmBtn = document.getElementById('bet-confirm') as HTMLElement;
	dealerCardsDiv = document.getElementById('dealer-cards') as HTMLElement;
	dealerScoreEl = document.getElementById('dealer-score') as HTMLElement;
	userCardsDiv = document.getElementById('user-cards') as HTMLElement;
	userScoreEl = document.getElementById('user-score') as HTMLElement;
	loginForm = document.getElementById('login-form') as HTMLFormElement;
	hitBtn = document.getElementById('hit-btn') as HTMLElement;
	standBtn = document.getElementById('stand-btn') as HTMLElement;
	splitBtn = document.getElementById('split-btn') as HTMLElement;
	doubleBtn = document.getElementById('double-btn') as HTMLElement;
	gameOverModal = new Modal(
		document.getElementById('game-over-modal') as HTMLElement
	);
	gameOverModalHeader = document.getElementById(
		'game-over-modal-header'
	) as HTMLElement;
	gameOverModalBodyDiv = document.getElementById(
		'game-over-modal-body'
	) as HTMLElement;
	loginModal = new Modal(document.getElementById('login-modal') as HTMLElement);
	loginModalFooter = document.getElementById(
		'login-modal-footer'
	) as HTMLElement;
	usernameInput = document.getElementById('username-input') as HTMLInputElement;
	validationEl = document.getElementById('validation') as HTMLElement;
	loginValidationEl = document.getElementById(
		'login-validation'
	) as HTMLElement;
	confetti = new JSConfetti() as JSConfetti;

	constructor() {
		// Nav Event Listeners
		this.homeNavBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			this.preGameDiv.setAttribute('class', 'px-3');
			this.statsDiv.setAttribute('class', 'd-none');
			this.leaderboardDiv.setAttribute('class', 'd-none');

			resetNavLinks([
				this.leaderboardNavBtn,
				this.homeNavBtn,
				this.statsNavBtn
			]);

			this.homeNavBtn.setAttribute(
				'class',
				'nav-link fw-bold py-1 px-0 active'
			);
		});
		this.leaderboardNavBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			this.preGameDiv.setAttribute('class', 'd-none');
			this.statsDiv.setAttribute('class', 'd-none');
			this.leaderboardDiv.setAttribute('class', 'px-3');

			resetNavLinks([
				this.leaderboardNavBtn,
				this.homeNavBtn,
				this.statsNavBtn
			]);

			this.leaderboardNavBtn.setAttribute(
				'class',
				'nav-link fw-bold py-1 px-0 active'
			);
		});
		this.statsNavBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			this.preGameDiv.setAttribute('class', 'd-none');
			this.leaderboardDiv.setAttribute('class', 'd-none');
			this.statsDiv.setAttribute('class', 'px-3');

			resetNavLinks([
				this.leaderboardNavBtn,
				this.homeNavBtn,
				this.statsNavBtn
			]);

			this.statsNavBtn.setAttribute(
				'class',
				'nav-link fw-bold py-1 px-0 active'
			);
		});

		// Change Bet Event Listeners
		this.changeBetBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			this.preGameBtnsDiv.setAttribute('class', 'd-none');
			this.setBetDiv.setAttribute('class', 'mt-3');
		});
		this.betConfirmBtn.addEventListener('click', (e: Event) => {
			e.preventDefault();

			this.preGameBtnsDiv.setAttribute('class', '');
			this.setBetDiv.setAttribute('class', 'd-none');
		});
	}
}

const htmlElements = new HTMLElements();
export default htmlElements;
