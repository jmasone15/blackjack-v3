import { Game } from './Game';
import htmlElements from '../utils/htmlElements';
import { delay } from '../utils/delay';

const { moneyTextEl, currentBetEl } = htmlElements;

export class Money {
	parent: Game;
	amount: number = 0;
	currentBet: number = 10;
	username: string = '';

	constructor(parent: Game) {
		this.parent = parent;
	}

	populateMoney() {
		moneyTextEl.innerHTML = `${this.username}: <b>$${this.amount}</b>`;
		return;
	}

	populateBet() {
		currentBetEl.innerHTML = `Current Bet: <b>$${this.currentBet}</b>`;
	}

	async add(double: boolean) {
		let value: number = this.currentBet;
		if (double) {
			value = this.currentBet * 2;
		}

		await this.setCurrentMoney(this.amount + value);

		for (let i = 0; i < value; i++) {
			this.amount++;
			this.populateMoney();

			await delay(value > 10 ? 5 : 30);
		}

		return;
	}

	async subtract() {
		await this.setCurrentMoney(this.amount - this.currentBet);

		for (let i = 0; i < this.currentBet; i++) {
			this.amount--;
			this.populateMoney();

			await delay(this.currentBet > 10 ? 5 : 30);
		}

		return;
	}

	async setCurrentMoney(money: number) {
		try {
			const response = await window.fetch(
				`${this.parent.auth.apiUrl}/${this.parent.auth.id}`,
				{
					method: 'PUT',
					headers: {
						'content-type': 'application/json;charset=UTF-8'
					},
					body: JSON.stringify({
						money
					})
				}
			);

			if (!response.ok) {
				throw new Error('oops');
			}

			return;
		} catch (error) {
			console.error(error);
			moneyTextEl.setAttribute('style', 'color: red');
			moneyTextEl.innerText = 'something broke, go yell at jordan';
		}
	}
}
