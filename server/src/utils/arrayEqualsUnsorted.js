/**
 * @template T
 * @param {T[]} a
 * @param {T[]} b
 */
function arrayEqualsUnsorted(a, b) {
	return !xor(a, b).length;
}

/**
 * @template T
 * @param {T[]} a
 * @param {T[]} b
 * @returns {T[]}
 */
function xor(a, b) {
	return [...[...new Set(b)].reduce((a, b) => (a.has(b) ? a.delete(b) : a.add(b), a), new Set(a))];
}

module.exports = {
	arrayEqualsUnsorted,
	xor,
};
