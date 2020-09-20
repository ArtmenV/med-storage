import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import Button from 'medici-ui-kit/components/button';
import Modal from 'medici-ui-kit/components/modal';
import Shape from 'medici-ui-kit/components/shape';
import IconButton from 'medici-ui-kit/components/icon-button';

import formatDateForUser from 'medici-ui-kit/utils/format-date-for-user';
import formatDateForApi from 'medici-ui-kit/utils/format-date-for-api';

import SectionBar from 'components/sections-bar';
import ActiveItem from 'components/filter-active-item';

import fetchExpirationDateReport from 'store/reports/expiration-date/action';
import { TRootState } from 'store/root-reducer';

import { TExpirationDateReportPaylod } from 'types/gists';

import ReportsForm, { TFilters, ReportTypes, ExpirationDateReportTypes } from './reports-form';
import ExpirationDateReport from './expiration-date-report';

export default (): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const expirationDateState = useSelector((state: TRootState) => state.reports.expirationDate);

    const [isFormModalOpen, setFormModalOpen] = React.useState(false);
    const [filters, setFilters] = React.useState<TFilters>({});
    const handleClickOpenForm = React.useCallback((): void => {
        setFormModalOpen(true);
    }, []);

    const handleCloseModal = React.useCallback((): void => {
        setFormModalOpen(false);
    }, []);

    const handleChangeFilters = React.useCallback((newFilters: TFilters): void => {
        setFormModalOpen(false);
        setFilters(newFilters);
    }, []);

    const handleClickCloseReport = React.useCallback((): void => {
        setFilters({});
    }, []);

    const handleClickCancelNomenclature = React.useCallback((): void => {
        setFilters({
            ...filters,
            nomenclature: undefined,
        });
    }, [filters]);
    const handleClickCancelWarehouse = React.useCallback((): void => {
        setFilters({
            ...filters,
            warehouse: undefined,
        });
    }, [filters]);
    const handleClickCancelBranch = React.useCallback((): void => {
        setFilters({
            ...filters,
            branch: undefined,
        });
    }, [filters]);

    const handleClickWriteOff = React.useCallback((): void => {
        //
    }, []);

    useUpdateEffect(() => {
        if (filters.reportType === ReportTypes.expirationDate) {
            const reportActionPayload: TExpirationDateReportPaylod = {
                warehouse: filters.warehouse?.id,
                enterprise: filters.branch?.id,
                itemCard: filters.nomenclature?.id,
            };

            switch (filters.reportSubType) {
            case ExpirationDateReportTypes.expired:
                reportActionPayload.dateFrom = '';
                reportActionPayload.dateTo = '';
                break;
            case ExpirationDateReportTypes.byDate:
                reportActionPayload.dateFrom = formatDateForApi(filters.dateTo || new Date());
                reportActionPayload.dateTo = '';
                break;
            case ExpirationDateReportTypes.byRange:
                reportActionPayload.dateFrom = formatDateForApi(new Date());
                reportActionPayload.dateTo = formatDateForApi(filters.dateTo || new Date());
                break;
            default: break;
            }

            dispatch(fetchExpirationDateReport(reportActionPayload));
        }
    }, [filters]);
    return (
        <div className="container main-layout">
            <SectionBar
                activeSection="reports"
            />
            <Button
                onClick={handleClickOpenForm}
                className="reports__get-param-btn"
            >
                {t('getParameters')}
            </Button>
            {filters.reportType && (
                <Shape className="reports__container">
                    <IconButton
                        icon="cancel"
                        className="reports__close-report-btn"
                        onClick={handleClickCloseReport}
                    />
                    <div className="reports__header">
                        <h2 className="reports__title">
                            {filters.reportType === 1 ? t('reportsPage.balanceTitle') : t('reportsPage.expirationDateTitle')}
                        </h2>
                        <IconButton
                            icon="print"
                            className="reports__print-btn"
                        />
                    </div>
                    {filters.reportSubType === ExpirationDateReportTypes.expired && (
                        <div>
                            {t('reportsPage.expiredReportSubType', { date: '111111' })}
                        </div>
                    )}
                    {filters.reportSubType === ExpirationDateReportTypes.byDate && filters.dateTo && (
                        <div>
                            {t('reportsPage.byDateReportSubType', { dateTo: formatDateForUser(filters.dateTo) })}
                        </div>
                    )}
                    {filters.reportSubType === ExpirationDateReportTypes.byRange && filters.dateTo && filters.dateFrom && (
                        <div>
                            {t('reportsPage.byRangeReportSubType', {
                                dateTo: formatDateForUser(filters.dateTo),
                                dateFrom: formatDateForUser(filters.dateFrom),
                            })}
                        </div>
                    )}
                    <div className="reports__active-items">
                        {filters.nomenclature !== undefined && (
                            <ActiveItem
                                onCancel={handleClickCancelNomenclature}
                                label={`${t('nomenclature')}: ${filters.nomenclature.name}`}
                            />
                        )}
                        {filters.warehouse !== undefined && (
                            <ActiveItem
                                onCancel={handleClickCancelWarehouse}
                                label={`${t('warehouse')}: ${filters.warehouse.name}`}
                            />
                        )}
                        {filters.branch !== undefined && (
                            <ActiveItem
                                onCancel={handleClickCancelBranch}
                                label={`${t('branch')}: ${filters.branch.name}`}
                            />
                        )}
                        <Button
                            onClick={handleClickWriteOff}
                            disabled={expirationDateState.data.length < 1}
                            className="reports__write-off-button"
                        >
                            {t('writeOff')}
                        </Button>
                    </div>
                    {filters.reportType === ReportTypes.expirationDate && (
                        <ExpirationDateReport />
                    )}
                </Shape>
            )}
            <Modal
                isOpen={isFormModalOpen}
                title={t('reportsPage.formModalTitle')}
                onClose={handleCloseModal}
                verticalPosition="top"
            >
                <ReportsForm
                    defaultFilters={filters}
                    onChangeFilters={handleChangeFilters}
                />
            </Modal>
        </div>
    );
};
