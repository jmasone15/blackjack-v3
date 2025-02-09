import { Game } from './Game';
import htmlElements from '../utils/htmlElements';

// Required HTML Elements
const {
	loginModal,
	loginModalFooter,
	usernameInput,
	loginValidationEl,
	validationEl,
	loginForm
} = htmlElements;

export class Auth {
	id: string = '';
	initialMoney: number = 0;
	username: string = '';
	apiUrl: string = 'https://simple-api-isq7ga.fly.dev/blackjack';
	parent: Game;
	loading: boolean = false;

	constructor(parent: Game) {
		this.parent = parent;

		loginForm.addEventListener('submit', (e: Event) => {
			e.preventDefault();

			return this.login();
		});
	}

	get isLoggedIn() {
		return document.cookie !== '';
	}

	get cookie() {
		let name = 'id=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}

	setLoading() {
		this.loading = !this.loading;
		loginModalFooter.innerHTML = this.loading
			? '<div class="spinner-border text-success" role="status"></div>'
			: '<button type="submit" class="btn btn-success">Submit</button>';
	}

	async login() {
		try {
			this.setLoading();

			const response = await window.fetch(`${this.apiUrl}/login`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json;charset=UTF-8'
				},
				body: JSON.stringify({
					nickname: usernameInput.value
				})
			});

			if (!response.ok) {
				throw new Error('oops');
			}

			const { _id, money, nickname } = await response.json();

			this.username = nickname;
			this.initialMoney = money;
			this.id = _id;
			document.cookie = `id=${_id}`;

			return this.parent.preRound(false);
		} catch (error) {
			console.error(error);
			loginValidationEl.innerText = 'something broke, go yell at Jordan';
		} finally {
			this.setLoading();
		}
	}

	async getUserData() {
		try {
			this.id = this.cookie;

			if (!this.id) {
				document.cookie = '';
				loginModal.show();
				return;
			}

			const response = await window.fetch(`${this.apiUrl}/user/${this.id}`);

			if (!response.ok) {
				const { message } = await response.json();

				if (message === 'No user found.') {
					document.cookie = '';
					loginModal.show();
					return;
				} else {
					throw new Error('Oops');
				}
			}

			const { money, nickname } = await response.json();

			this.username = nickname;
			this.initialMoney = money;
		} catch (error) {
			console.error(error);
			validationEl.innerHTML = 'something broke, go yell at Jordan';
		}
	}
}
