import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Decimal from 'decimal.js-light';

import Table, { TableColumnProps, TTableRowItem, ColumnTypes } from 'medici-ui-kit/components/table';
import findLabelByValue from 'medici-ui-kit/utils/find-label-by-value';
import IconButton from 'medici-ui-kit/components/icon-button';
import calcSumWithoutTax from 'utils/calc-sum-without-tax';

import { TValueLabelRecord } from 'medici-ui-kit/types/data-types';
import { TAddNomenclatureFormData, TNomenclatureFullData } from 'types/gists';

import useTaxRatesState from 'store/dictionaries/fetch-tax-rates/use-tax-rates-state';
import useNomenclatureCardsState from 'store/nomenclature-card/fetch-nomenclature-cards/use-nomenclature-cards-state';

export interface ChangeTotalsInterface {
    total: number;
    totalWithoutTax: number;
}
export interface NomenclaturesTableProps {
    items: TAddNomenclatureFormData[];
    onClickRemoveRow: (index: number) => void;
    onClickEditRow: (index: number) => void;
    onChangeTotals: (payload: ChangeTotalsInterface) => void;
    totalAmount: number;
    totalAmountWithoutTax: number;
}

const NomenclaturesTable: React.FunctionComponent<NomenclaturesTableProps> = ({
    items,
    onClickRemoveRow,
    onClickEditRow,
    onChangeTotals,
    totalAmount,
    totalAmountWithoutTax,
}: NomenclaturesTableProps) => {
    const { t } = useTranslation();
    const taxRatesState = useTaxRatesState();
    const nomenclatureCardsState = useNomenclatureCardsState();

    const tableColumns: TableColumnProps[] = React.useMemo(() => ([
        {
            name: 'actions',
            label: t('actions'),
            noSort: true,
            type: ColumnTypes.reactNode,
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
            type: ColumnTypes.date,
        },
        {
            name: 'numberOfUnits',
            label: t('numberOfUnits'),
        },
        {
            name: 'quantity',
            label: t('numberOfPieces'),
        },
        {
            name: 'taxRate',
            label: t('taxRate'),
        },
        {
            name: 'unitPriceWithTaxes',
            label: t('unitPriceWithTaxes'),
        },
        {
            name: 'amountWithTax',
            label: t('amountWithTax'),
        },
    ]), []);

    const nomenclatureOptions = React.useMemo((): TValueLabelRecord[] => (
        nomenclatureCardsState.data.map(
            (nomenclatureItem) => ({
                value: `${nomenclatureItem.id}`,
                label: nomenclatureItem.trade_name.name,
            }),
        )
    ), [nomenclatureCardsState.data]);

    const tableRows = React.useMemo((): TTableRowItem[] => (
        items.map((rowItem: TAddNomenclatureFormData, rowIndex: number): TTableRowItem => {
            const nomenclatureCard = nomenclatureCardsState.data.find((nomenclatureItem: TNomenclatureFullData) => (
                String(nomenclatureItem.id) === rowItem.item_card_id
            ));
            const taxRate = nomenclatureCard?.tax_rate.name;

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
                        <IconButton
                            icon="edit"
                            onClick={(): void => {
                                onClickEditRow(rowIndex);
                            }}
                        />
                    </div>
                ),
                name: findLabelByValue(nomenclatureOptions, rowItem.item_card_id),
                expirationDate: rowItem.expirationDate,
                taxRate,
            });
        })), [items, nomenclatureOptions, nomenclatureCardsState.data, taxRatesState.data]);

    const calcTotalAmounts = (): void => {
        let decimalTotalAmount = new Decimal(0);
        let decimalTotalAmountWithoutTax = new Decimal(0);

        items.forEach((nomenclaturesItem: TAddNomenclatureFormData) => {
            const matchedNomenclatureCard = nomenclatureCardsState.data.find((nomenclatureItem: TNomenclatureFullData) => (
                nomenclatureItem.id === Number(nomenclaturesItem.item_card_id)
            ));
            const taxRate = Number(matchedNomenclatureCard?.tax_rate?.value) || 0;
            const amountWithTax = Number(nomenclaturesItem.amountWithTax) || 0;

            decimalTotalAmount = decimalTotalAmount.plus(amountWithTax);
            decimalTotalAmountWithoutTax = decimalTotalAmountWithoutTax.plus(calcSumWithoutTax(amountWithTax, taxRate));
        });

        onChangeTotals({
            totalWithoutTax: decimalTotalAmountWithoutTax.toNumber(),
            total: decimalTotalAmount.toNumber(),
        });
    };

    React.useEffect(calcTotalAmounts, [items, nomenclatureCardsState.data, taxRatesState.data]);

    return (
        <div className="nomenclatures-table">
            <Table
                columns={tableColumns}
                rows={tableRows}
                withoutPagination
            />
            <div className="nomenclatures-table__totals">
                <strong className="nomenclatures-table__totals-name">{t('amountWithoutTax')}</strong>
                <span className="nomenclatures-table__totals-value">{totalAmountWithoutTax}</span>
                <strong className="nomenclatures-table__totals-name">{t('amountTotal')}</strong>
                <span className="nomenclatures-table__totals-value">{totalAmount}</span>
            </div>
        </div>
    );
};

export default NomenclaturesTable;
