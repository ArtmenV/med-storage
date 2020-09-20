import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from 'medici-ui-kit/components/button';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';
import ActionsPopup from 'components/actions-popup';
import formatDateForUser from 'medici-ui-kit/utils/format-date-for-user';

import { TSalesInvoiceFullData } from 'types/sales-invoice/sales-invoice-full-data';
import Table, { TableColumnProps, TTableRowItem } from 'medici-ui-kit/components/table';

import fetchSalesInvoices from 'store/sales-invoice/fetch-sales-invoices/action';
import deleteSalesInvoice from 'store/sales-invoice/delete-sales-invoice/action';
import updateSalesInvoice from 'store/sales-invoice/update-sales-invoice/action';

import useWarehousesBranchState from 'store/dictionaries/fetch-warehouse-branch/use-warehouse-branch-state';
import addNomeclatureSendAction from 'store/namenclature-sales-invoice-data/action';

import { ROOT_APP_PATH } from 'constants/general';
import SectionBar from 'components/sections-bar';
import FiltersBar, { TFilters } from 'components/filters-bar';
import { TWarehouseBranch } from 'types/sales-invoice/warehouse-branch';

export default (): JSX.Element => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [filters, setFilters] = React.useState<TFilters>({});

    const salesInvoiceFullData = useSelector((state: TRootState) => state.salesInvoice.data);
    const deleteSalesInvoiceAction = useSelector((state: TRootState) => state.actions.deleteSalesInvoice);
    const warehousesBranchState = useWarehousesBranchState();

    const warehousesBranch = React.useMemo(() => warehousesBranchState.data, [warehousesBranchState.data]);

    const handleClickAddDocument = (): void => {
        history.push(`${ROOT_APP_PATH}/sales_invoice/edit`);
    };

    React.useEffect(() => {
        dispatch(fetchSalesInvoices());
    }, [deleteSalesInvoiceAction.isSuccess]);

    React.useEffect(() => {
        dispatch(fetchSalesInvoices());
        dispatch(addNomeclatureSendAction([]));
    }, []);

    const tableColumns: TableColumnProps[] = [
        {
            name: 'actions',
            label: t('actions'),
            width: '30px',
        },
        {
            name: 'status',
            label: t('status'),
        },
        {
            name: 'document_number',
            label: t('editSalesInvoice.numberDoc'),
        },
        {
            name: 'document_date',
            label: t('documentDate'),
        },
        {
            name: 'warehouse',
            label: t('warehouse'),
        },
        {
            name: 'branch',
            label: t('branch'),
        },
        {
            name: 'reasonForDebiting',
            label: t('editSalesInvoice.reasonForDebiting'),
        },
    ];

    const dataFilter = (salesInvoiceItem: TSalesInvoiceFullData): boolean => {
        if (filters.status !== undefined && salesInvoiceItem.status !== !!filters.status) return false;
        if (filters.warehouseId && filters.warehouseId !== salesInvoiceItem.warehouse_id) return false;
        if (filters.documentNumber && String(salesInvoiceItem.document_number).toLowerCase().indexOf(filters.documentNumber.toLowerCase()) === -1) {
            return false;
        }
        if (filters.dateFrom && filters.dateFrom.getTime() - new Date(salesInvoiceItem.document_date.date).getTime() >= 0) {
            return false;
        }
        if (filters.dateTo && filters.dateTo.setHours(23, 59, 59, 999) - new Date(salesInvoiceItem.document_date.date).getTime() <= 0) {
            return false;
        }
        return true;
    };

    const tableRows = React.useMemo((): TTableRowItem[] => (
        salesInvoiceFullData.filter(dataFilter).map((salesInvoiceItem: TSalesInvoiceFullData): TTableRowItem => {
            const enterprise = warehousesBranch.find((item: TWarehouseBranch) => item.id === salesInvoiceItem.enterprise);
            const handleClickEdit = (): void => {
                // history.push(`${ROOT_APP_PATH}/sales_invoice/edit?id=${salesInvoiceItem.id}`, {
                //     data: salesInvoiceItem,
                // });
            };
            const handleClickOpen = (): void => {
                // history.push(`${ROOT_APP_PATH}/sales_invoice/edit?id=${salesInvoiceItem.id}`, {
                //     data: salesInvoiceItem,
                //     isReadOnly: true,
                // });
            };
            const handleClickDelete = (): void => {
                dispatch(deleteSalesInvoice(salesInvoiceItem.id));
            };

            const handleClickTransact = (): void => {
                // dispatch(updateSalesInvoice({
                //     id: salesInvoiceItem.id,
                //     status: 1,
                // }));
            };

            const printHandle = async () => {
                // history.push(`${ROOT_APP_PATH}/sales_invoice/edit?id=${salesInvoiceItem.id}`, {
                //     data: salesInvoiceItem,
                //     isReadOnly: true,
                //     isPrint: true,
                // });
            };

            return ({
                actions: <ActionsPopup
                    // onOpen={salesInvoiceItem.status ? handleClickOpen : undefined}
                    // onTransact={!salesInvoiceItem.status ? handleClickTransact : undefined}
                    // onEdit={!salesInvoiceItem.status ? handleClickEdit : undefined}
                    onRemove={!salesInvoiceItem.status ? handleClickDelete : undefined}
                    onPrint={printHandle}
                />,
                document_number: salesInvoiceItem.document_number,
                document_date: formatDateForUser(new Date(salesInvoiceItem.document_date.date)),
                branch: enterprise?.name,
                warehouse: salesInvoiceItem.warehouse.name,
                status: salesInvoiceItem.status ? t('transacted') : t('notTransacted'),
                reasonForDebiting: salesInvoiceItem.write_off_reason.name,
            });
        })
    ), [salesInvoiceFullData, filters]);

    return (
        <div className="container main-layout">
            <SectionBar
                activeSection="salesInvoice"
            />
            <Button
                onClick={handleClickAddDocument}
                className="sales-invoice__add-doc-btn"
            >
                {t('addDocument')}
            </Button>
            <FiltersBar
                onChangeFilters={setFilters}
            />
            <Table
                columns={tableColumns}
                rows={tableRows}
            />
        </div>
    );
};
