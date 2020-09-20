import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import ru from 'date-fns/locale/ru';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Shape from 'medici-ui-kit/components/shape';
import PageTitle from 'medici-ui-kit/components/page-title';
import Accordion from 'medici-ui-kit/components/accordion';
import DateInput from 'medici-ui-kit/components/date-input';
import Input from 'medici-ui-kit/components/input';
import Button from 'medici-ui-kit/components/button';
import IconButton from 'medici-ui-kit/components/icon-button';
import RingLoader from 'medici-ui-kit/components/ring-loader';
import Dropdown, { TDropdownOption } from 'medici-ui-kit/components/dropdown';
import Modal from 'medici-ui-kit/components/modal';

import formatDateForApi from 'medici-ui-kit/utils/format-date-for-api';
import mapIdNameToValueLabel from 'medici-ui-kit/utils/map-id-name-to-value-label';

import useForceUpdate from 'medici-ui-kit/hooks/use-force-update';
import { TNetworkError } from 'medici-ui-kit/types/helper-types';

import CreateNomenclature from 'components/create-nomenclature';
import EnsureSaveEmptyDoc from 'components/ensure-save-empty-doc';
import AddNomenclatures from 'components/add-nomenclatures';
import NomenclaturesTable, { ChangeTotalsInterface } from 'components/nomenclatures-table';

import { ROOT_APP_PATH } from 'constants/general';

import useStoreReasonsState from 'store/dictionaries/fetch-store-reasons/use-store-reasons-state';
import useFundingSourcesState from 'store/dictionaries/fetch-funding-sources/use-funding-sources-state';
import useWarehousesState from 'store/dictionaries/fetch-warehouses/use-warehouses-state';

import createBalanceInvoice from 'store/balance-invoice/create-balance-invoice/action';
import updateBalanceInvoice from 'store/balance-invoice/update-balance-invoice/action';
import fetchBalanceInvoices from 'store/balance-invoice/fetch-balance-invoices/action';

import mapNomenclaturesApiDataToFormData from 'utils/map-nomenclatures-api-data-to-form-data';
import useIdFromQuery from 'hooks/use-id-from-query';

import {
    TAddNomenclatureFormData,
    TBalanceInvoice,
    TBalanceInvoiceFullData,
} from 'types/gists';
import { TRootState } from 'store/root-reducer';

type TFormData = {
    document_number: string;
    document_date: Date;
    financial_source_id: number;
    warehouse_id: number;
    store_reason_id: number;
    note: string;
    status: number;
}

type TApiData = Omit<TBalanceInvoice, 'id'>;

interface EditBalanceInvoiceLocationState {
    isReadOnly: boolean;
    data: TBalanceInvoiceFullData;
}

