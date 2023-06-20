/**
 * Enum com reverse mapping para os tipos de notificação
 *
 * @enum {number}
 * @readonly
 * @property {number} Reuniao
 * @property {number} Beneficio
 * @property {number} Vaga
 * @property {number} Negocio
 */
const TipoNotificacaoEnum = {
	Reuniao: 0,
	Beneficio: 1,
	Vaga: 2,
	Negocio: 3,

	0: "Reunião",
	1: "Benefício",
	2: "Vaga",
	3: "Negócio",
};

Object.freeze(TipoNotificacaoEnum);

module.exports = TipoNotificacaoEnum;
