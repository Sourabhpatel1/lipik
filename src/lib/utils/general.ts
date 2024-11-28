export function formatDate(date: string) {
	if (!date) return;
	const newDate = new Date(date);
	return Intl.DateTimeFormat('en-IN').format(newDate).replaceAll('/', '-');
}

export function getCurrentFinancialYear() {
	const date = new Date();
	const start = date.getFullYear() + '-04-01';
	const end = date.getFullYear() + 1 + '-03-31';
	return {
		start,
		end
	};
}
