export class Card {
	id!: any;
	suit: string;
	card: number;
	faceDown: boolean;
	cardImg: HTMLImageElement = document.createElement('img');

	constructor(suit: string, card: number, faceDown: boolean = true) {
		this.suit = suit;
		this.card = card;
		this.faceDown = faceDown;
	}

	createHTMLElement(): HTMLImageElement {
		this.cardImg.setAttribute('src', this.generateCardSrc());
		this.cardImg.setAttribute('id', this.id);
		this.cardImg.setAttribute('class', 'playing-card');

		return this.cardImg;
	}

	generateCardSrc(): string {
		// Change for deployment.
		const prefix = '/cards/';

		if (this.faceDown) {
			return `${prefix}1B.svg`;
		} else if (this.card > 9) {
			switch (this.card) {
				case 10:
					return `${prefix}T${this.suit}.svg`;
				case 11:
					return `${prefix}J${this.suit}.svg`;
				case 12:
					return `${prefix}Q${this.suit}.svg`;
				case 13:
					return `${prefix}K${this.suit}.svg`;

				default:
					return `${prefix}A${this.suit}.svg`;
			}
		} else {
			return `${prefix}${this.card}${this.suit}.svg`;
		}
	}

	flipCard() {
		this.faceDown = !this.faceDown;
		this.cardImg.setAttribute('src', this.generateCardSrc());
	}
}
