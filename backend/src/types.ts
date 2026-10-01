export interface StockHoldings {
  particulars: string;
  purchasePrice: number;
  qty: number;
  exchangeCode: string; // Pre-mapped with .NS or .BO
}

export interface SectorData {
  sectorName: string;
  stocks: StockHoldings[];
}
