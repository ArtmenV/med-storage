import { TTaxRate } from './tax-rate';

export type TStorageData = {
  id: number;
  number_of_units: number;
  series: number;
  quantity: number;
  expiration_date: TDate;
  item_card: TItemCard;
  warehouse: TWarehouse;
}

export type TStorageSelectData = {
  id: number;
  name: string;
  balance: number;
  number_of_units: number;
  series: number;
  expiration_date:string;
  item_card: TItemCard;
  warehouse: string;
  quantity: number;
}

export type TWarehouse = {
  id: number;
  name: string;
}

export type TDate = {
  date: Date | string;
  timezone_type: number;
  timezone: string;
}

export type TItemCard = {
  id: number;
  latin_name: string;
  coefficient: number;
  gtin: number;
  barcode: number;
  trade_name: TUsualTypeCard;
  international_name: TUsualTypeCard;
  dosage_form: TUsualTypeCard;
  dosage: TUsualTypeCard;
  packing: TUsualTypeCard;
  packaging: TUsualTypeCard;
  country: TUsualTypeCard;
  manufacturer: TUsualTypeCard;
  measurement_unit: TMeasurementUnit;
  tax_rate: TTaxRate;
  medication_type: TMedicationType;
}

type TUsualTypeCard = {
  id: number;
  name: string;
}

type TMeasurementUnit = {
  id: number;
  name: string;
  full_name: string;
}

type TMedicationType = {
  id: number;
  code: number;
  name: string;
}
