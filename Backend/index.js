import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDB from './src/utils/dbConnect.js';
import authRouter from './src/Routes/authRoutes.js';
import clubRouter from './src/Routes/clubRoutes.js';
import userRouter from './src/Routes/userRoutes.js';
import bookRouter from './src/Routes/bookRoutes.js';
import categoryRouter from './src/Routes/categoryRoutes.js';
import languageRouter from './src/Routes/languageRoute.js';
import transactionRouter from './src/Routes/transactionRoutes.js';
import session from 'express-session';

import { initialiseAssociations } from './src/models/associations.js';
dotenv.config();

initialiseAssociations();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: 'secretpassword',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 }
}))


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/club', clubRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/book', bookRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/language', languageRouter); 
app.use('/api/v1/transaction', transactionRouter);


(async () => {
    await connectToDB(); // Check DB before starting server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
})();


