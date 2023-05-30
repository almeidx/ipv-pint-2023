const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async function uploadToCloudinary(file, folder, res) {
	const result = await cloudinary.uploader.upload(file.path, { folder });
	return result.asset_id;
};

exports.getCloudinaryImage = async function getCloudinaryImage(assetId) {
	const data = await cloudinary.api.resources_by_asset_ids([assetId]);
	return data.resources[0].secure_url;
};
