import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'medici-ui-kit/components/button';
import Table, { TableColumnProps, TTableRowItem, ColumnTypes } from 'medici-ui-kit/components/table';

import fetchInventories from 'store/inventory/fetch-inventories/action';
import deleteInventory from 'store/inventory/delete-inventory/action';
import updateInventory from 'store/inventory/update-inventory/action';
import { TRootState } from 'store/root-reducer';

import FiltersBar, { TFilters } from 'components/filters-bar';
import ActionsPopup from 'components/actions-popup';
import SectionBar from 'components/sections-bar';

import { ROOT_APP_PATH } from 'constants/general';
import { TInventoryFullData } from 'types/gists';

const InventoryPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [filters, setFilters] = React.useState<TFilters>({});
    const inventoriesState = useSelector((state: TRootState) => state.inventories);

    const handleClickAddDocument = (): void => {
        history.push(`${ROOT_APP_PATH}/inventory/edit`);
    };

    React.useEffect(() => {
        dispatch(fetchInventories());
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
            name: 'comission_chief',
            label: t('comissionChief'),
        },
        {
            name: 'warehouse',
            label: t('warehouse'),
        },
        {
            name: 'document_date',
            label: t('documentDate'),
            type: ColumnTypes.date,
        },
        {
            name: 'status',
            label: t('status'),
        },
    ]), []);

    const dataFilter = (inventoryItem: TInventoryFullData): boolean => {
        if (filters.status !== undefined && inventoryItem.status !== !!filters.status) return false;
        if (filters.warehouseId && filters.warehouseId !== inventoryItem.warehouse.id) return false;
        if (filters.documentNumber && String(inventoryItem.document_number).toLowerCase().indexOf(filters.documentNumber.toLowerCase()) === -1) {
            return false;
        }
        if (filters.dateFrom && filters.dateFrom.getTime() - new Date(inventoryItem.document_date.date).getTime() >= 0) {
            return false;
        }
        if (filters.dateTo && filters.dateTo.setHours(23, 59, 59, 999) - new Date(inventoryItem.document_date.date).getTime() <= 0) {
            return false;
        }

        return true;
    };

    const tableRows = React.useMemo((): TTableRowItem[] => (
        inventoriesState.data.filter(dataFilter).map((inventoryItem): TTableRowItem => {
            const handleClickEdit = (): void => {
                history.push(`${ROOT_APP_PATH}/inventory/edit?id=${inventoryItem.id}`, {
                    data: inventoryItem,
                });
            };
            const handleClickOpen = (): void => {
                history.push(`${ROOT_APP_PATH}/inventory/edit?id=${inventoryItem.id}`, {
                    data: inventoryItem,
                    isReadOnly: true,
                });
            };
            const handleClickDelete = (): void => {
                dispatch(deleteInventory(inventoryItem.id));
            };

            const handleClickTransact = (): void => {
                dispatch(updateInventory({
                    id: inventoryItem.id,
                    status: 1,
                }));
            };

            return ({
                actions: <ActionsPopup
                    onOpen={inventoryItem.status ? handleClickOpen : undefined}
                    onTransact={!inventoryItem.status ? handleClickTransact : undefined}
                    onEdit={!inventoryItem.status ? handleClickEdit : undefined}
                    onRemove={!inventoryItem.status ? handleClickDelete : undefined}
                    onPrint={(): void => undefined}
                />,
                document_number: inventoryItem.document_number,
                document_date: new Date(inventoryItem.document_date.date),
                warehouse: inventoryItem.warehouse.name,
                comission_chief: inventoryItem.comission_chief.name,
                status: inventoryItem.status ? t('transacted') : t('notTransacted'),
            });
        })
    ), [inventoriesState.data, filters]);

    return (
        <div className="container main-layout">
            <SectionBar
                activeSection="inventory"
            />
            <Button
                onClick={handleClickAddDocument}
                className="inventory__add-doc-btn"
            >
                {t('addDocument')}
            </Button>
            <FiltersBar
                onChangeFilters={setFilters}
            />
            <Table
                className="inventory__table"
                columns={tableColumns}
                rows={tableRows}
            />
        </div>
    );
};

export default InventoryPage;
