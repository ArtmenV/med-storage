import * as React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import ru from 'date-fns/locale/ru';

import Input from 'medici-ui-kit/components/input';
import Dropdown, { TDropdownOption } from 'medici-ui-kit/components/dropdown';
import DateInput from 'medici-ui-kit/components/date-input';
import Button from 'medici-ui-kit/components/button';
import IconButton from 'medici-ui-kit/components/icon-button';
import Modal from 'medici-ui-kit/components/modal';

import mapIdNameToValueLabel from 'medici-ui-kit/utils/map-id-name-to-value-label';
import findLabelByValue from 'medici-ui-kit/utils/find-label-by-value';
import formatDateForUser from 'medici-ui-kit/utils/format-date-for-user';

import useStoreReasonsState from 'store/dictionaries/fetch-store-reasons/use-store-reasons-state';
import useFundingSourcesState from 'store/dictionaries/fetch-funding-sources/use-funding-sources-state';
import useWarehousesState from 'store/dictionaries/fetch-warehouses/use-warehouses-state';

import ActiveItem from 'components/filter-active-item';

export type TFilters = {
    dateFrom?: Date;
    dateTo?: Date;
    fundingSourceId?: number;
    status?: number;
    storeReasonId?: number;
    warehouseId?: number;
    documentNumber?: string;
}

export type TUsableFilters = {
    storeReasonId?: boolean;
    fundingSourceId?: boolean;
}

