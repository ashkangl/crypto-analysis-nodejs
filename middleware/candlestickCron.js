import cron from "node-cron";
import { fetchAndStoreCandlesticks } from "../services/candlestickService.js";

function scheduleCandlestick() {
    cron.schedule("*/5 * * * *", async () => {
        await fetchAndStoreCandlesticks();
    });

    cron.schedule("*/15 * * * *", async () => {
        await fetchAndStoreCandlesticks();
    });

    cron.schedule("0 * * * *", async () => {
        await fetchAndStoreCandlesticks();
    });

    cron.schedule("0 */4 * * *", async () => {
        await fetchAndStoreCandlesticks();
    });

    cron.schedule("0 0 * * *", async () => {
        await fetchAndStoreCandlesticks();
    });
}

export default scheduleCandlestick