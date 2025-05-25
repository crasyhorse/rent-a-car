import express from 'express';
import { defaultErrorHandler } from '@/app/middleware/defaultErrorHandler.js';
import { httpExceptionHandler } from '@/app/middleware/httpExceptionHandler.js';
import { invalidtokenHandler } from '@/app/middleware/invalidTokenHandler.js';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { fileURLToPath, URL } from 'node:url';
import morgan from 'morgan';
import routes from '@/app/lib/boot.js';

const app = express();
const { json, urlencoded } = bodyParser.default;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(routes);
app.use(morgan('combined'));

const assetPath = fileURLToPath(new URL('./assets/cars', import.meta.url));
app.use(express.static(assetPath));

app.use(invalidtokenHandler);
app.use(httpExceptionHandler);
app.use(defaultErrorHandler);

const DEFAULT_PORT = 4711;
const port: number = Number(process.env.PORT) || DEFAULT_PORT;

const server = app.listen(port, '0.0.0.0', () => {
    if (!server.address()) {
        throw new Error(
            `Rent-A-Car API is not running. It appears that port 4711 is already in use.`
        );
    }

    console.log(`Rent-A-Car API listens on port ${port}.`);
});

