import jwt from "jsonwebtoken";

export const createAuthJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
