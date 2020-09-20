import * as React from 'react';
import { useTranslation } from 'react-i18next';

import Table, { TableColumnProps, TTableRowItem, ColumnTypes } from 'medici-ui-kit/components/table';
import findLabelByValue from 'medici-ui-kit/utils/find-label-by-value';
import IconButton from 'medici-ui-kit/components/icon-button';

import { TValueLabelRecord } from 'medici-ui-kit/types/data-types';
// import { , TNomenclatureFullData } from 'types/gists';

import useNomenclatureCardsState from 'store/nomenclature-card/fetch-nomenclature-cards/use-nomenclature-cards-state';

export interface NomenclaturesTableProps {
    items: any[];
    onRemoveItem: (index: number) => void;
    onChangeItemCount: (index: number, count: number) => void;
}

const NomenclaturesTable: React.FunctionComponent<NomenclaturesTableProps> = ({
    items,
    onRemoveItem,
    onChangeItemCount,
}: NomenclaturesTableProps) => {
    const { t } = useTranslation();
    const nomenclatureCardsState = useNomenclatureCardsState();

    const tableColumns: TableColumnProps[] = React.useMemo(() => ([
        {
            name: 'actions',
            label: t('actions'),
            noSort: true,
            type: ColumnTypes.reactNode,
        },
        {
            name: 'storagePlace',
            label: t('storagePlace'),
            width: '205px',
        },
        {
            name: 'name',
            label: t('nomenclature'),
        },
        {
            name: 'gtin',
            label: t('gtin'),
        },
        {
            name: 'sgtin',
            label: t('sgtin'),
        },
        {
            name: 'unit',
            label: t('measurementUnit'),
        },
        {
            name: 'quantityStorage',
            label: t('quantityStorage'),
        },
        {
            name: 'quantityFact',
            label: t('quantityFact'),
        },
        {
            name: 'shortage',
            label: t('shortage'),
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
        items.map((rowItem: any, rowIndex: number): TTableRowItem => {
            // const nomenclatureCard = nomenclatureCardsState.data.find((nomenclatureItem: TNomenclatureFullData) => (
            //     String(nomenclatureItem.id) === rowItem.item_card_id
            // ));

            return ({
                // ...rowItem,
                // actions: (
                //     <div className="nomenclatures-table__row-actions">
                //         <IconButton
                //             icon="remove"
                //             onClick={(): void => {
                //                 onRemoveItem(rowIndex);
                //             }}
                //         />
                //     </div>
                // ),
                // name: findLabelByValue(nomenclatureOptions, rowItem.item_card_id),
            });
        })), [items, nomenclatureOptions, nomenclatureCardsState.data]);

    return (
        <div className="nomenclatures-table">
            <Table
                columns={tableColumns}
                rows={tableRows}
                withoutPagination
            />
        </div>
    );
};

export default NomenclaturesTable;
