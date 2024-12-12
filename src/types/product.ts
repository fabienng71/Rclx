export interface Product {
  itemCode: string;
  description: string;
  inventory: number;
  baseUnitOfMeasure: string;
  unitCost: number;
  unitPrice: number;
  vendorNo: string;
  blocked: boolean;
  vendor: string;
  modifiedPrice?: number;
}