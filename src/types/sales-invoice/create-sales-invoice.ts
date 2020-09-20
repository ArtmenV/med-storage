export type TCreateSalesInvoice = {
  warehouse_id: number;
  document_number: number;
  document_date: string;
  write_off_reason_id: number | undefined;
  enterprise: number;
  total_without_taxes: number | undefined;
  status: number | boolean;
  total: number | undefined;
  info: TInfo[];
}

type TInfo = {
  item_card_id: number;
  storage_id: number;
  quantity: number;
}
