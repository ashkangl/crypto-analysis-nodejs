import express from 'express'
import dotenv from 'dotenv'

import DB from './db/db.js'
import scheduleCandlestick from './middleware/candlestickCron.js'
import apiRouter from './routes/api.js'

dotenv.config()
const PORT = process.env.PORT
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await DB();

scheduleCandlestick();

app.use('/api',apiRouter)

app.listen(PORT, () => console.log(`Started in Port ${PORT}`))
