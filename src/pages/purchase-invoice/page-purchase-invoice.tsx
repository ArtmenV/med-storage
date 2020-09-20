import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'medici-ui-kit/components/button';
import Table, { TableColumnProps, TTableRowItem, ColumnTypes } from 'medici-ui-kit/components/table';

import fetchPurchaseInvoices from 'store/purchase-invoice/fetch-purchase-invoices/action';
import deletePurchaseInvoice from 'store/purchase-invoice/delete-purchase-invoice/action';
import updatePurchaseInvoice from 'store/purchase-invoice/update-purchase-invoice/action';
import { TRootState } from 'store/root-reducer';

import SectionBar from 'components/sections-bar';
import FiltersBar, { TFilters } from 'components/filters-bar';
import ActionsPopup from 'components/actions-popup';

import { ROOT_APP_PATH } from 'constants/general';
import { TPurchaseInvoiceFullData } from 'types/gists';

const purchaseInvoiceUsableFilters = {
    fundingSourceId: true,
};

const PurchaseInvoicePage: React.FunctionComponent = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [filters, setFilters] = React.useState<TFilters>({});
    const purchaseInvoicesState = useSelector((state: TRootState) => state.purchaseInvoices);
    const handleClickAddDocument = (): void => {
        history.push(`${ROOT_APP_PATH}/purchase_invoice/edit`);
    };

    React.useEffect(() => {
        dispatch(fetchPurchaseInvoices());
    }, []);

    const tableColumns: TableColumnProps[] = React.useMemo(() => ([
        {
            name: 'actions',
            label: t('actions'),
            width: '30px',
            noSort: true,
            type: ColumnTypes.reactNode,
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
            name: 'financial_source',
            label: t('fundingSource'),
        },
        {
            name: 'warehouse',
            label: t('warehouse'),
        },
        {
            name: 'status',
            label: t('status'),
        },
    ]), []);

    const dataFilter = (purchaseInvoiceItem: TPurchaseInvoiceFullData): boolean => {
        if (filters.status !== undefined && purchaseInvoiceItem.status !== !!filters.status) return false;
        if (filters.fundingSourceId && filters.fundingSourceId !== purchaseInvoiceItem.financial_source.id) return false;
        if (filters.warehouseId && filters.warehouseId !== purchaseInvoiceItem.warehouse.id) return false;
        if (filters.documentNumber && String(purchaseInvoiceItem.document_number).toLowerCase().indexOf(filters.documentNumber.toLowerCase()) === -1) {
            return false;
        }
        if (filters.dateFrom && filters.dateFrom.getTime() - new Date(purchaseInvoiceItem.document_date.date).getTime() >= 0) {
            return false;
        }
        if (filters.dateTo && filters.dateTo.setHours(23, 59, 59, 999) - new Date(purchaseInvoiceItem.document_date.date).getTime() <= 0) {
            return false;
        }
        return true;
    };

    const tableRows = React.useMemo((): TTableRowItem[] => (
        purchaseInvoicesState.data.filter(dataFilter).map((purchaseInvoiceItem): TTableRowItem => {
            const handleClickEdit = (): void => {
                history.push(`${ROOT_APP_PATH}/purchase_invoice/edit?id=${purchaseInvoiceItem.id}`, {
                    data: purchaseInvoiceItem,
                });
            };
            const handleClickOpen = (): void => {
                history.push(`${ROOT_APP_PATH}/purchase_invoice/edit?id=${purchaseInvoiceItem.id}`, {
                    data: purchaseInvoiceItem,
                    isReadOnly: true,
                });
            };
            const handleClickDelete = (): void => {
                dispatch(deletePurchaseInvoice(purchaseInvoiceItem.id));
            };

            const handleClickTransact = (): void => {
                dispatch(updatePurchaseInvoice({
                    id: purchaseInvoiceItem.id,
                    status: 1,
                }));
            };

            return ({
                actions: <ActionsPopup
                    onOpen={purchaseInvoiceItem.status ? handleClickOpen : undefined}
                    onTransact={!purchaseInvoiceItem.status ? handleClickTransact : undefined}
                    onEdit={!purchaseInvoiceItem.status ? handleClickEdit : undefined}
                    onRemove={!purchaseInvoiceItem.status ? handleClickDelete : undefined}
                    onPrint={(): void => undefined}
                />,
                document_number: purchaseInvoiceItem.document_number,
                document_date: new Date(purchaseInvoiceItem.document_date.date),
                financial_source: purchaseInvoiceItem.financial_source.name,
                warehouse: purchaseInvoiceItem.warehouse.name,
                status: purchaseInvoiceItem.status ? t('transacted') : t('notTransacted'),
            });
        })
    ), [purchaseInvoicesState.data, filters]);

    return (
        <div className="container main-layout">
            <SectionBar
                activeSection="purchaseInvoice"
            />
            <Button
                onClick={handleClickAddDocument}
                className="purchase-invoice__add-doc-btn"
            >
                {t('addDocument')}
            </Button>
            <FiltersBar
                onChangeFilters={setFilters}
                usableFilters={purchaseInvoiceUsableFilters}
            />
            <Table
                className="purchase-invoice__table"
                columns={tableColumns}
                rows={tableRows}
            />
        </div>
    );
};

export default PurchaseInvoicePage;
