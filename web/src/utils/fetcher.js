export async function fetcher(...args) {
	(args[1] ??= {}).credentials ??= "include";

	const res = await fetch(...args);

	if (!res.ok) {
		const error = new Error("An error occurred while fetching the data.");
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}

	return res.json();
}
