export interface SaleItem {
  itemCode: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  date: string;
  customerCode: string;
  customerName: string;
  companyName: string;
  searchName: string;
  salesPersonCode: string;
  custType: string;
  postingGroup: string;
  vendorNo: string;
  items: SaleItem[];
  total: number;
}