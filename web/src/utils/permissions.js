/** @param {import("../contexts/UserContext.jsx").User} user */
export function isAdmin(user) {
	return user?.tipoUtilizador.name === "Administrador";
}
