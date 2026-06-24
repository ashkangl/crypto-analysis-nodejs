import mongoose from "mongoose";

const candlestickSchema = new mongoose.Schema({
    symbol: String,
    timeframe: String,
    prices: {
        open: Number,
        close: Number,
        high: Number,
        low: Number
    },
    indicators: {
        ema9:Number,
        ema20:Number,
        ema50:Number,
        ema200:Number,
        sma20:Number,
        rsi:Number,
        atrPercent: Number
    },
    distances: {
        ema9: Number,
        ema20: Number,
        ema50: Number,
        ema200: Number,
    },
    trend: {
        ema9Above20: Boolean,
        ema20Above50: Boolean,
        ema50Above200: Boolean,
        ema9_20Spread: Number,
        ema20_50Spread: Number,
        ema50_200Spread: Number
    },
    createdAt: { type: Date, default: Date.now }

})

candlestickSchema.index({ createdAt: -1},{ expireAfterSeconds: 60 * 60 * 24 * 30 })

export const Candlestick = mongoose.model('candlestick', candlestickSchema)