const EditEnteringBalancePage: React.FC = () => {
    const { t } = useTranslation();
    const [forceUpdate] = useForceUpdate();
    const dispatch = useDispatch();
    const history = useHistory<EditBalanceInvoiceLocationState>();
    const queryId = useIdFromQuery();

    const warehousesState = useWarehousesState();
    const storeReasonsState = useStoreReasonsState();
    const fundingSourcesState = useFundingSourcesState();

    const createActionState = useSelector((state: TRootState) => state.actions.createBalanceInvoice);
    const updateActionState = useSelector((state: TRootState) => state.actions.updateBalanceInvoice);
    const balanceInvoicesState = useSelector((state: TRootState) => state.balanceInvoices);

    const getNomenclaturesFormDataFromLocationState = (): TAddNomenclatureFormData[] => {
        const infoData = history.location.state?.data?.info;

        if (!infoData) {
            return [];
        }

        return mapNomenclaturesApiDataToFormData(infoData);
    };

    const [isReadOnly, setReadOnly] = React.useState<boolean>(history.location.state?.isReadOnly);
    const [showAddNomenclatureModal, setShowAddNomenclatureModal] = React.useState(false);
    const [showEditNomenclatureModal, setShowEditNomenclatureModal] = React.useState(false);
    const [showEnsureSaveEmptyDoc, setShowEnsureSaveEmptyDoc] = React.useState(false);
    const [showActionStateModal, setShowActionStateModal] = React.useState(false);
    const [editingNomenclatureIndex, setEditingNomenclatureIndex] = React.useState(0);
    const [showCreateNomenclatureModal, setShowCreateNomenclatureModal] = React.useState(false);
    const [nomenclaturesItems, setNomenclaturesItems] = React.useState<TAddNomenclatureFormData[]>(getNomenclaturesFormDataFromLocationState());
    const [savedApiData, setSavedApiData] = React.useState<TApiData>();
    const [totalAmount, setTotalAmount] = React.useState(0);
    const [totalAmountWithoutTax, setTotalAmountWithoutTax] = React.useState(0);
    const [actionState, setActionState] = React.useState(updateActionState);

    const toggleAddNomenclatureModal = React.useCallback((): void => {
        setShowAddNomenclatureModal(!showAddNomenclatureModal);
    }, [showAddNomenclatureModal]);
    const toggleCreateNomenclatureModal = React.useCallback((): void => {
        setShowCreateNomenclatureModal(!showCreateNomenclatureModal);
    }, [showCreateNomenclatureModal]);
    const toggleEditNomenclatureModal = React.useCallback((): void => {
        setShowEditNomenclatureModal(!showEditNomenclatureModal);
    }, [showEditNomenclatureModal]);
    const toggleActionStateModal = React.useCallback((): void => {
        setShowActionStateModal(!showActionStateModal);
    }, [showActionStateModal]);

    const handleDeleteNomenclatureItem = React.useCallback((index: number) => {
        const resultItems = [...nomenclaturesItems];

        resultItems.splice(index, 1);
        setNomenclaturesItems(resultItems);
    }, [nomenclaturesItems]);

    const handleEditNomenclatureItem = React.useCallback((index: number) => {
        toggleEditNomenclatureModal();
        setEditingNomenclatureIndex(index);
    }, [nomenclaturesItems]);

    const handleSuccessEditNomenclature = React.useCallback((nomenclaturesData: TAddNomenclatureFormData[]) => {
        const resultItems = [...nomenclaturesItems];

        [resultItems[editingNomenclatureIndex]] = nomenclaturesData;
        setNomenclaturesItems(resultItems);
        setShowEditNomenclatureModal(false);
    }, [nomenclaturesItems, editingNomenclatureIndex]);

    const handleSuccessAddNomenclatures = React.useCallback((nomenclaturesData: TAddNomenclatureFormData[]): void => {
        setNomenclaturesItems([...nomenclaturesItems, ...nomenclaturesData]);
        setShowAddNomenclatureModal(false);
    }, [nomenclaturesItems]);

    const handleClickBack = React.useCallback((): void => {
        history.push(`${ROOT_APP_PATH}/entering_balance`);
    }, []);

    const handleClickSuccessProceed = React.useCallback((): void => {
        handleClickBack();
    }, []);


    const handleChangeTotals = React.useCallback(({ total, totalWithoutTax }: ChangeTotalsInterface) => {
        setTotalAmountWithoutTax(totalWithoutTax);
        setTotalAmount(total);
    }, []);

    const mapFullDataToFormData = (defaultData: TBalanceInvoiceFullData): Partial<TFormData> => ({
        document_number: `${defaultData.document_number}`,
        document_date: new Date(defaultData.document_date.date),
        financial_source_id: defaultData.financial_source.id,
        warehouse_id: defaultData.warehouse.id,
        status: defaultData.status ? 1 : 0,
        store_reason_id: defaultData.storeReason.id,
    });

    const getDefaultFormValuesFromLocation = (): Partial<TFormData> => {
        const locationDefaultData: TBalanceInvoiceFullData | undefined = history.location.state?.data;

        if (!locationDefaultData) {
            return {};
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
    } = useForm<TFormData>({
        defaultValues: {
            ...getDefaultFormValuesFromLocation(),
            document_date: new Date(),
            status: 0,
        },
    });

    const successSubmit = (apiData: TApiData): void => {
        setShowActionStateModal(true);

        const balanceInvoiceId = history.location.state?.data?.id;

        if (balanceInvoiceId) {
            dispatch(updateBalanceInvoice({
                ...apiData,
                id: balanceInvoiceId,
            }));
        } else {
            dispatch(createBalanceInvoice(apiData));
        }
    };

    const handleClickSureSaveEmptyDocYes = React.useCallback((): void => {
        if (savedApiData) {
            successSubmit(savedApiData);
        }

        setShowEnsureSaveEmptyDoc(false);
    }, [savedApiData]);

    const handleClickSureSaveEmptyDocNo = React.useCallback((): void => {
        setShowEnsureSaveEmptyDoc(false);
    }, []);

    const onSubmit = (formData: TFormData): void => {
        const preparedNomenclatures = nomenclaturesItems.map((nomenclatureFormItem: TAddNomenclatureFormData) => ({
            series: nomenclatureFormItem.series,
            expirationDate: formatDateForApi(nomenclatureFormItem.expirationDate),
            quantity: Number(nomenclatureFormItem.quantity),
            item_card_id: Number(nomenclatureFormItem.item_card_id),
            amountWithTax: Number(nomenclatureFormItem.amountWithTax),
            numberOfUnits: Number(nomenclatureFormItem.numberOfUnits),
            unitPriceWithTaxes: Number(nomenclatureFormItem.unitPriceWithTaxes),
        }));
        const apiData = {
            financial_source_id: Number(formData.financial_source_id),
            warehouse_id: Number(formData.warehouse_id),
            store_reason_id: Number(formData.store_reason_id),
            document_number: Number(formData.document_number),
            document_date: formatDateForApi(formData.document_date),
            total_without_taxes: Number(totalAmountWithoutTax),
            total: Number(totalAmount),
            info: preparedNomenclatures,
            status: formData.status,
        };

        if (preparedNomenclatures.length > 0) {
            successSubmit(apiData);
        } else {
            setSavedApiData(apiData);
            setShowEnsureSaveEmptyDoc(true);
        }
    };

    const handleClickSaveAndProceed = React.useCallback((): void => {
        setValue('status', 1);
    }, []);

    React.useEffect(() => {
        const balanceInvoiceData = history.location.state?.data;

        if (queryId && !balanceInvoiceData) {
            dispatch(fetchBalanceInvoices(queryId));
        }

        register({ name: 'document_date', type: 'custom' }, { required: true });
        register({ name: 'document_number', type: 'custom' }, { required: true });
        register({ name: 'financial_source_id', type: 'custom' }, { required: true });
        register({ name: 'warehouse_id', type: 'custom' }, { required: true });
        register({ name: 'store_reason_id', type: 'custom' }, { required: true });
        register({ name: 'status', type: 'custom' }, { required: true });

        forceUpdate();
    }, []);

    React.useEffect(() => {
        setActionState(createActionState);
    }, [createActionState]);

    React.useEffect(() => {
        setActionState(updateActionState);
    }, [updateActionState]);

    React.useEffect(() => {
        const balanceInvoiceData = balanceInvoicesState.data.find((balanceInvoiceItem: TBalanceInvoiceFullData) => balanceInvoiceItem.id === queryId);

        if (!(balanceInvoicesState.isLoaded && balanceInvoiceData)) {
            return;
        }

        const formData = mapFullDataToFormData(balanceInvoiceData);
        const arrayFormData: Record<string, any>[] = [];

        Object.keys(formData).forEach((formDataKey: keyof TFormData) => {
            arrayFormData.push({
                [formDataKey]: formData[formDataKey],
            });
        });
        setValue(arrayFormData);

        setNomenclaturesItems(mapNomenclaturesApiDataToFormData(balanceInvoiceData.info));
        setReadOnly(balanceInvoiceData.status);
    }, [balanceInvoicesState.isLoaded]);

    const reasonOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => (
        mapIdNameToValueLabel(storeReasonsState.data)
    ), [storeReasonsState.data]);
    const fundingSourcesOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => (
        mapIdNameToValueLabel(fundingSourcesState.data)
    ), [fundingSourcesState.data]);
    const warehousesOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(warehousesState.data), [warehousesState.data]);

    return (
        <div className="container">
            <Shape className="epi__main-shape">
                <IconButton
                    className="epi__back-button"
                    onClick={handleClickBack}
                    icon="back_arrow"
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PageTitle className="epi__title">
                        <span className="epi__title-label">{t('editBalanceInvoice.title')}</span>
                        <Input
                            inlineLabel
                            placeholder=""
                            className="epi__line-input"
                            errorMessage={errors.document_number && t('formErrors.id')}
                            isRequired
                            name="document_number"
                            id="balance-invoice-document_number-input"
                            readOnly={isReadOnly}
                            value={getValues().document_number}
                            onChange={(inputValue: string): void => {
                                setValue('document_number', inputValue);
                            }}
                        />
                        <DateInput
                            inlineLabel
                            inline
                            label={t('from')}
                            className="epi__date-input"
                            placeholder={t('datePlaceholder')}
                            errorMessage={errors.document_date && t('formErrors.date')}
                            id="balance-invoice-date-input"
                            value={getValues().document_date}
                            onChange={(dateValue: Date): void => {
                                setValue('document_date', dateValue);
                                clearError('document_date');
                            }}
                            todayLabel={t('today')}
                            locale={ru}
                            readOnly={isReadOnly}
                        />
                    </PageTitle>
                    <Accordion
                        label={t('editBalanceInvoice.invoiceData')}
                        className="epi__accordion"
                    >
                        <div className="input-line accordion-form-content">
                            <Dropdown
                                label={t('documentReason')}
                                inline
                                errorMessage={errors.financial_source_id && t('formErrors.reason_id')}
                                onSelect={(option: number): void => {
                                    setValue('store_reason_id', option);
                                    clearError('store_reason_id');
                                }}
                                options={reasonOptions}
                                isLoadingOptions={storeReasonsState.isLoading}
                                isErrorLoadingOptions={storeReasonsState.errors.length > 0}
                                isRequired
                                defaultValue={getValues().store_reason_id}
                                readOnly={isReadOnly}
                            />
                            <Dropdown
                                label={t('fundingSource')}
                                inline
                                errorMessage={errors.financial_source_id && t('formErrors.financial_source_id')}
                                onSelect={(option: number): void => {
                                    setValue('financial_source_id', option);
                                    clearError('financial_source_id');
                                }}
                                isRequired
                                options={fundingSourcesOptions}
                                isLoadingOptions={fundingSourcesState.isLoading}
                                isErrorLoadingOptions={fundingSourcesState.errors.length > 0}
                                defaultValue={getValues().financial_source_id}
                                readOnly={isReadOnly}
                            />
                            <Dropdown
                                label={t('warehouse')}
                                inline
                                errorMessage={errors.warehouse_id && t('formErrors.warehouse_id')}
                                isRequired
                                onSelect={(option: number): void => {
                                    setValue('warehouse_id', option);
                                    clearError('warehouse_id');
                                }}
                                options={warehousesOptions}
                                isLoadingOptions={warehousesState.isLoading}
                                isErrorLoadingOptions={warehousesState.errors.length > 0}
                                defaultValue={getValues().warehouse_id}
                                readOnly={isReadOnly}
                            />
                        </div>
                    </Accordion>
                    <Accordion label={t('nomenclaturesData')}>
                        <NomenclaturesTable
                            onClickEditRow={handleEditNomenclatureItem}
                            onClickRemoveRow={handleDeleteNomenclatureItem}
                            items={nomenclaturesItems}
                            totalAmount={totalAmount}
                            totalAmountWithoutTax={totalAmountWithoutTax}
                            onChangeTotals={handleChangeTotals}
                        />
                        <Button
                            onClick={toggleAddNomenclatureModal}
                            disabled={isReadOnly}
                            className=""
                        >
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
                        className="epi__save-button"
                        disabled={isReadOnly}
                        type="submit"
                    >
                        {t('save')}
                    </Button>
                </form>
            </Shape>
            <EnsureSaveEmptyDoc
                isOpen={showEnsureSaveEmptyDoc}
                onClickNo={handleClickSureSaveEmptyDocNo}
                onClickYes={handleClickSureSaveEmptyDocYes}
            />
            <Modal
                isOpen={showAddNomenclatureModal}
                onClose={toggleAddNomenclatureModal}
                title={t('addNomenclaturesTitle')}
                verticalPosition="top"
            >
                <AddNomenclatures
                    onSave={handleSuccessAddNomenclatures}
                    onClickNewNomenclature={toggleCreateNomenclatureModal}
                />
            </Modal>
            <Modal
                isOpen={showEditNomenclatureModal}
                onClose={toggleEditNomenclatureModal}
                title={t('editNomenclatureTitle')}
                verticalPosition="top"
            >
                <AddNomenclatures
                    onSave={handleSuccessEditNomenclature}
                    onClickNewNomenclature={toggleCreateNomenclatureModal}
                    defaultItem={nomenclaturesItems[editingNomenclatureIndex]}
                    isEditing
                />
            </Modal>
            <Modal
                isOpen={showActionStateModal}
                onClose={toggleActionStateModal}
                title={t('editBalanceInvoice.savingTitle')}
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
                            <div>{t('editBalanceInvoice.savingSuccess')}</div>
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
                            <div>{t('editBalanceInvoice.savingError')}</div>
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
            <Modal
                isOpen={showCreateNomenclatureModal}
                onClose={toggleCreateNomenclatureModal}
                title={t('createNomenclature.title')}
                verticalPosition="top"
            >
                <CreateNomenclature
                    onClose={toggleCreateNomenclatureModal}
                />
            </Modal>
        </div>
    );
};

export default EditEnteringBalancePage;
