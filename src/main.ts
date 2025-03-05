import './style.css';
import htmlElements from './utils/htmlElements';
import { Game } from './classes/Game';

// TODO
// - Bet Button small screen fix
// - Loading spinner for any API calls
// - Change size of cards based on how many have been dealt
// - Reshuffle after cards run out.
// - Double and Split Logic
// - Animations
// - Stats

const activeGame = new Game();

const startGame = (skipMainScreen: boolean) => {
	if (activeGame) {
		htmlElements.gameOverModal.hide();
	}

	return activeGame.preRound(skipMainScreen);
};

htmlElements.nextRoundBtn.addEventListener('click', () => {
	return startGame(true);
});

startGame(false);
