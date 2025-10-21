
import "dotenv/config";
import { router } from "../../presentation/routes";
import express from "express"
import "@/shared/container";
import cors from 'cors';

const app = express()

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    app.use(cors());

    next();
});

app.options('*', cors())

app.use(router);

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Listening on PORT ${port}`, 'PID:', process.pid)
})