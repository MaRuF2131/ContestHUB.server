import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CreateUserRole from '../../utils/CreateUserRole.mjs';
import mongo from '../../MongoDB.mjs';
dotenv.config();
const router = express.Router();


let db;
(async () => {
  try {

    db = await mongo()
  } catch (err) {
    console.error(' MongoDB connection error:', err);
  }
})();

router.post('/login', async (req, res) => {
  const { username, uid, email, role } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Username and Email are required' });
  }

  // Create user role if it doesn't exist
   const getrole = await CreateUserRole(email, username, role, db);
    if (!getrole.ok) {
      return res.status(getrole.status).json({ message: getrole.message });
    }
    console.log("User role created orrrrrrr updated successfully:", getrole);
  // Create JWT token
  const payload = { username:getrole?.user?.name, uid:getrole?.user?._id, email:getrole?.user?.email, role: getrole?.user?.role};
  /* console.log("Payload for JWT:", payload); */

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ message: 'Login Successful', role: getrole?.user?.role, token:token });
});


export default router;
