export class GameButton {
	element: HTMLButtonElement;

	constructor(id: string) {
		this.element = document.getElementById(id) as HTMLButtonElement;
	}
}
