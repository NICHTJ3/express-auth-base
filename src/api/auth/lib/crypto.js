const bcrypt = require('bcrypt');

async function Hash(text) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(text, salt);
}

async function Compare(text1, text2) {
  return bcrypt.compare(text1, text2);
}

module.exports = {
  Hash,
  Compare
};
