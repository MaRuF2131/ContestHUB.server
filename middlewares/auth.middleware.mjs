import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const verifyJWT = (req, res, next) => {
  const Coo_token = req?.cookies?.token;
  const user_token = req.headers['authorization'];

  if (!Coo_token || !user_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

 const Coo_res= jwt.verify(Coo_token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("err1");
      
       return res.status(401).json({ message: 'Unauthorized (wrong cookies)' });
    }
    return decoded;
  });
 const User_res= jwt.verify(user_token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("err2");
       return res.status(401).json({ message: 'Unauthorized (wrong request header)' });
    }
    return decoded;
  });

      
    if (Coo_res.email !== User_res.email || Coo_res.username !== User_res.username || Coo_res.uid !== User_res.uid) {
      console.log("err3");
       return res.status(401).json({ message: 'Unauthorized' });
    }
    // Check if the token has expired
      if (!Coo_res.exp || !User_res.exp) {
        console.log("err4");
        return res.status(401).json({ message: 'Unauthorized' });
      }
    const currentTime = Math.floor(Date.now() / 1000);
      if (Coo_res.exp < currentTime ) {
            res.clearCookie('token', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
            const payload = {
               username: Coo_res.username,
                uid: Coo_res.uid,
                 email: Coo_res.email,
                  role: Coo_res.role || 'user'
             };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
            // Set the new token in the cookie
            res.cookie('token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 7 * 24 * 60 * 60 * 1000
            });
      }
     req.user=Coo_res; 
    next();
};

export default verifyJWT;
