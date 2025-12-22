import express from "express";
import dotenv from 'dotenv';
dotenv.config();
const router=express.Router();
router.post('/logout', async (req, res) => {
            res.clearCookie('token', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
            res.json({ message: 'Logged out successfully' });
});

export default router