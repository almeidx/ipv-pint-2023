const { validationResult } = require("express-validator");

/**
 * @param {...import("express-validator").ValidationChain[]} checks
 * @return {import("express").RequestHandler[]}
 */
function validate(checks) {
	return [
		...(Array.isArray(checks) ? checks : [checks]),
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			next();
		},
	];
}

module.exports = {
	validate,
};
