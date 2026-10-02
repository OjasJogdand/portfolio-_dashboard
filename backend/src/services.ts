import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
import axios from 'axios';
import * as cheerio from 'cheerio';

// Fetch Current Market Price (CMP) from Yahoo Finance
export async function fetchCMP(exchangeCode: string): Promise<number | null> {
  try {
    const result = await yahooFinance.quote(exchangeCode);
    if (result && result.regularMarketPrice) {
      return result.regularMarketPrice;
    }
    throw new Error('Yahoo Finance returned null or undefined price');
  } catch (error) {
    console.warn(`[Fallback] Yahoo Finance blocked/failed for ${exchangeCode}. Scraping Google Finance directly...`);
    
    // Fallback: Scrape Google Finance
    try {
      const [ticker, suffix] = exchangeCode.split('.');
      const exchange = suffix === 'NS' ? 'NSE' : 'BOM';
      
      const response = await axios.get(`https://www.google.com/finance/quote/${ticker}:${exchange}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      // .YMlKec.fxKbKc is the standard class for the main stock price on Google Finance
      const priceText = $('.YMlKec.fxKbKc').first().text();
      
      if (priceText) {
        const parsedPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsedPrice)) {
          return parsedPrice;
        }
      }
      console.error(`[Fallback Error] Could not parse price from scraped data for ${exchangeCode}`);
    } catch (fallbackError) {
      console.error(`[Fallback Error] Scraper failed for ${exchangeCode}:`, (fallbackError as Error).message);
    }
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

    // Map Yahoo ticker to Google Finance format (e.g., HDFCBANK.NS -> HDFCBANK:NSE, SAVANI.BO -> SAVANI:BOM)
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

    // SerpApi for Google Finance returns stats inside knowledge_graph
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
