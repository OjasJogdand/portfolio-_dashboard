import React, { useEffect, useState } from 'react';
import axios from 'axios';

// TypeScript Interfaces for the data
interface Stock {
  particulars: string;
  purchasePrice: number;
  qty: number;
  investment: number;
  portfolioPercent: number;
  exchangeCode: string;
  cmp: number | null;
  presentValue: number;
  gainLoss: number;
  peRatio: string | null;
  latestEarnings: string | null;
}

interface Sector {
  sectorName: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  stocks: Stock[];
}

interface PortfolioResponse {
  summary: {
    totalInvestment: number;
    currentPortfolioValue: number;
    totalGainLoss: number;
  };
  sectors: Sector[];
}

// Main App Component
export default function App() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch portfolio data from the backend
  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('https://portfolio-dashboard-upu8.onrender.com/api/portfolio');
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch portfolio data from backend.');
    } finally {
      setLoading(false);
    }
  };

  // Setup periodic polling every 15 seconds
  useEffect(() => {
    fetchPortfolio(); // initial fetch
    const interval = setInterval(() => {
      fetchPortfolio();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  // Helper for green/red text
  const getGainLossColor = (val: number) => {
    if (val > 0) return 'text-green-600 font-semibold';
    if (val < 0) return 'text-red-600 font-semibold';
    return 'text-gray-600';
  };

  if (loading) {
    return <div className="p-8 text-center text-xl font-semibold">Loading Portfolio...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 text-xl font-semibold">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Summary */}
        <header className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Dynamic Portfolio Dashboard</h1>
          <div className="flex space-x-6 text-center">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Investment</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(data.summary.totalInvestment)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Present Value</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(data.summary.currentPortfolioValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Gain/Loss</p>
              <p className={`text-xl ${getGainLossColor(data.summary.totalGainLoss)}`}>
                {formatCurrency(data.summary.totalGainLoss)}
              </p>
            </div>
          </div>
        </header>

        {/* Sectors */}
        {data.sectors.map((sector) => (
          <section key={sector.sectorName} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Sector Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700">{sector.sectorName}</h2>
              <div className="flex space-x-4 text-sm mt-2 md:mt-0">
                <span className="text-gray-600">Investment: <b>{formatCurrency(sector.totalInvestment)}</b></span>
                <span className="text-gray-600">Present Value: <b>{formatCurrency(sector.totalPresentValue)}</b></span>
                <span className="text-gray-600">Gain/Loss: <b className={getGainLossColor(sector.totalGainLoss)}>{formatCurrency(sector.totalGainLoss)}</b></span>
              </div>
            </div>

            {/* Stocks Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">Particulars</th>
                    <th className="px-4 py-3 text-right">Purchase Price</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Investment</th>
                    <th className="px-4 py-3 text-right">Portfolio %</th>
                    <th className="px-4 py-3 text-center">NSE/BSE</th>
                    <th className="px-4 py-3 text-right">CMP</th>
                    <th className="px-4 py-3 text-right">Present Value</th>
                    <th className="px-4 py-3 text-right">Gain/Loss</th>
                    <th className="px-4 py-3 text-center">P/E Ratio</th>
                    <th className="px-4 py-3 text-center">Latest Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {sector.stocks.map((stock) => (
                    <tr key={stock.particulars} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{stock.particulars}</td>
                      <td className="px-4 py-3 text-right">₹{stock.purchasePrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">{stock.qty}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(stock.investment)}</td>
                      <td className="px-4 py-3 text-right">{stock.portfolioPercent.toFixed(2)}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                          {stock.exchangeCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{stock.cmp ? `₹${stock.cmp.toFixed(2)}` : 'N/A'}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(stock.presentValue)}</td>
                      <td className={`px-4 py-3 text-right ${getGainLossColor(stock.gainLoss)}`}>
                        {formatCurrency(stock.gainLoss)}
                      </td>
                      <td className="px-4 py-3 text-center">{stock.peRatio || '-'}</td>
                      <td className="px-4 py-3 text-center">{stock.latestEarnings || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

      </div>
    </div>
  );
}
