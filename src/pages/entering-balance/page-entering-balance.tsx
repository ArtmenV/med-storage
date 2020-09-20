import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from 'medici-ui-kit/components/button';
import Table, { TableColumnProps, TTableRowItem, ColumnTypes } from 'medici-ui-kit/components/table';

import ActionsPopup from 'components/actions-popup';
import SectionBar from 'components/sections-bar';
import FiltersBar, { TFilters } from 'components/filters-bar';

import { ROOT_APP_PATH } from 'constants/general';
import { TBalanceInvoiceFullData } from 'types/gists';
import fetchBalanceInvoices from 'store/balance-invoice/fetch-balance-invoices/action';
import deleteBalanceInvoice from 'store/balance-invoice/delete-balance-invoice/action';
import updateBalanceInvoice from 'store/balance-invoice/update-balance-invoice/action';

import { TRootState } from 'store/root-reducer';

const balanceInvoiceUsableFilters = {
    fundingSourceId: true,
    storeReasonId: true,
};

const EnteringBalancePage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const balanceInvoicesState = useSelector((state: TRootState) => state.balanceInvoices);

    const [filters, setFilters] = React.useState<TFilters>({});

    const handleClickAddDocument = (): void => {
        history.push(`${ROOT_APP_PATH}/entering_balance/edit`);
    };

    React.useEffect(() => {
        dispatch(fetchBalanceInvoices());
    }, []);

    const dataFilter = (balanceInvoiceItem: TBalanceInvoiceFullData): boolean => {
        if (filters.status !== undefined && balanceInvoiceItem.status !== !!filters.status) return false;
        if (filters.fundingSourceId && filters.fundingSourceId !== balanceInvoiceItem.financial_source.id) return false;
        if (filters.warehouseId && filters.warehouseId !== balanceInvoiceItem.warehouse.id) return false;
        if (filters.storeReasonId && filters.storeReasonId !== balanceInvoiceItem.storeReason.id) return false;
        if (filters.documentNumber && String(balanceInvoiceItem.document_number).toLowerCase().indexOf(filters.documentNumber.toLowerCase()) === -1) {
            return false;
        }
        if (filters.dateFrom && filters.dateFrom.getTime() - new Date(balanceInvoiceItem.document_date.date).getTime() >= 0) {
            return false;
        }
        if (filters.dateTo && filters.dateTo.setHours(23, 59, 59, 999) - new Date(balanceInvoiceItem.document_date.date).getTime() <= 0) {
            return false;
        }
        return true;
    };

    const tableColumns: TableColumnProps[] = React.useMemo(() => ([
        {
            name: 'actions',
            label: t('actions'),
            width: '30px',
            noSort: true,
            type: ColumnTypes.reactNode,
        },
        {
            name: 'status',
            label: t('status'),
        },
        {
            name: 'document_number',
            label: t('documentNo'),
        },
        {
            name: 'document_date',
            label: t('documentDate'),
            type: ColumnTypes.date,
        },
        {
            name: 'store_reason',
            label: t('documentReason'),
        },
        {
            name: 'financial_source',
            label: t('fundingSource'),
        },
        {
            name: 'warehouse',
            label: t('warehouse'),
        },

    ]), []);

    const tableRows = React.useMemo((): TTableRowItem[] => (
        balanceInvoicesState.data.filter(dataFilter).map((balanceInvoiceItem): TTableRowItem => {
            const handleClickEdit = (): void => {
                history.push(`${ROOT_APP_PATH}/entering_balance/edit?id=${balanceInvoiceItem.id}`, {
                    data: balanceInvoiceItem,
                });
            };
            const handleClickOpen = (): void => {
                history.push(`${ROOT_APP_PATH}/entering_balance/edit?id=${balanceInvoiceItem.id}`, {
                    data: balanceInvoiceItem,
                    isReadOnly: true,
                });
            };
            const handleClickDelete = (): void => {
                dispatch(deleteBalanceInvoice(balanceInvoiceItem.id));
            };

            const handleClickTransact = (): void => {
                dispatch(updateBalanceInvoice({
                    id: balanceInvoiceItem.id,
                    status: 1,
                }));
            };

            return ({
                actions: <ActionsPopup
                    onOpen={balanceInvoiceItem.status ? handleClickOpen : undefined}
                    onTransact={!balanceInvoiceItem.status ? handleClickTransact : undefined}
                    onEdit={!balanceInvoiceItem.status ? handleClickEdit : undefined}
                    onRemove={!balanceInvoiceItem.status ? handleClickDelete : undefined}
                    onPrint={(): void => undefined}
                />,
                document_number: balanceInvoiceItem.document_number,
                document_date: new Date(balanceInvoiceItem.document_date.date),
                financial_source: balanceInvoiceItem.financial_source.name,
                warehouse: balanceInvoiceItem.warehouse.name,
                store_reason: balanceInvoiceItem.storeReason.name,
                status: balanceInvoiceItem.status ? t('transacted') : t('notTransacted'),
            });
        })
    ), [balanceInvoicesState.data, filters]);

    return (
        <div className="container main-layout">
            <SectionBar
                activeSection="enteringBalance"
            />
            <Button
                onClick={handleClickAddDocument}
                className="entering-balance__add-doc-btn"
            >
                {t('addDocument')}
            </Button>
            <FiltersBar
                onChangeFilters={setFilters}
                usableFilters={balanceInvoiceUsableFilters}
            />
            <Table
                className="entering-balance__table"
                columns={tableColumns}
                rows={tableRows}
            />
        </div>
    );
};

export default EnteringBalancePage;
