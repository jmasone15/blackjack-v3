export function removeAllChildNodes(parent: HTMLElement) {
	while (parent.firstChild) {
		parent.removeChild(parent.lastChild as Node);
	}
}
