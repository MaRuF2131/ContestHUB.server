# 🛠 Backend API – Role-Based Authorization System

This is the backend server for a full-stack web application supporting **role-based authorization** using **JWT**, with secure routes for **admin**, **moderator**, and **user** roles. It also includes **Stripe payment integration** and **MongoDB** for data storage.

--

# 🚀 Tech Stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Role-Based Access Control**
- **Stripe API Integration**
- **Express Router**
- **dotenv / CORS / Helmet**

--

# 🔐 Authentication & Authorization

- JWT issued on frontend (e.g., after Firebase login)
- Custom middleware:
  - `verifyJWT` – verifies token from headers
  - `checkRole('admin' | 'moderator' | 'user')` – grants access by role
- Role-based route protection for admin, moderator, user

--

# 📁 Folder Structure

```
server/
├── controllers/
│   └── subscriptionController.js
├── middleware/
│   ├── verifyJWT.js
│   └── checkRole.js
├── models/
│   └── Subscription.js
├── routes/
│   ├── adminRoutes.js
│   ├── moderatorRoutes.js
│   └── userRoutes.js
│   └── paymentRoutes.js
├── stripe/
│   └── webhook.js
├── utils/
│   └── connectDB.js
├── .env
├── server.js
└── package.json
```

--

# 🔐 Example Middlewares

# ✅ `verifyJWT.js`

```js
import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = decoded;
    next();
  });
};

export default verifyJWT;
```

# ✅ `checkRole.js`

```js
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user?.role !== requiredRole) {
      return res.status(403).send('Access denied');
    }
    next();
  };
};

export default checkRole;
```

--

# 💳 Stripe Payment Integration

# `POST /create-payment-intent`

```js
router.post('/create-payment-intent', verifyJWT, async (req, res) => {
  try {
    const { email, coupon } = req.body;
    let amount = 500;

    if (coupon === 'SAVE10') amount = 450;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { email },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Payment Intent Error:', err);
    res.status(500).json({ error: 'Payment creation failed' });
  }
});
```

--

# 🧾 Subscription Save via Webhook

# `POST /webhook` (Stripe Webhook Listener)

```js
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const email = paymentIntent.metadata.email;

    await db.collection('subscriptions').insertOne({
      email,
      amount: paymentIntent.amount,
      paymentIntentId: paymentIntent.id,
      status: 'active',
      createdAt: new Date(),
    });

    console.log('✅ Subscription saved for:', email);
  }

  res.sendStatus(200);
});
```

--

# 🛠️ Getting Started

# 1. Clone and Install

```bash
git clone https://github.com/your-name/your-backend-repo.git
cd server
npm install
```

# 2. Environment Variables

Create a `.env` file:

```
PORT=3000
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

# 3. Run the Server

```bash
npm run dev
```

--

# 📮 Sample API Routes

| Method | Route                          | Role Access   | Description                    |
|--------|--------------------------------|---------------|--------------------------------|
| POST   | /create-payment-intent         | Authenticated | Create a Stripe payment intent |
| GET    | /admin/users                   | Admin         | List all users                 |
| POST   | /moderator/verify-product      | Moderator     | Approve product submissions    |
| POST   | /webhook                       | Stripe        | Handle Stripe payment events   |

--

# 🔐 Access Control Summary

- Admin: full access to users, stats, product moderation
- Moderator: manage products, reports
- User: create orders, make payments
- All routes protected using `verifyJWT` and `checkRole`

--

# 📦 Deployment Tips

- Use MongoDB Atlas for database
- Use Railway, Render, or Cyclic for backend deployment
- Set webhook URL in Stripe Dashboard after deployment

--

# 📄 License

This project is licensed under the MIT License.

--

Developed with ❤️ for secure, scalable, role-based backend systems.