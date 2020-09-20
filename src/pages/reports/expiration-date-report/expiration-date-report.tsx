import * as React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Table, { TableColumnProps, TTableRowItem, ColumnTypes } from 'medici-ui-kit/components/table';
import RingLoader from 'medici-ui-kit/components/ring-loader';

import { TRootState } from 'store/root-reducer';

export interface ExpirationDateReportProps {
    className?: string;
}

const ExpirationDateReport: React.FC<ExpirationDateReportProps> = ({
    className = '',
}: ExpirationDateReportProps) => {
    const { t } = useTranslation();
    const expirationDateState = useSelector((state: TRootState) => state.reports.expirationDate);

    const tableColumns: TableColumnProps[] = React.useMemo(() => ([
        {
            name: 'nomenclature',
            label: t('nomenclature'),
        },
        {
            name: 'series',
            label: t('series'),
        },
        {
            name: 'warehouse',
            label: t('warehouse'),
        },
        {
            name: 'warehouseBalance',
            label: t('balance'),
        },
        {
            name: 'branch',
            label: t('branch'),
        },
        {
            name: 'expirationDate',
            label: t('expirationDate'),
            type: ColumnTypes.date,
        },
        {
            name: 'expirationTerm',
            label: t('expirationTerm'),
            width: '130px',
        },
    ]), []);

    const tableRows = React.useMemo((): TTableRowItem[] => (
        expirationDateState.data.map((dataItem): TTableRowItem => ({
            nomenclature: dataItem.trade_name,
            series: dataItem.series,
            warehouse: dataItem.warehouse,
            warehouseBalance: dataItem.warehouse_quantity,
            branch: '', // TODO add branch
            expirationDate: new Date(dataItem.expiration_date.date),
            expirationTerm: Number(dataItem.date_diff) > 0 ? Number(dataItem.date_diff) : t('expired'),
        }))), [expirationDateState.data]);

    const expiredItemRowClassnameAdder = React.useCallback((rowItem: TTableRowItem): string => (
        rowItem.expirationTerm === t('expired') ? 'expiration-date-report__expired-row' : ''
    ), []);

    return (
        <div className={cx('expiration-date-report', className)}>
            {expirationDateState.isLoading && (
                <RingLoader
                    width="80px"
                    isCentered
                />
            )}
            {expirationDateState.isLoaded && (
                <Table
                    columns={tableColumns}
                    rows={tableRows}
                    addRowClassName={expiredItemRowClassnameAdder}
                />
            )}
        </div>
    );
};

export default ExpirationDateReport;
