import { API_URL } from "./constants.js";

/** @param {string} path */
export function resolveIcon(path) {
	return path.startsWith("/static") ? path : `${API_URL}/uploads/${path}`;
}
