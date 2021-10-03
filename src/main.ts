// import pks:
import cors from 'cors';
import morgan from 'morgan';
import config from 'config';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';

// import utils:
// >>>> routers
import userRouter from './routes/user.router';
import tourRouter from './routes/tour.router';

// >>>> port that app is using:
const PORT = process.env.PORT || 5000;

// *******
//
// >>>> INITIALIZING EXPRESS APP:
const app: Express = express();

// *******
//
// >>>> APPLY THE MIDDLEWARES:
// use cors
app.use(cors());

// >>>> env vars configuration
const { db_connection_uri } = config.get('server');

// >>>> parsing the body
app.use(express.json());

// HTTPs logger:
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// *******
//
// >>>> SETUP ROUTES:
// initial route:
app.get('/', (req: Request, res: Response): void => {
    res.send(`OK! server is running well now.`);
});

// >>>> use implemented routers:
app.use('/api/v1/user', userRouter);
app.use('/api/v1/user', tourRouter);

// *******
//
// >>>> CONNECTING TO THE DATABASE:
const connectWithDB = async () => {
    try {
        await mongoose.connect(db_connection_uri, {
            dbName: 'traveling-champ',
        });

        // >>>> listen to the app
        app.listen(PORT, () => {
            console.log(`Successfully connected to the DB :)`);
            console.log(`We are on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};

// connection to the db elegantly:
(async (connectionTries = 5) => {
    while (connectionTries) {
        try {
            await connectWithDB();
            break;
        } catch (error) {
            console.error(error);
            connectionTries -= 1;

            console.log({
                status: `Failure`,
                message: `Failed to connect to the database`,
                remainedTries: connectionTries,
            });

            // wait 5sec. until firing another new db connecting try.
            await new Promise((res) => setTimeout(res, 5000));
        }
    }
})();

// *******
//
