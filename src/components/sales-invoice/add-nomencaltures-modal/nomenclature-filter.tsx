import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import useStorageState from 'store/dictionaries/fetch-storage/use-storage-state';

import Dropdown, { TDropdownOption } from 'medici-ui-kit/components/dropdown';
import useForceUpdate from 'medici-ui-kit/hooks/use-force-update';
import Button from 'medici-ui-kit/components/button';
import Input from 'medici-ui-kit/components/input';
import Shape from 'medici-ui-kit/components/shape';

import { TRootState } from 'store/root-reducer';
import { TStorageData, TStorageSelectData } from 'types/sales-invoice/storage';

import TableSearhNomenclatures from './table-check-nomenclatures';
import { SortData } from '../../../mocks/sort-data';

export interface AddNomenclaturesProps {
    handleCloseModal?: () => void | undefined;
}

const NomenclatureForm: React.FC<AddNomenclaturesProps> = ({
    handleCloseModal,
}: AddNomenclaturesProps) => {
    const [forceUpdate] = useForceUpdate();
    const { t } = useTranslation();

    const storageState = useStorageState();
    const addedNamenclaturesData = useSelector((state: TRootState) => state.dictionaries.addedSalesInvoiceNameclature);

    const [nomenclaturesItems, setNomenclaturesItems] = React.useState<TStorageData[]>([]);
    const [sortTable, setSortTable] = React.useState<TDropdownOption[]>([...SortData]);
    const [searchFilter, setSearchFilter] = React.useState<string>('');
    const [items, setItems] = React.useState<number[]>([]);
    const [currentValue, setCurrentValue] = React.useState<number>();

    React.useEffect(() => {
        const storageFilterData = [...nomenclaturesItems].filter((x: TStorageData) => !items.includes(x.id));
        setNomenclaturesItems(storageFilterData);
    }, [items.length]);

    const namenclatureCardTable = React.useCallback((): void => {
        setNomenclaturesItems([...storageState.data]);
        const itemUseId = [...addedNamenclaturesData.data].map((item: TStorageSelectData) => item.id);
        setItems(itemUseId);
    }, [storageState.data]);

    const sortForExpirationDate = React.useCallback((data: number): void => {
        setCurrentValue(data);

        switch (data) {
        case 2: {
            const dataSort = [...nomenclaturesItems].sort((a, b): number => {
                const firstDate: Date = new Date(b.expiration_date.date);
                const secondDate: Date = new Date(a.expiration_date.date);
                return +firstDate - +secondDate;
            });
            setNomenclaturesItems(dataSort);
            break;
        }

        case 1: {
            const dataSort = [...nomenclaturesItems].sort((a, b): number => {
                const firstDate: Date = new Date(b.expiration_date.date);
                const secondDate: Date = new Date(a.expiration_date.date);
                return +secondDate - +firstDate;
            });
            setNomenclaturesItems(dataSort);
            break;
        }

        default: {
            break;
        }
        }
    }, [currentValue, nomenclaturesItems]);

    React.useEffect(() => {
        namenclatureCardTable();
    }, []);

    React.useEffect(() => {
        forceUpdate();
    }, []);

    const handleSearchInput = (e: string): void => {
        setSearchFilter(e);
    };

    const handleClick = (): void => {
        let data;
        if (searchFilter !== '') {
            data = storageState.data.filter((item: TStorageData) => item.item_card.trade_name.name
                .toLowerCase()
                .trim()
                .includes(searchFilter.toLowerCase().trim()));
            setNomenclaturesItems([...data]);
        } else {
            setNomenclaturesItems([...storageState.data]);
        }
    };

    return (
        <div className="add-nomenclatures-sales-invoice">
            <Shape className="nomenclature-sales-invoice-form">
                <div>
                    {t('editSalesInvoice.searchNamenclature')}
                </div>
                <div className={cx('filters')}>
                    <Input
                        name="search-doc"
                        id="search-doc-input"
                        placeholder={t('filterInputPlaceholder')}
                        className="filters__search-input"
                        onChange={handleSearchInput}
                    />
                    <Button
                        onClick={handleClick}
                    >
                        {t('search')}
                    </Button>
                </div>
                <div className="nomenclature-sales-invoice-form__search">
                    <Dropdown
                        inline
                        placeholder={t('')}
                        isRequired
                        id="purchase-invoice-consignor_id-input"
                        onSelect={(option: number): void => {
                            sortForExpirationDate(option);
                        }}
                        options={sortTable}
                        defaultValue={1}
                        childrenWidth="190px"
                    />
                </div>
                <TableSearhNomenclatures
                    items={nomenclaturesItems}
                />
            </Shape>

            <div className="add-nomenclatures-sales-invoice__controls">
                <Button
                    onClick={handleCloseModal}
                >
                    {t('next')}
                </Button>
            </div>
        </div>

    );
};

export default NomenclatureForm;
