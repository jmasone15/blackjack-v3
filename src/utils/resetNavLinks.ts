export const resetNavLinks = (navBtns: HTMLElement[]) => {
	const classText = 'nav-link fw-bold py-1 px-0';

	navBtns.forEach((element) => {
		element.setAttribute('class', classText);
	});
};
