import bcrypt from "bcrypt";

const password = "admin123";
const saltRounds = 12;

const hashPassword = async () => {
  const hashed = await bcrypt.hash(password, saltRounds);
  console.log("Hash:", hashed);
};

hashPassword();

