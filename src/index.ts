import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
const app: Application = express();

//middleware
app.use(express.json());
app.use(cookieParser());
// Configure CORS options
// const corsOptions = {
//    origin: [
//     "http://localhost:5173",
//     "https://camp-store.vercel.app/"
//   ],
//   credentials: true, // Allow cookies or credentials
// };

const allowedOrigins = [
  "http://localhost:5173",
  "https://camp-store.vercel.app"
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};


// Use CORS middleware
app.use(cors(corsOptions));

//routing
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('App Running.');
});

//error handler middleware
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
