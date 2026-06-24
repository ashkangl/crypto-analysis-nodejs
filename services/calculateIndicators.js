export function calculateEma(prices, period){
    if (prices.length < period) return []
    const k = 2 / (period + 1);
    const sma = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let emaPrev = sma;
    const emaSeries = [];
    for(let i = period; i < prices.length ; i++){
        const emaa = prices[i] * k + emaPrev * ( 1 - k );
        const ema = emaa.toFixed(2)
        emaSeries.push({
        value: ema,
        index: i
        })
        emaPrev = ema;
    }
    return emaSeries;
}

export function calculateSMA(prices, period = 200) {
    if (!prices || prices.length < period) return [];

    const smaSeries = [];
    for (let i = period - 1; i < prices.length; i++) {
        const slice = prices.slice(i - period + 1, i + 1);
        const sma = slice.reduce((a, b) => a + b, 0) / period;
        const avg = sma.toFixed(2)
        smaSeries.push({ value: avg, index: i });
    }

    return smaSeries;
}

export function calculateRSI(closes, period = 14) {
    if (!closes || closes.length < period + 1) return [];

    let gains = 0, losses = 0;

    for (let i = 1; i <= period; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    const rsiSeries = [];
    for (let i = period; i < closes.length; i++) {
        if (i > period) {
        const diff = closes[i] - closes[i - 1];
        avgGain = ((avgGain * (period - 1)) + Math.max(diff, 0)) / period;
        avgLoss = ((avgLoss * (period - 1)) + Math.max(-diff, 0)) / period;
        }

        const rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
        const rssi = avgLoss === 0 ? 100 : 100 - (100 / (1 + rs));
        const rsi = rssi.toFixed(2);

        rsiSeries.push({ value: rsi, index: i });
    }

    return rsiSeries;
}

export function calculateATR(candles, period = 14) {
    if (!candles || candles.length < period + 1) return [];

    const trValues = [];

    for (let i = 1; i < candles.length; i++) {
        const high = candles[i].prices.high;
        const low = candles[i].prices.low;
        const prevClose = candles[i - 1].prices.close;
        const close = candles[i].prices.close;

        const tr = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
        );

        trValues.push(tr);
    }

    const atrSeries = [];

    for (let i = period - 1; i < trValues.length; i++) {
        const slice = trValues.slice(i - period + 1, i + 1);

        const atrr =
        slice.reduce((sum, val) => sum + val, 0) /
        period;

        const atr = atrr.toFixed(2)
        atrSeries.push({
        value: atr,
        index: i
        });
    }

    return atrSeries;
}