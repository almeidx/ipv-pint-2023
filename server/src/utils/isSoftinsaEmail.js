/** @param {string} email */
function isSoftinsaEmail(email) {
	return /@.*(?:(?:softinsa\.pt)|(?:pt\.softinsa\.com))$/.test(email);
}
