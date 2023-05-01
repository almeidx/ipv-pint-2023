/**
 * @param {Date} date
 * @param {boolean} withHours
 */
export function formatDate(date, withHours = true) {
	const formatter = new Intl.DateTimeFormat("pt-PT", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",

		hour: withHours ? "2-digit" : undefined,
		minute: withHours ? "2-digit" : undefined,
	});

	return formatter.format(date).replace(", ", " às ");
}