export interface FiltersBarProps {
    className?: string;
    onChangeFilters: (filters: TFilters) => void;
    usableFilters?: TUsableFilters;
}
const FiltersBar: React.FunctionComponent<FiltersBarProps> = ({
    className = '',
    onChangeFilters,
    usableFilters = {},
}: FiltersBarProps) => {
    const { t } = useTranslation();
    const warehousesState = useWarehousesState();
    const documentReasonsState = useStoreReasonsState();
    const fundingSourcesState = useFundingSourcesState();

    const [isFiltersModalOpen, setFiltersModalOpen] = React.useState(false);
    const [status, setStatus] = React.useState<number | undefined>(undefined);
    const [dateFrom, setDateFrom] = React.useState<Date | undefined>(undefined);
    const [dateTo, setDateTo] = React.useState<Date | undefined>(undefined);
    const [warehouseId, setWarehouseId] = React.useState<number | undefined>(undefined);
    const [fundingSourceId, setFundingSourceId] = React.useState<number | undefined>(undefined);
    const [storeReasonId, setDocumentReasonId] = React.useState<number | undefined>(undefined);
    const [searchInputValue, setSearchInputValue] = React.useState<string | undefined>(undefined);
    const [documentNumber, setDocumentNumber] = React.useState<string | undefined>(undefined);

    const handleClickFilter = React.useCallback((): void => {
        setFiltersModalOpen(true);
    }, []);

    const allFilters = React.useMemo((): TFilters => ({
        dateFrom,
        dateTo,
        fundingSourceId,
        status,
        storeReasonId,
        warehouseId,
        documentNumber,
    }), [dateFrom, dateTo, fundingSourceId, status, storeReasonId, warehouseId, documentNumber]);

    const handleClickSetFilters = React.useCallback((): void => {
        onChangeFilters(allFilters);
        setFiltersModalOpen(false);
        setSearchInputValue(documentNumber);
    }, [allFilters]);

    const handleClickSearch = React.useCallback((): void => {
        setDocumentNumber(searchInputValue);
        onChangeFilters({
            ...allFilters,
            documentNumber: searchInputValue,
        });
    }, [allFilters, searchInputValue]);

    const handleCloseModal = React.useCallback((): void => {
        setFiltersModalOpen(false);
    }, []);

    const statusOptions = React.useMemo((): TDropdownOption[] => ([
        {
            value: 0,
            label: t('notTransacted'),
        },
        {
            value: 1,
            label: t('transacted'),
        },
    ]), []);

    const warehouseOptions = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(warehousesState.data), [warehousesState.data]);
    const fundingSourceOptions = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(fundingSourcesState.data), [fundingSourcesState.data]);
    const documentReasonOptions = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(documentReasonsState.data), [documentReasonsState.data]);

    const handleClickCancelDocumentNumber = React.useCallback((): void => {
        setDocumentNumber(undefined);
        setSearchInputValue(undefined);
        onChangeFilters({
            ...allFilters,
            documentNumber: undefined,
        });
    }, [allFilters]);
    const handleClickCancelStatus = React.useCallback((): void => {
        setStatus(undefined);
        onChangeFilters({
            ...allFilters,
            status: undefined,
        });
    }, [allFilters]);

    const handleClickCancelDateFrom = React.useCallback((): void => {
        setDateFrom(undefined);
        onChangeFilters({
            ...allFilters,
            dateFrom: undefined,
        });
    }, [allFilters]);
    const handleClickCancelDateTo = React.useCallback((): void => {
        setDateTo(undefined);
        onChangeFilters({
            ...allFilters,
            dateTo: undefined,
        });
    }, [allFilters]);
    const handleClickCancelWarehouseId = React.useCallback((): void => {
        setWarehouseId(undefined);
        onChangeFilters({
            ...allFilters,
            warehouseId: undefined,
        });
    }, [allFilters]);
    const handleClickCancelFundingSourceId = React.useCallback((): void => {
        setFundingSourceId(undefined);
        onChangeFilters({
            ...allFilters,
            fundingSourceId: undefined,
        });
    }, [allFilters]);
    const handleClickCancelDocumentReasonId = React.useCallback((): void => {
        setDocumentReasonId(undefined);
        onChangeFilters({
            ...allFilters,
            storeReasonId: undefined,
        });
    }, [allFilters]);

    return (
        <div className={cx('filters', className)}>
            <div className="filters__first-line">
                <Input
                    name="search-doc"
                    id="search-doc-input"
                    placeholder={t('filterInputPlaceholder')}
                    className="filters__search-input"
                    onChange={setSearchInputValue}
                    value={searchInputValue}
                />
                <Button
                    onClick={handleClickSearch}
                >
                    {t('search')}
                </Button>
                <IconButton
                    className="filters__filters-btn"
                    icon="sliders"
                    onClick={handleClickFilter}
                />
            </div>
            {documentNumber !== undefined && (
                <ActiveItem
                    onCancel={handleClickCancelDocumentNumber}
                    label={`${t('documentNo')}: ${documentNumber}`}
                />
            )}
            {status !== undefined && (
                <ActiveItem
                    onCancel={handleClickCancelStatus}
                    label={`${t('status')}: ${findLabelByValue(statusOptions, status)}`}
                />
            )}
            {dateFrom !== undefined && (
                <ActiveItem
                    onCancel={handleClickCancelDateFrom}
                    label={`${t('dateFrom')}: ${formatDateForUser(dateFrom)}`}
                />
            )}
            {dateTo !== undefined && (
                <ActiveItem
                    onCancel={handleClickCancelDateTo}
                    label={`${t('dateTo')}: ${formatDateForUser(dateTo)}`}
                />
            )}
            {warehouseId !== undefined && (
                <ActiveItem
                    onCancel={handleClickCancelWarehouseId}
                    label={`${t('warehouse')}: ${findLabelByValue(warehouseOptions, warehouseId)}`}
                />
            )}
            {fundingSourceId !== undefined && (
                <ActiveItem
                    onCancel={handleClickCancelFundingSourceId}
                    label={`${t('fundingSource')}: ${findLabelByValue(fundingSourceOptions, fundingSourceId)}`}
                />
            )}
            {storeReasonId !== undefined && (
                <ActiveItem
                    onCancel={handleClickCancelDocumentReasonId}
                    label={`${t('documentReason')}: ${findLabelByValue(documentReasonOptions, storeReasonId)}`}
                />
            )}
            <Modal
                isOpen={isFiltersModalOpen}
                title={t('filtersBarModalTitle')}
                onClose={handleCloseModal}
                verticalPosition="top"
            >
                <div className="filters__modal-content">
                    <div className="input-line">
                        <Input
                            label={t('documentNo')}
                            name="filter-document-number"
                            id="filters-document-number"
                            onChange={setDocumentNumber}
                            value={documentNumber}
                            inline
                            placeholder=""
                            className="filters__field"
                        />
                        <Dropdown
                            id="filters-status"
                            label={t('status')}
                            inline
                            onSelect={(option: number): void => {
                                setStatus(option);
                            }}
                            options={statusOptions}
                            defaultValue={status}
                            className="filters__field"
                        />
                        <DateInput
                            inline
                            label={t('dateFrom')}
                            placeholder={t('datePlaceholder')}
                            id="filters-date-from"
                            value={dateFrom}
                            onChange={(dateValue: Date): void => {
                                setDateFrom(dateValue);
                            }}
                            locale={ru}
                            className="filters__field"
                        />
                        <DateInput
                            inline
                            label={t('dateTo')}
                            placeholder={t('datePlaceholder')}
                            id="filters-date-to"
                            value={dateTo}
                            onChange={(dateValue: Date): void => {
                                setDateTo(dateValue);
                            }}
                            locale={ru}
                            className="filters__field"
                        />
                    </div>
                    <div className="input-line">
                        <Dropdown
                            id="filters-warehouse"
                            label={t('warehouse')}
                            inline
                            onSelect={(option: number): void => {
                                setWarehouseId(option);
                            }}
                            options={warehouseOptions}
                            isLoadingOptions={warehousesState.isLoading}
                            isErrorLoadingOptions={warehousesState.errors.length > 0}
                            defaultValue={warehouseId}
                            className="filters__field"
                        />
                        {usableFilters.fundingSourceId && (
                            <Dropdown
                                id="filters-funding-source"
                                label={t('fundingSource')}
                                inline
                                onSelect={(option: string): void => {
                                    setFundingSourceId(Number(option));
                                }}
                                options={fundingSourceOptions}
                                isLoadingOptions={fundingSourcesState.isLoading}
                                isErrorLoadingOptions={fundingSourcesState.errors.length > 0}
                                defaultValue={fundingSourceId}
                                className="filters__field"
                            />
                        )}
                        {usableFilters.storeReasonId && (
                            <Dropdown
                                id="filters-document-reason"
                                label={t('documentReason')}
                                inline
                                onSelect={(option: number): void => {
                                    setDocumentReasonId(option);
                                }}
                                options={documentReasonOptions}
                                isLoadingOptions={documentReasonsState.isLoading}
                                isErrorLoadingOptions={documentReasonsState.errors.length > 0}
                                defaultValue={storeReasonId}
                                className="filters__field"
                            />
                        )}
                    </div>
                    <Button
                        onClick={handleClickSetFilters}
                        className="filters__set-button"
                    >
                        {t('setFilters')}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default FiltersBar;
