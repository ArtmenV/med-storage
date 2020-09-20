import { TItemCard } from './storage';

export type TSalesInvoiceFullData = {
  id: number;
  document_number: string;
  document_date: TDate;
  enterprise: number;
  total_without_taxes: number;
  status?: number | boolean;
  total: number;
  info: TItemCard[];
  warehouse_id: number;
  warehouse: TWarehouse;
  write_off_reason_id: number;
  write_off_reason: TWriteOfReason;
}

export type TWriteOfReason = {
  id: number;
  code: number;
  name: string;
}

export type TDate = {
  date: string;
  timezone_type: number;
  timezone: string;
}

export type TWarehouse = {
  id: number;
  name: string;
}
export type TCreateSalesInvoice = {
  warehouse_id: number;
  document_number: number;
  document_date: TDate;
  write_off_reason_id: number;
  enterprise: number;
  total_without_taxes: number;
  status: number | boolean;
  total: number;
  info: [];
}
