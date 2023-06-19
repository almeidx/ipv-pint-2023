/**
 * @param {import("zod").Schema} schema
 * @return {import("express").RequestHandler}
 */
function validate(schema) {
	return (req, res, next) => {
		const result = schema.safeParse(req.body);

		console.log(req.body);

		if (result.error) {
			return res.status(400).json({ errors: result.error.errors });
		}

		next();
	};
}

module.exports = {
	validate,
};
