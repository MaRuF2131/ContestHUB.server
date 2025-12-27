import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongo from './MongoDB.mjs';
import creator from './modules/creator/creator.route.mjs' 
import authin from './modules/auth/login.mjs'
import authout from './modules/auth/logout.mjs'
import  admin  from './modules/admin/admin.route.mjs';
import payment from './modules/payment/payment.route.mjs'
dotenv.config();
const app = express();
let db;
(async () => {
  try {

    db = await mongo()
  } catch (err) {
    console.error(' MongoDB connection error:', err);
  }
})();
app.use("/api/payments",payment);
app.use(cookieParser());
app.use(cors({origin:['http://localhost:5173'],credentials:true ,allowedHeaders: ['Content-Type', 'Authorization', 'x-user','authorization',"stripe-signature"]}));
app.use(express.json());




app.get('/',async (req ,res)=>{
    res.send('Hello World');
});
app.use('/authin',authin);
app.use('/authot',authout);
app.use('/creator',creator);
app.use('/admin',admin);



 app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`); 
}); 

export default app;