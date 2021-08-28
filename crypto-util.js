var crypto = require('crypto');
var algorithm = 'aes-256-ecb';
var initVector = new Buffer.from('');

function encrypt(plainText) {
	let cipher = crypto.createCipheriv(algorithm, global.server.secret, initVector)
	let encrypted = cipher.update(plainText, "utf-8", "base64");
    encrypted += cipher.final('base64');
	return encrypted;
}

function decrypt(encryptedText) {
	let cipher = crypto.createDecipheriv(algorithm, global.server.secret, initVector)
	let decrypted = cipher.update(encryptedText, "base64", "utf-8");
    decrypted += cipher.final();
	return decrypted;
}

module.exports = { encrypt, decrypt };