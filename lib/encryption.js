const bcrypt = require('bcrypt');

//The function to GENERATE HASH from the given password
exports.encrypt = async (payload) => {
  if (!payload) return null;
  const saltRound = 12;
  const hash = await bcrypt.hash(payload, saltRound);
  return hash;
};

//The function to compare 'the entered password' with 'the saved one'.
exports.check = async (clear, hash) => {
  return await bcrypt.compare(clear, hash);
};
