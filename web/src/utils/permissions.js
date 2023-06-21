import { TipoUtilizadorEnum } from "./TipoUtilizadorEnum.js";

/** @param {import("../contexts/UserContext.jsx").User} user */
export function isAdmin(user) {
	return user?.tipoUtilizador.name === TipoUtilizadorEnum[TipoUtilizadorEnum.Administrador];
}

/** @param {import("../contexts/UserContext.jsx").User} user */
export function isColaborador(user) {
	return (
		Boolean(user) &&
		user.tipoUtilizador.id !== TipoUtilizadorEnum.Utilizador &&
		user.tipoUtilizador.id !== TipoUtilizadorEnum.Colaborador
	);
}

/**
 * @param {import("../contexts/UserContext.jsx").User} user
 * @param {import("./TipoUtilizadorEnum.js").TipoUtilizadorEnum|import("./TipoUtilizadorEnum.js").TipoUtilizadorEnum[]} permission
 */
export function hasPermission(user, permission) {
	return (
		Boolean(user) &&
		((Array.isArray(permission)
			? permission.includes(user.tipoUtilizador.id)
			: user.tipoUtilizador.id === permission) ||
			user.tipoUtilizador.id === TipoUtilizadorEnum.Administrador)
	);
}
