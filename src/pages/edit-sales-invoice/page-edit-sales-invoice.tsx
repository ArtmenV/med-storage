import * as React from 'react';

import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import ru from 'date-fns/locale/ru';
import { TStorageData, TStorageSelectData } from 'types/sales-invoice/storage';
import { TSalesInvoiceFullData } from 'types/sales-invoice/sales-invoice-full-data';
import { TCreateSalesInvoice } from 'types/sales-invoice/create-sales-invoice';
import RingLoader from 'medici-ui-kit/components/ring-loader';

import mapIdNameToValueLabel from 'medici-ui-kit/utils/map-id-name-to-value-label';
import Dropdown, { TDropdownOption } from 'medici-ui-kit/components/dropdown';
import formatDateForApi from 'medici-ui-kit/utils/format-date-for-api';
import useForceUpdate from 'medici-ui-kit/hooks/use-force-update';
import EnsureSaveEmptyDoc from 'components/ensure-save-empty-doc';
import IconButton from 'medici-ui-kit/components/icon-button';
import DateInput from 'medici-ui-kit/components/date-input';
import PageTitle from 'medici-ui-kit/components/page-title';
import Accordion from 'medici-ui-kit/components/accordion';
import Button from 'medici-ui-kit/components/button';
import Shape from 'medici-ui-kit/components/shape';
import Input from 'medici-ui-kit/components/input';
import Modal from 'medici-ui-kit/components/modal';

import { TRootState } from 'store/root-reducer';
import { ROOT_APP_PATH } from 'constants/general';

import useWarehousesState from 'store/dictionaries/fetch-warehouses/use-warehouses-state';
import useWarehousesBranchState from 'store/dictionaries/fetch-warehouse-branch/use-warehouse-branch-state';
import useWriteOfReasonState from 'store/dictionaries/fetch-write-of-reason/use-write-of-reason-state';
import useStorageState from 'store/dictionaries/fetch-storage/use-storage-state';

import createSalesInvoiceAction from 'store/sales-invoice/create-sales-invoice/action';
import fetchSalesInvoices from 'store/sales-invoice/fetch-sales-invoices/action';

import { TNetworkError } from 'medici-ui-kit/types/helper-types';

import addNomeclatureSendAction from '../../store/namenclature-sales-invoice-data/action';
import FormMock from '../../mocks/new-sales-invoice';

import AddNomenclatures from '../../components/sales-invoice/add-nomencaltures-modal';
import NomenclaturesTable from '../../components/sales-invoice/namenclature-table/nomenclatures-table';

type TFormDataSend = {
    document_number?: string;
    document_date: Date;
    warehouse_type_id?: number;
    status: number;
    write_off_reason_id?: number;
    enterprise: number;
    info: [];
}

interface EditSalesInvoiceLocationState {
    isReadOnly: boolean;
    data: TSalesInvoiceFullData;
}

