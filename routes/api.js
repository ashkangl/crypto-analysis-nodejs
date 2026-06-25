import express from 'express'
import { Candlestick } from '../db/models/candlesticks.js';

const router = express.Router()

router.get('/health', (req, res) => {
  res.json({status: 'ok', timestamp: new Date()});
});

router.get('/all-candles', async(req, res)=>{
    try {
        const data = await Candlestick.find().sort({"createdAt": -1}).limit(100);
        if(data.length === 0){
            return res.status(400).json({ error: 'No Data Available!' });
        }
        res.status(200).json({ candlesticks })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/candles/:symbol', async(req, res)=>{
    try {
        const symbol = req.params.symbol.toUpperCase();
        const timeframe = req.query.timeframe;
        const query = {symbol};
        if (timeframe) {
            query.timeframe = timeframe;
        }
        const data = await Candlestick.find(query).sort({"createdAt": -1})
        if (data.length === 0) {
            return res.status(400).json({ error: 'No Data Available!' });
        }
        res.status(200).json({ symbol, data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/last-candle/:symbol', async(req, res)=>{
    try {
        const symbol = req.params.symbol.toUpperCase();
        const timeframe = req.query.timeframe;
        const query = { symbol };
        if (timeframe) {
            query.timeframe = timeframe;
        }
        const data = await Candlestick.findOne(query).sort({"createdAt":-1})
        if (!data) {
            return res.status(400).json({ error: 'No Data Available!' });
        }
        res.status(200).json({ symbol, data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;