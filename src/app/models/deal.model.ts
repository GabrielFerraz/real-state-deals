export interface RawDeal {
  id: number;
  name: string;
  purchasePrice: number;
  address: string;
  noi: number;
}

export interface Deal extends RawDeal {
  capRate: number;
}
