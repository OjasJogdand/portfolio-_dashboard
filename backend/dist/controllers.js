import { portfolioData } from './data.js';
import { fetchCMP, fetchSerpApiFinance } from './services.js';
// Simple in-memory cache to avoid rate-limiting
const cache = {};
const CACHE_DURATION_MS = 60 * 1000; // 1 minute cache
// Process the portfolio data and calculate values
export async function getPortfolio(req, res) {
    try {
        const now = Date.now();
        let totalPortfolioInvestment = 0;
        // Step 1: Calculate total investment for Portfolio %
        portfolioData.forEach(sector => {
            sector.stocks.forEach(stock => {
                totalPortfolioInvestment += stock.purchasePrice * stock.qty;
            });
        });
        const enrichedSectors = [];
        let overallPresentValue = 0;
        let overallInvestment = 0;
        // Step 2: Enrich each stock with live data and calculations
        for (const sector of portfolioData) {
            let sectorInvestment = 0;
            let sectorPresentValue = 0;
            const enrichedStocks = [];
            for (const stock of sector.stocks) {
                const investment = stock.purchasePrice * stock.qty;
                const portfolioPercent = (investment / totalPortfolioInvestment) * 100;
                // Split cache logic to protect SerpApi free limits!
                let liveData = cache[stock.exchangeCode] || {};
                const SERPAPI_CACHE_MS = 24 * 60 * 60 * 1000; // 24 hours
                // 1. Fetch CMP every 60 seconds
                if (!liveData.cmpTimestamp || now - liveData.cmpTimestamp > CACHE_DURATION_MS) {
                    console.log(`[API Fetch] Pulling fresh CMP for ${stock.exchangeCode}...`);
                    liveData.cmp = await fetchCMP(stock.exchangeCode);
                    liveData.cmpTimestamp = now;
                }
                else {
                    console.log(`[Cache Hit] Serving cached CMP for ${stock.exchangeCode} (CMP: ₹${liveData.cmp})`);
                }
                // 2. Fetch P/E and Earnings only ONCE per day (or per server restart)
                if (!liveData.fundamentalsTimestamp || now - liveData.fundamentalsTimestamp > SERPAPI_CACHE_MS) {
                    console.log(`[SerpApi Fetch] Pulling P/E & Earnings for ${stock.exchangeCode}...`);
                    const { peRatio, earnings } = await fetchSerpApiFinance(stock.exchangeCode);
                    liveData.peRatio = peRatio;
                    liveData.earnings = earnings;
                    liveData.fundamentalsTimestamp = now;
                }
                cache[stock.exchangeCode] = liveData;
                // Calculations
                const cmp = liveData.cmp || 0; // fallback to 0 if failed
                const presentValue = cmp * stock.qty;
                const gainLoss = presentValue - investment;
                // Accumulate sector totals
                sectorInvestment += investment;
                sectorPresentValue += presentValue;
                enrichedStocks.push({
                    particulars: stock.particulars,
                    purchasePrice: stock.purchasePrice,
                    qty: stock.qty,
                    investment: investment,
                    portfolioPercent: portfolioPercent,
                    exchangeCode: stock.exchangeCode,
                    cmp: liveData.cmp,
                    presentValue: presentValue,
                    gainLoss: gainLoss,
                    peRatio: liveData.peRatio,
                    latestEarnings: liveData.earnings
                });
            }
            const sectorGainLoss = sectorPresentValue - sectorInvestment;
            // Accumulate overall totals
            overallInvestment += sectorInvestment;
            overallPresentValue += sectorPresentValue;
            enrichedSectors.push({
                sectorName: sector.sectorName,
                totalInvestment: sectorInvestment,
                totalPresentValue: sectorPresentValue,
                totalGainLoss: sectorGainLoss,
                stocks: enrichedStocks
            });
        }
        const overallGainLoss = overallPresentValue - overallInvestment;
        // Step 3: Return the final JSON
        res.json({
            summary: {
                totalInvestment: overallInvestment,
                currentPortfolioValue: overallPresentValue,
                totalGainLoss: overallGainLoss
            },
            sectors: enrichedSectors
        });
    }
    catch (error) {
        console.error("Error processing portfolio:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
