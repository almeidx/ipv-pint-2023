const { randomString } = require("./randomString.js");

exports.ISO_DATETIME_REGEX = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

exports.PASSWORD_RESET_TOKEN = randomString(256);
exports.MOBILE_GOOGLE_AUTH_TOKEN = randomString(256);
exports.MOBILE_FACEBOOK_AUTH_TOKEN = randomString(256);
