 require("dotenv").config();

const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql://bob:jw8s0F4@localhost:5432/messagely_test"
  : "postgresql://bob:jw8s0F4@localhost:5432/messagely";

// const DB_URI = "postgresql://bob:jw8s0F4@localhost:5432/test_db"

const SECRET_KEY = process.env.SECRET_KEY || "secret tunnel";

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR
};
