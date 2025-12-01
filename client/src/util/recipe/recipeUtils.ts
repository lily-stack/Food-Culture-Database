export function convertMinutesToReadableString(minutes: number): string {
	if (minutes < 0) return '';

	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	const hoursPart = hours > 0 ? `${hours}h` : '';
	const minsPart = mins > 0 ? `${mins}m` : '';

	if (hoursPart && minsPart) {
		return `${hoursPart} ${minsPart}`;
	}
	return hoursPart || minsPart || '0m';
}
