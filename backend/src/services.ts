import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
import axios from 'axios';

// Fetch Current Market Price (CMP) from Yahoo Finance
export async function fetchCMP(exchangeCode: string): Promise<number | null> {
  try {
    const result = await yahooFinance.quote(exchangeCode);
    return result?.regularMarketPrice || null;
  } catch (error) {
    console.error(`Error fetching CMP for ${exchangeCode}:`, error);
    return null;
  }
}

// Fetch P/E Ratio and Latest Earnings from SerpApi (Google Finance)
export async function fetchSerpApiFinance(exchangeCode: string): Promise<{ peRatio: string | null, earnings: string | null }> {
  try {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('SerpApi Key is missing or invalid.');
      return { peRatio: null, earnings: null };
    }

    // Map Yahoo ticker to Google Finance format
    const [ticker, suffix] = exchangeCode.split('.');
    const exchange = suffix === 'NS' ? 'NSE' : 'BOM';
    const query = `${ticker}:${exchange}`;

    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_finance',
        q: query,
        api_key: apiKey
      }
    });

    let peRatio = null;
    let earnings = null;

    const stats = response.data.knowledge_graph?.key_stats?.stats || [];
    for (const item of stats) {
      if (item.label && item.label.includes('P/E ratio')) {
        peRatio = item.value;
      }
      if (item.label && (item.label.includes('Earnings per share') || item.label.includes('EPS'))) {
        earnings = item.value;
      }
    }

    return { peRatio, earnings };
  } catch (error) {
    console.error(`Error fetching SerpApi data for ${exchangeCode}:`, (error as Error).message);
    return { peRatio: null, earnings: null };
  }
}