const EditSalesInvoicePage: React.FC = () => {
    const { t } = useTranslation();
    const [forceUpdate] = useForceUpdate();
    const history = useHistory<EditSalesInvoiceLocationState>();
    const dispatch = useDispatch();

    // state this page-----------------------
    const warehousesState = useWarehousesState();
    const warehousesBranchState = useWarehousesBranchState();
    const writeOfReasonState = useWriteOfReasonState();
    const storageState = useStorageState();
    const addedNamenclaturesData = useSelector((state: TRootState) => state.dictionaries.addedSalesInvoiceNameclature.data);
    const createSalesInvoice = useSelector((state: TRootState) => state.actions.createSalesInvoice);

    const [addedNamenclatures, setAddedNamenclatures] = React.useState<TStorageSelectData[]>([]);
    const [showEnsureSaveEmptyDoc, setShowEnsureSaveEmptyDoc] = React.useState(false);
    const [savedApiData, setSavedApiData] = React.useState<TCreateSalesInvoice>();

    const [amountNoTax, setAmountNoTax] = React.useState<number>(0);
    const [allAmount, setAllAmount] = React.useState<number>(0);

    const [showAddNomenclatureModal, setShowAddNomenclatureModal] = React.useState(false);
    const [showActionStateModal, setShowActionStateModal] = React.useState(false);
    const [valueStatus, setValueStatus] = React.useState(0);
    const [openTable, setopenTable] = React.useState(false);
    const [actionState, setActionState] = React.useState(createSalesInvoice);

    React.useEffect(() => {
        setAddedNamenclatures(addedNamenclaturesData);
    }, [addedNamenclaturesData]);

    React.useEffect(() => {
        setActionState(createSalesInvoice);
    }, [createSalesInvoice]);

    React.useEffect(() => {
        dispatch(fetchSalesInvoices());
    }, []);

    const openSuccesModal = React.useCallback((): void => {
        setShowActionStateModal(!showActionStateModal);
    }, [showActionStateModal]);

    const toggleActionStateModal = React.useCallback((): void => {
        setShowActionStateModal(!showActionStateModal);
    }, [showActionStateModal]);

    const toggleAddNomenclatureModal = React.useCallback((): void => {
        setShowAddNomenclatureModal(!showAddNomenclatureModal);
    }, [showAddNomenclatureModal]);

    const toggleAddNomenclatureModals = React.useCallback((): void => {
        setShowAddNomenclatureModal(!showAddNomenclatureModal);
        setopenTable(true);
    }, [openTable, showAddNomenclatureModal]);

    const handleDeleteNomenclatureItem = React.useCallback(
        (index: number): void => {
            const resultItems = [...addedNamenclatures];

            resultItems.splice(index, 1);
            setAddedNamenclatures(resultItems);
            dispatch(addNomeclatureSendAction(resultItems));
        },
        [addedNamenclatures],
    );

    const handleClickBack = React.useCallback((): void => {
        history.push(`${ROOT_APP_PATH}/sales_invoice`);
    }, []);

    const handleClickSuccessProceed = React.useCallback((): void => {
        handleClickBack();
    }, []);

    const mapFullDataToFormData = (defaultData: TSalesInvoiceFullData): Partial<TFormDataSend> => ({
        document_number: String(defaultData.document_number),
        document_date: new Date(defaultData.document_date.date),
        warehouse_type_id: defaultData.warehouse.id,
        write_off_reason_id: defaultData.write_off_reason.id,
        enterprise: defaultData.enterprise,
    });

    const isReadOnly = history.location.state?.isReadOnly;

    const getDefaultFormValuesFromLocation = (): Partial<TFormDataSend> => {
        const locationDefaultData: TSalesInvoiceFullData = history.location.state?.data;

        if (!locationDefaultData) {
            return FormMock;
        }

        return mapFullDataToFormData(locationDefaultData);
    };

    const {
        register,
        handleSubmit,
        errors,
        setValue,
        clearError,
        getValues,
    } = useForm<TFormDataSend>({
        defaultValues: {
            ...getDefaultFormValuesFromLocation(),
        },
    });

    const handleClickSaveAndProceed = React.useCallback((): void => {
        setValueStatus(1);
    }, []);

    const handleClickSureSaveEmptyDocYes = React.useCallback((): void => {
        if (savedApiData) {
            dispatch(createSalesInvoiceAction(savedApiData));
        }
        setShowEnsureSaveEmptyDoc(false);
        setValueStatus(0);
    }, [savedApiData]);

    const handleClickSureSaveEmptyDocNo = React.useCallback((): void => {
        setShowEnsureSaveEmptyDoc(false);
    }, []);

    const onSubmit = (formData: TFormDataSend): void => {
        const info = addedNamenclaturesData.map((item: TStorageSelectData) => ({
            item_card_id: item.item_card.id,
            storage_id: item.id,
            quantity: item.quantity,
        }));
        const data = {
            warehouse_id: Number(formData.warehouse_type_id),
            document_number: Number(formData.document_number),
            document_date: formatDateForApi(formData.document_date),
            write_off_reason_id: formData.write_off_reason_id,
            enterprise: formData.enterprise,
            total_without_taxes: amountNoTax,
            status: valueStatus,
            total: allAmount,
            info,
        };

        if (info.length) {
            dispatch(createSalesInvoiceAction(data));
            openSuccesModal();
        } else {
            setSavedApiData(data);
            setShowEnsureSaveEmptyDoc(true);
            openSuccesModal();
        }
    };

    const handlerAmountNoTax = React.useCallback((data: number): void => {
        setAmountNoTax(data);
    }, []);

    const handlerAllAmount = React.useCallback((data: number): void => {
        setAllAmount(data);
    }, []);


    React.useEffect(() => {
        register({ name: 'document_number', type: 'custom' }, { required: true });
        register({ name: 'document_date', type: 'custom' }, { required: true });
        register({ name: 'warehouse_type_id', type: 'custom' }, { required: true });
        register({ name: 'enterprise', type: 'custom' }, { required: true });
        register({ name: 'write_off_reason_id', type: 'custom' }, { required: true });

        forceUpdate();
    }, []);

    const warehousesOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(
        warehousesState.data,
    ), [warehousesState.data]);

    const warehousesBranchOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(
        warehousesBranchState.data,
    ), [warehousesBranchState.data]);

    const writeOfReasonStateOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(
        writeOfReasonState.data,
    ), [writeOfReasonState.data]);

    return (
        <div className="container-salesInvoice">
            <Shape className="epi__main-shape">
                <IconButton
                    className="epi__back-button"
                    onClick={handleClickBack}
                    icon="back_arrow"
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PageTitle className="epi__title">
                        <span className="epi__title-label">
                            {t('editSalesInvoice.title')}
                        </span>
                    </PageTitle>
                    <Accordion
                        label={t('editSalesInvoice.salesData')}
                    >
                        <Input
                            label={t('editSalesInvoice.numberDoc')}
                            placeholder={t('editSalesInvoice.numberDoc')}
                            errorMessage={errors.document_number && t('editSalesInvoice.errors.document_number')}
                            isRequired
                            name="document_number"
                            inputRef={register({ required: true })}
                            id="sales-invoice-contract_number-input"
                            inline
                            childrenWidth="250px"
                            value={getValues().document_number}
                            onChange={(inputValue: string): void => {
                                setValue('document_number', inputValue);
                            }}
                        />
                        <DateInput
                            inline
                            label={t('documentDate')}
                            className="epi__date-input"
                            placeholder={t('datePlaceholder')}
                            errorMessage={errors.document_date && t('editPurchaseInvoice.errors.id')}
                            id="sales-invoice-date-input"
                            value={getValues().document_date}
                            onChange={(dateValue: Date): void => {
                                setValue('document_date', dateValue);
                                clearError('document_date');
                            }}
                            todayLabel={t('today')}
                            locale={ru}
                            childrenWidth="250px"
                            readOnly={isReadOnly}
                        />
                        <Dropdown
                            inline
                            label={t('warehouse')}
                            placeholder={t('kit.dropdownPlaceholder')}
                            errorMessage={errors.warehouse_type_id && t('editSalesInvoice.errors.warehouse_id')}
                            isRequired
                            id="sales-invoice-warehouse_type_id-input"
                            onSelect={(option: number): void => {
                                setValue('warehouse_type_id', option);
                                clearError('warehouse_type_id');
                            }}
                            isLoadingOptions={warehousesState.isLoading}
                            options={warehousesOptions}
                            isErrorLoadingOptions={warehousesState.errors.length > 0}
                            childrenWidth="369px"
                            defaultValue={getValues().warehouse_type_id}
                            readOnly={isReadOnly}
                        />
                        <Dropdown
                            inline
                            label={t('branch')}
                            placeholder={t('kit.dropdownPlaceholder')}
                            errorMessage={errors.enterprise && t('editSalesInvoice.errors.enterprise')}
                            isRequired
                            id="sales-invoice-warehouser_id-input"
                            onSelect={(option: number): void => {
                                setValue('enterprise', option);
                                clearError('enterprise');
                            }}
                            isLoadingOptions={warehousesBranchState.isLoading}
                            options={warehousesBranchOptions}
                            isErrorLoadingOptions={warehousesBranchState.errors.length > 0}
                            childrenWidth="359px"
                            defaultValue={getValues().enterprise}
                            readOnly={isReadOnly}
                        />
                        <Dropdown
                            inline
                            label={t('editSalesInvoice.reasonForDebiting')}
                            placeholder={t('kit.dropdownPlaceholder')}
                            errorMessage={errors.write_off_reason_id && t('editSalesInvoice.errors.write_of_reason')}
                            isRequired
                            id="sales-invoice-ware-of-type-input"
                            onSelect={(option: number): void => {
                                setValue('write_off_reason_id', option);
                                clearError('write_off_reason_id');
                            }}
                            isLoadingOptions={
                                writeOfReasonState.isLoading
                            }
                            options={writeOfReasonStateOptions}
                            isErrorLoadingOptions={writeOfReasonState.errors.length > 0}
                            defaultValue={getValues().write_off_reason_id}
                            childrenWidth="359px"
                            readOnly={isReadOnly}
                        />
                    </Accordion>
                    <Accordion
                        className="nameclature-table"
                        label={t('nomenclaturesData')}
                    >
                        <NomenclaturesTable
                            onClickRemoveRow={handleDeleteNomenclatureItem}
                            items={addedNamenclatures}
                            handlerWithoutTax={handlerAmountNoTax}
                            handlerAllAmount={handlerAllAmount}
                        />
                        <Button onClick={toggleAddNomenclatureModal}>
                            {t('addNomenclatures')}
                        </Button>
                    </Accordion>
                    <Button
                        filled
                        className="epi__save-button"
                        disabled={isReadOnly}
                        type="submit"
                        onClick={handleClickSaveAndProceed}
                    >
                        {t('saveAndProceed')}
                    </Button>
                    <Button
                        filled
                        type="submit"
                        className="epi__save-button"
                    >
                        {t('save')}
                    </Button>
                </form>
            </Shape>
            <Modal
                isOpen={showAddNomenclatureModal}
                onClose={toggleAddNomenclatureModal}
                title={t(
                    'editSalesInvoice.createSalesInvoiceAddNomenclature',
                )}
                verticalPosition="top"
            >
                <AddNomenclatures
                    handleCloseModal={toggleAddNomenclatureModals}
                />
            </Modal>
            <Modal
                isOpen={showActionStateModal}
                onClose={toggleActionStateModal}
                title={t('editSalesInvoice.savingTitle')}
                verticalPosition="top"
                withoutCloseButton
            >
                <div className="epi__modal-content">
                    {actionState.isLoading && (
                        <RingLoader
                            width="80px"
                            isCentered
                        />
                    )}
                    {actionState.isSuccess && (
                        <>
                            <div>{t('editSalesInvoice.savingSuccess')}</div>
                            <Button
                                className="epi__proceed-button"
                                onClick={handleClickSuccessProceed}
                            >
                                {t('proceed')}
                            </Button>
                        </>
                    )}
                    {actionState.errors.length > 0 && (
                        <>
                            <div>{t('editPurchaseInvoice.savingError')}</div>
                            <br />
                            {actionState.errors.map((errorItem: TNetworkError): JSX.Element => <div key={errorItem.message}>{errorItem.message}</div>)}
                            <Button
                                className="epi__proceed-button"
                                onClick={toggleActionStateModal}
                            >
                                {t('proceed')}
                            </Button>
                        </>
                    )}
                </div>
            </Modal>
            <EnsureSaveEmptyDoc
                isOpen={showEnsureSaveEmptyDoc}
                onClickNo={handleClickSureSaveEmptyDocNo}
                onClickYes={handleClickSureSaveEmptyDocYes}
            />
        </div>
    );
};

export default EditSalesInvoicePage;
