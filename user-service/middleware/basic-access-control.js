import jwt from "jsonwebtoken";
import { ormFindUserByEmail } from "../model/user-orm.js";

export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // request auth header: `Authorization: Bearer + <access_token>`
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // load latest user info from DB
    const dbUser = await ormFindUserByEmail(user.email);
    if (!dbUser) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    req.user = { id: dbUser.id, username: dbUser.username, email: dbUser.email, isAdmin: dbUser.isAdmin };
    next();
  });
}

export function verifyIsAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized to access this resource" });
  }
}

export function verifyEmail(req, res, next) {
  if (req.user.isAdmin) {
    return next();
  }

  const userEmailFromBody = req.body.email;
  const userEmailFromToken = req.user.email;
  if (userEmailFromBody === userEmailFromToken) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized to access this resource" });
}

export function verifyId(req, res, next) {
  if (req.user.isAdmin) {
    return next();
  }

  const userIdFromBody = req.body.id;
  const userIdFromToken = req.user.id;
  if (userIdFromBody === userIdFromToken) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized to access this resource" });
}
