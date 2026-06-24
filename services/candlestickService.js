import { COINS, TIMEFRAMES } from "../config/coinbase.js";
import { addIndicatorsAndSave } from "./indicatorsService.js";


function mapCoinbaseKline(data, symbol, timeframe) {
  return {
    symbol,
    timeframe,
    createdAt: new Date(data[0] * 1000),
    pricesLow: parseFloat(data[1]),
    pricesHigh: parseFloat(data[2]),
    pricesOpen: parseFloat(data[3]),
    pricesClose: parseFloat(data[4]),
    volume: parseFloat(data[5])
  };
}

async function fetchCoinbaseCandle(coin, tf) {
    const now = Math.floor(Date.now() / 1000);
    const granularity = TIMEFRAMES[tf];
    const start = now - (granularity * 5);
    const end = now;
    const savedSymbol = COINS[coin]
    const url = `https://api.exchange.coinbase.com/products/${savedSymbol}/candles?granularity=${granularity}&start=${new Date(start * 1000).toISOString()}&end=${new Date(end * 1000).toISOString()}`;

    const res = await fetch(url, {
        headers: {
        "User-Agent": "Mozilla/5.0 (Node.js)",
        "Accept": "application/json"
        }
    });

    const json = await res.json();
    if (!Array.isArray(json) || !json.length) {
        throw new Error(`No OHLC data for ${coin} ${tf}`);
    }

    const lastCandle = json.sort((a, b) => a[0] - b[0])[json.length - 1];
    return mapCoinbaseKline(lastCandle, coin, tf);
}

export async function fetchAndStoreCandlesticks() {
    for (const coin of Object.keys(COINS)) {
    for (const tf of Object.keys(TIMEFRAMES)) {
      try {
        const candle = await fetchCoinbaseCandle(coin, tf);
        candle.indicators = {};
        await addIndicatorsAndSave(candle);
        console.log(`✅ Coinbase ${coin} ${tf} saved`);
        } catch (err) {
           console.error(`❌ Coinbase ${coin} ${tf} error:`, err.message);
        }
    }
  }
}