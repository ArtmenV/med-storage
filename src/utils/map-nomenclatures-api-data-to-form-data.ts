import { TInvoiceNomenclatureInfo, TAddNomenclatureFormData } from 'types/gists';

export default (apiData: TInvoiceNomenclatureInfo[]): TAddNomenclatureFormData[] => (
    apiData.map((infoDataItem: TInvoiceNomenclatureInfo) => ({
        item_card_id: `${infoDataItem.item_card_id}`,
        series: infoDataItem.series,
        amountWithTax: `${infoDataItem.amountWithTax}`,
        numberOfUnits: `${infoDataItem.numberOfUnits}`,
        quantity: `${infoDataItem.quantity}`,
        unitPriceWithTaxes: `${infoDataItem.unitPriceWithTaxes}`,
        expirationDate: new Date(infoDataItem.expirationDate),
    }))
);
