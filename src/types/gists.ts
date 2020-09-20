import { TIdNameRecord } from 'medici-ui-kit/types/data-types';

export interface TMedicationType extends TIdNameRecord {
    code: number;
}

export interface TConsignor {
    id: number;
    name: string;
    contract_number: string;
}
export interface TTaxRate extends TIdNameRecord {
    value?: number;
}

export interface TMeasurementUnit extends TIdNameRecord {
    full_name: string;
}

export type TNomenclature = {
    id: string;
    trade_name_id: string;
    international_name_id: string;
    latin_name: string;
    dosage_form_id: string;
    dosage_id: string;
    packing_id: string;
    packaging_id: string;
    country_id: string;
    manufacturer_id: string;
    measurement_unit_id: string;
    coefficient: string;
    gtin: string;
    tax_rate_id: string;
    medication_type_id: string;
    barcode: string;
}

export type TNomenclatureFullData = {
    id: number;
    trade_name: TIdNameRecord;
    international_name: TIdNameRecord;
    latin_name: string;
    dosage_form: TIdNameRecord;
    dosage: TIdNameRecord;
    packing: TIdNameRecord;
    packaging: TIdNameRecord;
    country: TIdNameRecord;
    manufacturer: TIdNameRecord;
    measurement_unit: TMeasurementUnit;
    coefficient: string;
    gtin: string;
    tax_rate: TTaxRate;
    medication_type: TMedicationType;
    barcode: string;
}

export interface TAddNomenclatureFormData {
    item_card_id: string;
    series: string;
    expirationDate: Date;
    amountWithTax: string;
    numberOfUnits: string;
    quantity: string;
    unitPriceWithTaxes: string;
}

export type TInvoiceNomenclatureInfo = {
    item_card_id: number;
    series: string;
    expirationDate: string;
    amountWithTax: number;
    numberOfUnits: number;
    quantity: number;
    unitPriceWithTaxes: number;
}

export type TPurchaseInvoice = {
    id: number;
    document_number: number;
    document_date: string;
    supplier_id: number;
    consignor_id: number;
    consignee_id: number;
    financial_source_id: number;
    contract_number: string;
    warehouse_id: number;
    note: string;
    total_without_taxes: number;
    total: number;
    info: TInvoiceNomenclatureInfo[];
    status: number;
}

export type TPurchaseInvoiceFullData ={
    id: number;
    document_number: number;
    document_date: {
        date: string;
    };
    supplier: TIdNameRecord;
    consignor: number;
    consignee: TIdNameRecord;
    financial_source: TIdNameRecord;
    contract_number: string;
    warehouse: TIdNameRecord;
    note: string;
    total_without_taxes: number;
    total: number;
    info: TInvoiceNomenclatureInfo[];
    status: boolean;
}

export interface TBalanceInvoice {
    id: number;
    document_number: number;
    document_date: string;
    financial_source_id: number;
    warehouse_id: number;
    store_reason_id: number;
    total_without_taxes: number;
    total: number;
    info: TInvoiceNomenclatureInfo[];
    status: number;
}

export interface TBalanceInvoiceFullData {
    id: number;
    document_number: number;
    document_date: {
        date: string;
    };
    financial_source: TIdNameRecord;
    warehouse: TIdNameRecord;
    storeReason: TIdNameRecord;
    total_without_taxes: number;
    total: number;
    info: TInvoiceNomenclatureInfo[];
    status: boolean;
}

export type TInventoryNomenclatureFormData = {
    quantity_real: string;
    shortage: string;
}

export type TInventoryNomenclatureInfo = {
    item_card_id: number;
    storage_id: number;
    GTIN?: string;
    SGTIN?: string;
    quantity_expected: number;
    quantity_real: number;
    shortage: number;
    measurement_unit_id: number;
}

export type TInventory = {
    id: number;
    document_number: number;
    document_date: string;
    warehouse_id: number;
    comission_chief_id: number;
    comission_members: number[];
    info: TInventoryNomenclatureInfo[];
    status: number;
}

export type TInventoryFullData ={
    id: number;
    document_number: number;
    document_date: {
        date: string;
    };
    warehouse: TIdNameRecord;
    comission_chief: TIdNameRecord;
    comission_members: TIdNameRecord[];
    info: TInventoryNomenclatureInfo[];
    status: boolean;
}

export type TStorageNomenclature = {
    id: number;
    number_of_units: number;
    quantity: number;
    series: string;
    expiration_date: {
        date: string;
    };
    unitPriceWithTaxes: number;
    amountWithTax: number;
    item_card: TNomenclatureFullData;
    warehouse: TIdNameRecord;
}

export interface TExpirationDateReportPaylod {
    dateTo?: string;
    dateFrom?: string;
    enterprise?: number;
    warehouse?: number;
    itemCard?: number;
}

export interface TExpirationDateReportData {
    trade_name: string;
    dosage_form: string;
    dosage: string;
    manufacturer: string;
    series: string;
    warehouse: string;
    warehouse_quantity: number;
    expiration_date: {
        date: string;
    };
    date_diff: string;
}
