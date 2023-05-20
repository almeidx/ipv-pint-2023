const { randomUUID } = require("node:crypto");
const { join } = require("node:path");
const multer = require("multer");
const { extname } = require("node:path");

const uploadsPath = join(process.cwd(), "/uploads");

const upload = multer({
	dest: uploadsPath,
	limits: {
		fieldSize: 10 * 1024 * 1024, // 10 MB
	},

	fileFilter(_req, file, cb) {
		const { mimetype } = file;

		if (!mimetype.startsWith("image/") && mimetype !== "application/pdf") {
			cb(new Error("Ficheiro inválido"));
			return;
		}

		cb(null, true);
	},

	storage: multer.diskStorage({
		destination(_req, _file, cb) {
			cb(null, uploadsPath);
		},

		filename(_req, file, cb) {
			const { originalname } = file;

			const fileName = randomUUID();
			const ext = extname(originalname);

			cb(null, `${fileName}${ext}`);
		},
	}),
});

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		async (req, res) => {
			upload.single("file")(req, res, async (err) => {
				if (err) {
					res.status(400).json({ message: err.message });
					return;
				}

				const { file } = req;
				if (!file) {
					res.status(400).json({ message: "Ficheiro não encontrado" });
					return;
				}

				res.json({
					fileName: file.filename,
				});
			});
		},
	],
};
