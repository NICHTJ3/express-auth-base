const bcrypt = require('bcrypt');

async function Hash(text) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(text, salt);
}

async function Compare(unencryptedText, encryptedText) {
  return bcrypt.compare(unencryptedText, encryptedText);
}

module.exports = {
  Hash,
  Compare
};
