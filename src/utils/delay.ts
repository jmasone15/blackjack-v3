export function delay(ms: number): Promise<Function> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
