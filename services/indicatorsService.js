import { Candlestick } from "../db/models/candlesticks.js";
import { calculateATR, calculateEma, calculateRSI, calculateSMA } from "../services/calculateIndicators.js";

export async function addIndicatorsAndSave(candle, source) {
    const lastCandles = await Candlestick.find({
        symbol: candle.symbol,
        timeframe: candle.timeframe,
    }).sort({ createdAt: -1 }).limit(250);

    const orderedCandles = lastCandles.reverse();

    const closes = [
        ...orderedCandles.map(c => c.prices.close),
        candle.prices.close
    ];

    const candlesForATR = [
        ...orderedCandles,
        candle
    ];

    // Indicators
    const ema9Series = calculateEma(closes, 9);
    const ema20Series = calculateEma(closes, 20);
    const ema50Series = calculateEma(closes, 50);
    const ema200Series = calculateEma(closes, 200);

    const sma20Series = calculateSMA(closes, 20);

    const rsiSeries = calculateRSI(closes, 14);

    const atrSeries = calculateATR(candlesForATR, 14);

    const ema9 = ema9Series.at(-1)?.value ?? null;
    const ema20 = ema20Series.at(-1)?.value ?? null;
    const ema50 = ema50Series.at(-1)?.value ?? null;
    const ema200 = ema200Series.at(-1)?.value ?? null;

    const sma20 = sma20Series.at(-1)?.value ?? null;

    const rsi = rsiSeries.at(-1)?.value ?? null;

    const atr14 = atrSeries.at(-1)?.value ?? null;

    const close = candle.prices.close;

    const atrPercent =
        atr14 != null
        ? ((atr14 / close) * 100).toFixed(3)
        : null;

    // Save Indicators
    candle.indicators = {
        ema9,
        ema20,
        ema50,
        ema200,
        sma20,
        rsi,
        atr14,
        atrPercent
    };

    // Distances
    candle.distances = {
        ema9:
        ema9 != null
            ? (((close - ema9) / ema9) * 100).toFixed(3)
            : null,

        ema20:
        ema20 != null
            ? (((close - ema20) / ema20) * 100).toFixed(3)
            : null,

        ema50:
        ema50 != null
            ? (((close - ema50) / ema50) * 100).toFixed(3)
            : null,

        ema200:
        ema200 != null
            ? (((close - ema200) / ema200) * 100).toFixed(3)
            : null
    };

    await Candlestick.updateOne(
        {
        symbol: candle.symbol,
        timeframe: candle.timeframe,
        createdAt: candle.createdAt,
        },
        { $set: candle },
        { upsert: true }
    );
}