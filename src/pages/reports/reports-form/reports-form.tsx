import * as React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import ru from 'date-fns/locale/ru';

import Dropdown, { TDropdownOption } from 'medici-ui-kit/components/dropdown';
import DateInput from 'medici-ui-kit/components/date-input';
import Button from 'medici-ui-kit/components/button';

import mapIdNameToValueLabel from 'medici-ui-kit/utils/map-id-name-to-value-label';
import findLabelByValue from 'medici-ui-kit/utils/find-label-by-value';

import { TIdNameRecord } from 'medici-ui-kit/types/data-types';

import useNomenclatureCardsState from 'store/nomenclature-card/fetch-nomenclature-cards/use-nomenclature-cards-state';
import useWarehousesState from 'store/dictionaries/fetch-warehouses/use-warehouses-state';
import useBranchesState from 'store/dictionaries/fetch-branches/use-branches-state';

export enum ReportTypes {
    balanceReport = 1,
    expirationDate = 2,
}

export enum ExpirationDateReportTypes {
    expired =1,
    byDate = 2,
    byRange = 3,
}
export type TFilters = {
    reportType?: ReportTypes;
    reportSubType?: ExpirationDateReportTypes;
    dateFrom?: Date;
    dateTo?: Date;
    warehouse?: TIdNameRecord;
    branch?: TIdNameRecord;
    nomenclature?: TIdNameRecord;
}

export interface ReportsFormProps {
    className?: string;
    onChangeFilters: (filters: TFilters) => void;
    defaultFilters: TFilters;
}

