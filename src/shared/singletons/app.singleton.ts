import express from "express"
import cors from 'cors';
import { router } from "../../presentation/routes";

const app = express()

app.use(express.json())
app.use(cors());

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    app.use(cors());

    next();
});

app.options('*', cors())

app.use(router);

export { app }