import * as React from 'react';
import { useTranslation } from 'react-i18next';

import Table, { TableColumnProps, TTableRowItem } from 'medici-ui-kit/components/table';
import IconButton from 'medici-ui-kit/components/icon-button';
import { TStorageData, TStorageSelectData } from 'types/sales-invoice/storage';

export interface NomenclaturesTableOwnProps {
    items: TStorageSelectData[];
    onClickRemoveRow: (index: number) => void;
    handlerWithoutTax: (index: number) => void;
    handlerAllAmount: (index: number) => void;
}

const NomenclaturesTable: React.FC<NomenclaturesTableOwnProps> = ({
    items,
    onClickRemoveRow,
    handlerWithoutTax,
    handlerAllAmount,
}: NomenclaturesTableOwnProps) => {
    const { t } = useTranslation();
    const [amountNoTax, useAmountNoTax] = React.useState<number>(0);
    const [allAmount, useAllAmount] = React.useState<number>(0);

    const tableColumns: TableColumnProps[] = React.useMemo(() => ([
        {
            name: 'actions',
            label: t('actions'),
        },
        {
            name: 'name',
            label: t('nomenclature'),
        },
        {
            name: 'series',
            label: t('series'),
        },
        {
            name: 'expirationDate',
            label: t('expirationDate'),
        },
        {
            name: 'numberOfUnits',
            label: t('numberOfUnits'),
        },
        {
            name: 'numberOfPieces',
            label: t('numberOfPieces'),
        },
        {
            name: 'storageArea',
            label: t('editSalesInvoice.storageArea'),
        },
        {
            name: 'taxRate',
            label: t('taxRate'),
        },
        {
            name: 'taxPrice',
            label: t('editSalesInvoice.priceWithTax'),
        },
        {
            name: 'unitPrice',
            label: t('editSalesInvoice.unitPrice'),
        },
        {
            name: 'priceWithoutTax',
            label: t('editSalesInvoice.priceWithoutTax'),
        },
        {
            name: 'GTIN',
            label: 'GTIN',
        },
        {
            name: 'sGTIN',
            label: 'sGTIN',
        },
        {
            name: 'total',
            label: t('total'),
        },
    ]), []);

    const memoizedValueNoTax = React.useMemo(() => (
        items.map((item: TStorageSelectData) => item.number_of_units * 120)
    ), [items.length]);

    const amountNoTaxFunc = React.useCallback(() => (
        useAmountNoTax(memoizedValueNoTax.reduce((item: number, tem: number) => item + tem))
    ), [memoizedValueNoTax.length]);

    const memoizedValueWithTax = React.useMemo(() => (
        items.map((item: TStorageSelectData) => item.number_of_units * +(120 + ((item.item_card.tax_rate.value ? item.item_card.tax_rate.value * 120 : 0))))
    ), [items.length]);

    const allAmountFunc = React.useCallback(() => (
        useAllAmount(memoizedValueWithTax.reduce((item: number, tem: number) => item + tem))
    ), [memoizedValueWithTax.length]);

    React.useEffect(() => {
        if (memoizedValueNoTax.length) {
            amountNoTaxFunc();
        }
        if (memoizedValueWithTax.length) {
            allAmountFunc();
        }
    }, [memoizedValueNoTax.length, memoizedValueWithTax.length]);

    React.useEffect(() => {
        handlerWithoutTax(amountNoTax);
        handlerAllAmount(allAmount);
    }, [amountNoTax, allAmount]);

    const tableRows = React.useMemo((): TTableRowItem[] => (
        items.map((rowItem: TStorageSelectData, rowIndex: number): TTableRowItem => {
            const taxPrice: number = +(120 + ((rowItem.item_card.tax_rate.value ? rowItem.item_card.tax_rate.value * 120 : 0)));
            const unitPrice = +(120 + ((rowItem.item_card.tax_rate.value ? rowItem.item_card.tax_rate.value * 120 : 0)));

            return ({
                ...rowItem,
                actions: (
                    <div className="nomenclatures-table__row-actions">
                        <IconButton
                            icon="remove"
                            onClick={(): void => {
                                onClickRemoveRow(rowIndex);
                            }}
                        />
                    </div>
                ),
                numberOfUnits: rowItem.number_of_units,
                numberOfPieces: rowItem.quantity,
                storageArea: rowItem.warehouse,
                taxRate: rowItem.item_card.tax_rate.name,
                taxPrice: (taxPrice * rowItem.number_of_units).toFixed(2),
                unitPrice: unitPrice.toFixed(2),
                priceWithoutTax: (120 * rowItem.number_of_units).toFixed(2),
                GTIN: rowItem.item_card.gtin,
                sGTIN: rowItem.item_card.gtin,
                total: (taxPrice * rowItem.number_of_units).toFixed(2),
            });
        })), [items.length]);


    return (
        <div className="nomenclatures-salesInvoice-table">
            <div className="nomenclatures-salesInvoice-table__container">
                <Table
                    columns={tableColumns}
                    rows={tableRows}
                />
            </div>
            <div className="nomenclatures-salesInvoice-table__totals">
                <strong className="nomenclatures-salesInvoice-table__totals-name">
                    {t('amountWithoutTax')}
                </strong>
                <span className="nomenclatures-salesInvoice-table__totals-value">
                    {memoizedValueNoTax.length && amountNoTax.toFixed(2)}
                </span>
                <strong className="nomenclatures-salesInvoice-table__totals-name">
                    {t('amountTotal')}
                </strong>
                <span className="nomenclatures-salesInvoice-table__totals-value">
                    {memoizedValueWithTax.length && allAmount.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default NomenclaturesTable;
