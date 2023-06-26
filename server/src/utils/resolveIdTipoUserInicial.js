const { Utilizador } = require("../database/index.js");
const { isSoftinsaEmail } = require("./isSoftinsaEmail.js");
const TipoUtilizadorEnum = require("./TipoUtilizadorEnum.js");

/**
 * Retorna o tipo de utilizador inicial para o utilizador com o email dado
 * - Caso não exista nenhum utilizador, retorna Administrador
 * - Caso exista, retorna Colaborador se o email for da Softinsa, ou Utilizador caso contrário
 *
 * @param {string} email
 */
async function resolveIdTipoUserInicial(email) {
	const user = await Utilizador.findOne();
	if (!user) return TipoUtilizadorEnum.Administrador;

	return isSoftinsaEmail(email) ? TipoUtilizadorEnum.Colaborador : TipoUtilizadorEnum.Utilizador;
}

module.exports = {
	resolveIdTipoUserInicial,
};
