// api/linear.js — Bybit linear kline proxy (USDT/USDC perps)
// Usage: /api/linear?symbol=BTCUSDT&interval=1&from=1690000000
export default async function handler(req, res) {
  try {
    const { symbol, interval, from } = req.query;
    if (!symbol || !interval || !from) {
      return res.status(400).json({ error: "Missing symbol/interval/from" });
    }

    const bybit = new URL("https://api.bybit.com/public/linear/kline");
    bybit.searchParams.set("symbol",   symbol);
    bybit.searchParams.set("interval", interval); // 1,3,5,15,30,60,120,240,360,720,D,W,M
    bybit.searchParams.set("from",     from);     // seconds since epoch

    const r = await fetch(bybit.toString(), {
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    const body = await r.text();
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("content-type", "application/json; charset=utf-8");
    return res.status(r.status).send(body);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
