import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Table, { TableColumnProps, TTableRowItem } from 'medici-ui-kit/components/table';
import formatDateForApi from 'medici-ui-kit/utils/format-date-for-api';
import Checkbox from 'medici-ui-kit/components/checkbox';
import { TStorageData, TStorageSelectData } from 'types/sales-invoice/storage';
import { TRootState } from 'store/root-reducer';
import addNomeclatureSendAction from 'store/namenclature-sales-invoice-data/action';

export interface NomenclaturesTableOwnProps {
    items: TStorageData[];
}

export type TCheckboxType = {
  [key: number]: boolean;
}

const NomenclaturesTable: React.FC<NomenclaturesTableOwnProps> = ({
    items,
}: NomenclaturesTableOwnProps) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const addedNamenclaturesData = useSelector((state: TRootState) => state.dictionaries.addedSalesInvoiceNameclature);

    const [isCheckedTableBox, setCheckedTableBox] = React.useState<TCheckboxType>({});
    const [dataCurrentRow, setdataCurrentRow] = React.useState<TStorageSelectData[]>([]);
    const [tablePage, setTablePage] = React.useState(1);

    const tableColumns: TableColumnProps[] = React.useMemo(() => ([
        {
            name: 'action',
            label: t('editSalesInvoice.action'),
        },
        {
            name: 'name',
            label: t('nomenclature'),
        },
        {
            name: 'warehouse',
            label: t('warehouse'),
        },
        {
            name: 'balance',
            label: t('balance'),
        },
        {
            name: 'expirationDate',
            label: t('expirationDate'),
            width: '140px',
        },
        {
            name: 'expirationTerm',
            label: t('expirationTerm'),
            width: '120px',
        },
    ]), []);

    React.useEffect(() => {
        setdataCurrentRow([...addedNamenclaturesData.data]);
    }, []);

    const handleCheckBox = (data: TStorageData): void => {
        const datas = [data].map((rowItem: TStorageData): TStorageSelectData => ({
            ...rowItem,
            name: rowItem.item_card.trade_name.name,
            balance: rowItem.quantity,
            expiration_date: formatDateForApi(new Date(rowItem.expiration_date.date)),
            warehouse: rowItem.warehouse.name,
        }));

        const findId = [...dataCurrentRow].some((item: TStorageSelectData) => item.id === datas[0].id);
        if (findId) {
            const filterArray = [...dataCurrentRow].filter((item: TStorageSelectData) => item.id !== datas[0].id);
            setdataCurrentRow([...filterArray]);
            dispatch(addNomeclatureSendAction([...filterArray]));
        } else {
            setdataCurrentRow([...dataCurrentRow, datas[0]]);
            dispatch(addNomeclatureSendAction([...dataCurrentRow, datas[0]]));
        }
    };

    const tableRows = React.useMemo((): TTableRowItem[] => (
        items.map((rowItem: TStorageData, index: number): TTableRowItem => {
            const changeCheckboxState = (num: number, value: boolean): void => (
                setCheckedTableBox({ ...isCheckedTableBox, [num]: value })
            );
            const getCheckboxHandler = (num: number) => (value: boolean): void => {
                changeCheckboxState(num, value);
                handleCheckBox(rowItem);
            };

            const calcDayToExpiration = (date: Date): number => {
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const firstDate: Date = new Date();
                const secondDate: Date = new Date(date);

                return Math.round((+secondDate - +firstDate) / oneDay);
            };

            return ({
                ...rowItem,
                action: (
                    <div className="nomenclatures-table__row-actions">
                        <Checkbox
                            checked={isCheckedTableBox[index]}
                            onChange={getCheckboxHandler(index)}
                        />
                    </div>
                ),
                name: rowItem.item_card.trade_name.name,
                balance: rowItem.quantity,
                expirationDate: formatDateForApi(new Date(rowItem.expiration_date.date)),
                expirationTerm: calcDayToExpiration(new Date(rowItem.expiration_date.date)),
                warehouse: rowItem.warehouse.name,
            });
        })), [items, isCheckedTableBox]);

    return (
        <div className="nomenclatures-table">
            <Table
                columns={tableColumns}
                rows={tableRows}
                onChangePage={setTablePage}
                selectedPage={tablePage}
            />
        </div>
    );
};

export default NomenclaturesTable;
