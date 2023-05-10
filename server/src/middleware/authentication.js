const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @return {import("express").RequestHandler} */
function requireColaborador() {
	return function (req, res, next) {
		if (!checkLoginStandalone(req, res)) return;

		if (req.user.tipoUtilizador.id === 1) {
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
 * @param {number} permission
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
 * @param {number} permission
 */
function checkPermissionStandalone(req, res, permission) {
	if (req.user.tipoUtilizador.id !== permission && req.user.tipoUtilizador.id !== TipoUtilizadorEnum.Administrador) {
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
