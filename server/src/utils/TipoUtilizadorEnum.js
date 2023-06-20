/*
	1,Utilizador
	2,Gestor de Ideias
	3,Gestor de Recursos Humanos
	4,Gestor de Negócios
	5,Gestor de Conteúdos
	6,Administrador
	7,Colaborador
 */

/**
 * Enum com reverse mapping para os tipos de utilizador
 *
 * @enum {number}
 * @readonly
 * @property {number} Utilizador
 * @property {number} GestorIdeias
 * @property {number} GestorRecursosHumanos
 * @property {number} GestorNegocios
 * @property {number} GestorConteudos
 * @property {number} Administrador
 * @property {number} Colaborador
 */
const TipoUtilizadorEnum = {
	Utilizador: 1,
	GestorIdeias: 2,
	GestorRecursosHumanos: 3,
	GestorNegocios: 4,
	GestorConteudos: 5,
	Administrador: 6,
	Colaborador: 7,

	1: "Utilizador",
	2: "Gestor de Ideias",
	3: "Gestor de Recursos Humanos",
	4: "Gestor de Negócios",
	5: "Gestor de Conteúdos",
	6: "Administrador",
	7: "Colaborador",
};

Object.freeze(TipoUtilizadorEnum);

module.exports = TipoUtilizadorEnum;
