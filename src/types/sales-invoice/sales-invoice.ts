export type TWarehouse = {
  id: number;
  name: string;
  warehouse_type_id?: number;
}

export type TWriteOfReason = {
  id: number;
  code: number;
  name: string;
}

export type TNamenclatureCard = {
  id: number;
  latin_name: string;
  coefficient: number;
  gtin: number;
  barcode: number;
  trade_name: TNameclatureRowItem;
  international_name: TNameclatureRowItem;
  dosage_form: TNameclatureRowItem;
  dosage: TNameclatureRowItem;
  packing: TNameclatureRowItem;
  packaging: TNameclatureRowItem;
  country: TNameclatureRowItem;
  manufacturer: TNameclatureRowItem;
  measurement_unit: TNameclatureRowMeasurementUnit;
  tax_rate: TNameclatureRowTaxRate;
  medication_type: TNameclatureMedicationType;
}

type TNameclatureRowItem = {
  id: number;
  name: string;
}

type TNameclatureRowMeasurementUnit = {
  id: number;
  name: string;
  full_name: string;
}

type TNameclatureRowTaxRate = {
  id: number;
  name: string;
  value: string | null;
}

type TNameclatureMedicationType = {
  id: number;
  name: string;
  code: number;
}
