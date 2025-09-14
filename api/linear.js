// GET /api/linear?symbol=BTCUSDT&interval=1&from=1690000000
export default async function handler(req, res) {
  try {
    const { symbol, interval, from } = req.query;
    if (!symbol || !interval || !from) {
      return res.status(400).json({ error: "Missing symbol/interval/from" });
    }

    const url = new URL("https://api.bybit.com/public/linear/kline");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("interval", interval); // 1,3,5,15,30,60,120,240,360,720,D,W,M
    url.searchParams.set("from", from);         // seconds

    const r = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    const text = await r.text();
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("content-type", "application/json; charset=utf-8");
    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