const ReportsForm: React.FC<ReportsFormProps> = ({
    className = '',
    onChangeFilters,
    defaultFilters,
}: ReportsFormProps) => {
    const { t } = useTranslation();
    const [reportType, setType] = React.useState<number | undefined>(defaultFilters.reportType);
    const [reportSubType, setSubType] = React.useState<number | undefined>(defaultFilters.reportSubType || ExpirationDateReportTypes.expired);
    const [dateFrom, setDateFrom] = React.useState<Date | undefined>(defaultFilters.dateFrom);
    const [dateTo, setDateTo] = React.useState<Date | undefined>(defaultFilters.dateTo);
    const [warehouse, setWarehouse] = React.useState<TIdNameRecord | undefined>(defaultFilters.warehouse);
    const [branch, setBranch] = React.useState<TIdNameRecord | undefined>(defaultFilters.branch);
    const [nomenclature, setNomenclature] = React.useState<TIdNameRecord | undefined>(defaultFilters.nomenclature);

    const nomenclatureCardsState = useNomenclatureCardsState();
    const warehousesState = useWarehousesState();
    const branchesState = useBranchesState();

    const allFilters = React.useMemo((): TFilters => ({
        reportType,
        reportSubType,
        dateFrom,
        dateTo,
        warehouse,
        branch,
        nomenclature,
    }), [dateFrom, dateTo, reportType, warehouse, branch, warehouse, nomenclature]);

    const handleClickSetFilters = React.useCallback((): void => {
        onChangeFilters(allFilters);
    }, [allFilters]);

    const handleClickExpireExpirationDateReport = React.useCallback((): void => {
        setSubType(ExpirationDateReportTypes.expired);
        setDateTo(undefined);
        setDateFrom(undefined);
    }, []);

    const handleClickByDateExpirationDateReport = React.useCallback((): void => {
        setSubType(ExpirationDateReportTypes.byDate);
        setDateFrom(undefined);
    }, []);

    const handleClickByRangeExpirationDateReport = React.useCallback((): void => {
        setSubType(ExpirationDateReportTypes.byRange);
        setDateFrom(new Date());
    }, []);

    const typesOptions = React.useMemo((): TDropdownOption[] => ([
        {
            value: ReportTypes.balanceReport,
            label: t('reportTypes.balance'),
        },
        {
            value: ReportTypes.expirationDate,
            label: t('reportTypes.expirationDate'),
        },
    ]), []);

    const warehouseOptions = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(warehousesState.data), [warehousesState.data]);
    const branchOptions = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(branchesState.data), [branchesState.data]);
    const nomenclatureOptions = React.useMemo((): TDropdownOption[] => (
        nomenclatureCardsState.data.map(
            (nomenclatureItem) => ({
                value: nomenclatureItem.id,
                label: nomenclatureItem.trade_name.name,
            }),
        )
    ), [nomenclatureCardsState.data]);

    const shouldShowExpirationDateReportDateInput = reportType === ReportTypes.expirationDate && reportSubType && reportSubType > 1;
    let termReportDateLabel = '';

    switch (reportSubType) {
    case ExpirationDateReportTypes.byDate: termReportDateLabel = t('expireDate'); break;
    case ExpirationDateReportTypes.byRange: termReportDateLabel = t('rangeDate'); break;
    default: break;
    }

    const shouldDisableSetButton = reportType === ReportTypes.expirationDate
        && (reportSubType === ExpirationDateReportTypes.byRange || reportSubType === ExpirationDateReportTypes.byDate)
        && !dateTo;

    return (
        <div className={cx('filters', className)}>
            <div className="input-line">
                <Dropdown
                    id="reports-form-type"
                    label={t('chooseReportType')}
                    inline
                    onSelect={(option: number): void => {
                        setType(option);
                    }}
                    options={typesOptions}
                    defaultValue={reportType}
                    className="reports-form__type-field"
                />
            </div>
            <div className="input-line">
                <Dropdown
                    id="reports-form-warehouse"
                    label={t('warehouse')}
                    inline
                    onSelect={(option: number): void => {
                        setWarehouse({
                            id: option,
                            name: findLabelByValue(warehouseOptions, option),
                        });
                    }}
                    options={warehouseOptions}
                    isLoadingOptions={warehousesState.isLoading}
                    isErrorLoadingOptions={warehousesState.errors.length > 0}
                    defaultValue={warehouse?.id}
                    className="reports-form__middle-field"
                />
                <Dropdown
                    id="reports-form-warehouse"
                    label={t('branch')}
                    inline
                    onSelect={(option: number): void => {
                        setBranch({
                            id: option,
                            name: findLabelByValue(branchOptions, option),
                        });
                    }}
                    options={branchOptions}
                    isLoadingOptions={branchesState.isLoading}
                    isErrorLoadingOptions={branchesState.errors.length > 0}
                    defaultValue={branch?.id}
                    className="reports-form__middle-field"
                />
                <Dropdown
                    id="reports-form-nomenclature"
                    label={t('nomenclature')}
                    inline
                    onSelect={(option: number): void => {
                        setNomenclature({
                            id: option,
                            name: findLabelByValue(nomenclatureOptions, option),
                        });
                    }}
                    options={nomenclatureOptions}
                    isLoadingOptions={nomenclatureCardsState.isLoading}
                    isErrorLoadingOptions={nomenclatureCardsState.errors.length > 0}
                    defaultValue={nomenclature?.id}
                    className="reports-form__middle-field"
                />
            </div>
            {reportType === ReportTypes.expirationDate && (
                <div className="input-line">
                    <Button
                        onClick={handleClickExpireExpirationDateReport}
                        filled={reportSubType === ExpirationDateReportTypes.expired}
                        className="reports-form__subtype-button"
                    >
                        {t('reportTypes.expired')}
                    </Button>
                    <Button
                        onClick={handleClickByDateExpirationDateReport}
                        filled={reportSubType === ExpirationDateReportTypes.byDate}
                        className="reports-form__subtype-button"
                    >
                        {t('reportTypes.byDate')}
                    </Button>
                    <Button
                        onClick={handleClickByRangeExpirationDateReport}
                        filled={reportSubType === ExpirationDateReportTypes.byRange}
                        className="reports-form__subtype-button"
                    >
                        {t('reportTypes.byRange')}
                    </Button>
                </div>
            )}
            {shouldShowExpirationDateReportDateInput && (
                <div className="input-line">
                    <DateInput
                        inline
                        label={termReportDateLabel}
                        placeholder={t('datePlaceholder')}
                        id="reports-form-date-to"
                        value={dateTo}
                        onChange={(dateValue: Date): void => {
                            setDateTo(dateValue);
                        }}
                        locale={ru}
                        className="reports-form__small-field"
                    />
                </div>
            )}
            <Button
                onClick={handleClickSetFilters}
                className="reports-form__set-button"
                disabled={shouldDisableSetButton}
            >
                {t('setFilters')}
            </Button>
        </div>
    );
};

export default ReportsForm;
