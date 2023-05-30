const { randomUUID } = require("node:crypto");
const multer = require("multer");
const { extname } = require("node:path");
const { rm } = require("node:fs/promises");
const { uploadToCloudinary, getCloudinaryImage } = require("../services/cloudinary.js");
const { tmpdir } = require("node:os");

const uploadsPath = tmpdir();

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

				try {
					const assetId = await uploadToCloudinary(file, "images");
					res.json({ fileName: assetId });

					await rm(file.path);
				} catch (error) {
					console.error(error);

					res.status(500).json({ message: "Erro ao fazer upload do ficheiro" });
				}
			});
		},
	],

	read: [
		async (req, res) => {
			const { fileName } = req.params;

			try {
				const imageUrl = await getCloudinaryImage(fileName);
				res.redirect(imageUrl);
			} catch (error) {
				console.error(error);
				res.status(404).json({ message: "Ficheiro não encontrado" });
			}
		},
	],
};
