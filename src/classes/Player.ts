import htmlElements from '../utils/htmlElements';
import { Card } from './Card';
import { delay } from '../utils/delay';
import { removeAllChildNodes } from '../utils/removeAllChildren';

const { dealerCardsDiv, dealerScoreEl, userCardsDiv, userScoreEl } =
	htmlElements;

export class Player {
	// Player Variables
	identifier: string;
	total: number = 0;
	aceCount: number = 0;
	hideTotal: boolean;

	// Current Hand Tracking
	hand: Card[] = [];

	// HTML Elements
	cardDiv: HTMLElement;
	scoreEl: HTMLElement;

	constructor(isDealer: boolean) {
		if (isDealer) {
			this.identifier = 'dealer';
			this.hideTotal = true;
			this.cardDiv = dealerCardsDiv;
			this.scoreEl = dealerScoreEl;
		} else {
			this.identifier = 'user';
			this.hideTotal = false;
			this.cardDiv = userCardsDiv;
			this.scoreEl = userScoreEl;
		}
	}

	async deal(card: Card, flipCard: boolean = true) {
		// TODO - Animations

		this.cardDiv.appendChild(card.createHTMLElement());
		this.hand.push(card);

		if (card.card == 14) {
			this.aceCount++;
		}

		if (flipCard) {
			await delay(250);
			card.flipCard();
		}

		this.calculateHandTotal();
		await delay(250);
	}

	calculateHandTotal() {
		this.total = 0;
		let totalString = '';

		// Initial Total
		this.hand.forEach((card) => {
			if (card.card == 14) {
				// Ace
				this.total++;
				this.aceCount++;
			} else if (card.card > 10) {
				// J, Q, K
				this.total += 10;
			} else {
				// Number Cards
				this.total += card.card;
			}
		});

		// Handle Aces
		if (this.aceCount > 0 && this.total + 10 < 22) {
			if (this.total + 10 == 21) {
				this.total = 21;
			} else {
				totalString = `${this.total} / ${this.total + 10}`;
				this.total += 10;
			}
		}

		if (totalString.length == 0) {
			totalString = this.total.toString();
		}

		// Handle faceDown cards.
		if (this.hideTotal) {
			this.scoreEl.innerHTML = '<b>Total:</b> ???';
		} else {
			this.scoreEl.innerHTML = `<b>Total:</b> ${totalString}`;
		}
	}

	reset() {
		// Reset Added DOM Elements
		removeAllChildNodes(this.cardDiv);
		this.scoreEl.innerHTML = '';
	}
}
