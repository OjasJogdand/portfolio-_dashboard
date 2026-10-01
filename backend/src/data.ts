import { SectorData } from './types.js';

// Static portfolio data based on the extracted Excel file
export const portfolioData: SectorData[] = [
  {
    sectorName: 'Financial Sector',
    stocks: [
      { particulars: 'HDFC Bank', purchasePrice: 1490, qty: 50, exchangeCode: 'HDFCBANK.NS' },
      { particulars: 'Bajaj Finance', purchasePrice: 6466, qty: 15, exchangeCode: 'BAJFINANCE.NS' },
      { particulars: 'ICICI Bank', purchasePrice: 780, qty: 84, exchangeCode: 'ICICIBANK.NS' },
      { particulars: 'Bajaj Housing', purchasePrice: 130, qty: 504, exchangeCode: 'BAJAJHFL.NS' },
      { particulars: 'Savani Financials', purchasePrice: 24, qty: 1080, exchangeCode: 'SAVANI.BO' },
    ]
  },
  {
    sectorName: 'Tech Sector',
    stocks: [
      { particulars: 'Affle India', purchasePrice: 1151, qty: 50, exchangeCode: 'AFFLE.NS' },
      { particulars: 'LTI Mindtree', purchasePrice: 4775, qty: 16, exchangeCode: 'LTIM.NS' },
      { particulars: 'KPIT Tech', purchasePrice: 672, qty: 61, exchangeCode: 'KPITTECH.NS' },
      { particulars: 'Tata Tech', purchasePrice: 1072, qty: 63, exchangeCode: 'TATATECH.NS' },
      { particulars: 'BLS E-Services', purchasePrice: 232, qty: 191, exchangeCode: 'BLSE.NS' },
      { particulars: 'Tanla', purchasePrice: 1134, qty: 45, exchangeCode: 'TANLA.NS' },
    ]
  },
  {
    sectorName: 'Consumer',
    stocks: [
      { particulars: 'Dmart', purchasePrice: 3777, qty: 27, exchangeCode: 'DMART.NS' },
      { particulars: 'Tata Consumer', purchasePrice: 845, qty: 90, exchangeCode: 'TATACONSUM.NS' },
      { particulars: 'Pidilite', purchasePrice: 2376, qty: 36, exchangeCode: 'PIDILITIND.NS' },
    ]
  },
  {
    sectorName: 'Power',
    stocks: [
      { particulars: 'Tata Power', purchasePrice: 224, qty: 225, exchangeCode: 'TATAPOWER.NS' },
      { particulars: 'KPI Green', purchasePrice: 875, qty: 50, exchangeCode: 'KPIGREEN.NS' },
      { particulars: 'Suzlon', purchasePrice: 44, qty: 450, exchangeCode: 'SUZLON.NS' },
    ]
  }
];
