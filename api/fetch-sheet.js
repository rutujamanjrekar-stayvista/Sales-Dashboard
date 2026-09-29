// api/fetch-sheet.js
// Proxies the FY27 Google Sheet CSV to avoid CORS issues in the browser

const FY27_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0jcAsVOB-9uTAwbaOy1be_o3fXrzzM1ktZInDvagfjwCrUYIwc_l68beifYv2gbZERy_Ka9Dm11DF/pub?output=csv";

export default async function handler(req, res) {
  try {
    const response = await fetch(FY27_CSV_URL);
    if (!response.ok) {
      return res.status(502).json({ error: `Sheet fetch failed: ${response.status}` });
    }
    const csv = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // cache 1hr
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
