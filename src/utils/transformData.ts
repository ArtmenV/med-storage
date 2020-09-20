import { TWarehouse } from '../types/sales-invoice/sales-invoice';
import { TWarehouseBranch } from '../types/sales-invoice/warehouse-branch';

export type TValueLabelRecord = {
  value: number;
  label: string;
}

export type TWriteOfReason = {
  id: number;
  code?: number;
  name: string;
}

type TDataType = TWarehouse | TWarehouseBranch | TWriteOfReason

export default (sourceArray: TDataType[]): TValueLabelRecord[] => (
    sourceArray.map((item: TDataType): TValueLabelRecord => (
        {
            value: item.id,
            label: item.name,
        }
    ))
);
