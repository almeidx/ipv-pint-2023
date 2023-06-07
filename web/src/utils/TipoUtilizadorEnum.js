/*
	1,Utilizador
	2,Gestor de Ideias
	3,Gestor de Recursos Humanos
	4,Gestor de Negócios
	5,Gestor de Conteúdos
	6,Administrador
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
 */
export const TipoUtilizadorEnum = {
	Utilizador: 1,
	GestorIdeias: 2,
	GestorRecursosHumanos: 3,
	GestorNegocios: 4,
	GestorConteudos: 5,
	Administrador: 6,

	[1]: "Utilizador",
	[2]: "Gestor de Ideias",
	[3]: "Gestor de Recursos Humanos",
	[4]: "Gestor de Negócios",
	[5]: "Gestor de Conteúdos",
	[6]: "Administrador",
};

Object.freeze(TipoUtilizadorEnum);
