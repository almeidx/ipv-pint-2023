/**
 * @param {Date} date
 */
export function getRelativeTimeString(date) {
	const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1_000);

	const cutoffs = [60, 3_600, 86_400, 86_400 * 7, 86_400 * 30, 86_400 * 365, Infinity];
	const units = ["second", "minute", "hour", "day", "week", "month", "year"];

	const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

	return new Intl.RelativeTimeFormat("pt-PT", { numeric: "auto" }).format(
		Math.floor(deltaSeconds / divisor),
		units[unitIndex],
	);
}
