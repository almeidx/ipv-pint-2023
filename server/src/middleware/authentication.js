const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @return {import("express").RequestHandler} */
function requireColaborador() {
	return function (req, res, next) {
		if (!checkLoginStandalone(req, res)) return;

		if (req.user.tipoUtilizador.id === TipoUtilizadorEnum.Utilizador) {
			res.status(403).json({ message: "Não tem permissão para acessar esta funcionalidade" });
			return;
		}

		next();
	};
}

/** @returns {import("express").RequestHandler} */
function requireLogin() {
	return function (req, res, next) {
		if (checkLoginStandalone(req, res)) {
			next();
		}
	};
}

/**
 * @param {number|number[]} permission
 * @return {import("express").RequestHandler}
 */
function requirePermission(permission) {
	return function (req, res, next) {
		if (checkLoginStandalone(req, res) && checkPermissionStandalone(req, res, permission)) {
			next();
		}
	};
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function checkLoginStandalone(req, res) {
	if (!req.user) {
		res.status(401).json({ message: "Tem que ter sessão iniciada para acessar esta funcionalidade" });
		return false;
	}

	return true;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {number|number[]} permission
 */
function checkPermissionStandalone(req, res, permission) {
	if (!checkLoginStandalone(req, res)) return false;

	const hasPermission = Array.isArray(permission)
		? !permission.includes(req.user.tipoUtilizador.id)
		: req.user.tipoUtilizador.id !== permission;

	if (hasPermission && req.user.tipoUtilizador.id !== TipoUtilizadorEnum.Administrador) {
		res.status(403).json({ message: "Não tem permissão para acessar esta funcionalidade" });
		return false;
	}

	return true;
}

module.exports = {
	requireColaborador,
	requireLogin,
	requirePermission,

	checkLoginStandalone,
	checkPermissionStandalone,
};
