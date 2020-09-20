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

import mapIdNameToValueLabel from 'medici-ui-kit/utils/map-id-name-to-value-label';
import formatDateForApi from 'medici-ui-kit/utils/format-date-for-api';

import useForceUpdate from 'medici-ui-kit/hooks/use-force-update';
import { TNetworkError } from 'medici-ui-kit/types/helper-types';

import CreateNomenclature from 'components/create-nomenclature';
import EnsureSaveEmptyDoc from 'components/ensure-save-empty-doc';
import AddNomenclatures from 'components/add-nomenclatures';
import NomenclaturesTable, { ChangeTotalsInterface } from 'components/nomenclatures-table';

import { ROOT_APP_PATH } from 'constants/general';

import useConsignorsState from 'store/dictionaries/fetch-consignors/use-consignors-state';
import useConsigneesState from 'store/dictionaries/fetch-consignees/use-consignees-state';
import useFundingSourcesState from 'store/dictionaries/fetch-funding-sources/use-funding-sources-state';
import useWarehousesState from 'store/dictionaries/fetch-warehouses/use-warehouses-state';

import createPurchaseInvoice from 'store/purchase-invoice/create-purchase-invoice/action';
import updatePurchaseInvoice from 'store/purchase-invoice/update-purchase-invoice/action';
import fetchPurchaseInvoices from 'store/purchase-invoice/fetch-purchase-invoices/action';

import mapNomenclaturesApiDataToFormData from 'utils/map-nomenclatures-api-data-to-form-data';
import useIdFromQuery from 'hooks/use-id-from-query';

import {
    TConsignor,
    TAddNomenclatureFormData,
    TPurchaseInvoice,
    TPurchaseInvoiceFullData,
} from 'types/gists';
import { TRootState } from 'store/root-reducer';


type TFormData = {
    document_number: string;
    document_date: Date;
    supplier_id: number;
    consignor_id: number;
    consignee_id: number;
    financial_source_id: number;
    contract_number: string;
    warehouse_id: number;
    note: string;
    status: number;
}

interface EditPurchaseInvoiceLocationState {
    isReadOnly: boolean;
    data: TPurchaseInvoiceFullData;
}

type TApiData = Omit<TPurchaseInvoice, 'id'>;

const EditPurchaseInvoicePage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [forceUpdate] = useForceUpdate();
    const history = useHistory<EditPurchaseInvoiceLocationState>();
    const queryId = useIdFromQuery();

    const warehousesState = useWarehousesState();
    const fundingSourcesState = useFundingSourcesState();
    const consigneesState = useConsigneesState();
    const consignorsState = useConsignorsState();

    const createActionState = useSelector((state: TRootState) => state.actions.createPurchaseInvoice);
    const updateActionState = useSelector((state: TRootState) => state.actions.updatePurchaseInvoice);
    const purchaseInvoicesState = useSelector((state: TRootState) => state.purchaseInvoices);

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

        resultItems[editingNomenclatureIndex] = nomenclaturesData[0]; // eslint-disable-line prefer-destructuring
        setNomenclaturesItems(resultItems);
        setShowEditNomenclatureModal(false);
    }, [nomenclaturesItems, editingNomenclatureIndex]);

    const handleSuccessAddNomenclatures = React.useCallback((nomenclaturesData: TAddNomenclatureFormData[]): void => {
        setNomenclaturesItems([...nomenclaturesItems, ...nomenclaturesData]);
        setShowAddNomenclatureModal(false);
    }, [nomenclaturesItems]);

    const handleClickBack = React.useCallback((): void => {
        history.push(`${ROOT_APP_PATH}/purchase_invoice`);
    }, []);

    const handleClickSuccessProceed = React.useCallback((): void => {
        handleClickBack();
    }, []);


    const handleChangeTotals = React.useCallback(({ total, totalWithoutTax }: ChangeTotalsInterface) => {
        setTotalAmountWithoutTax(totalWithoutTax);
        setTotalAmount(total);
    }, []);

    const mapFullDataToFormData = (defaultData: TPurchaseInvoiceFullData): Partial<TFormData> => ({
        document_number: `${defaultData.document_number}`,
        document_date: new Date(defaultData.document_date.date),
        supplier_id: defaultData.supplier.id,
        consignor_id: defaultData.consignor,
        consignee_id: defaultData.consignee.id,
        financial_source_id: defaultData.financial_source.id,
        contract_number: defaultData.contract_number,
        warehouse_id: defaultData.warehouse.id,
        note: defaultData.note,
        status: defaultData.status ? 1 : 0,
    });

    const getDefaultFormValuesFromLocation = (): Partial<TFormData> => {
        const locationDefaultData: TPurchaseInvoiceFullData | undefined = history.location.state?.data;

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

        const purchaseInvoiceId = history.location.state?.data?.id;

        if (purchaseInvoiceId) {
            dispatch(updatePurchaseInvoice({
                ...apiData,
                id: purchaseInvoiceId,
            }));
        } else {
            dispatch(createPurchaseInvoice(apiData));
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
            supplier_id: Number(formData.supplier_id),
            consignor_id: Number(formData.consignor_id),
            consignee_id: Number(formData.consignee_id),
            financial_source_id: Number(formData.financial_source_id),
            contract_number: formData.contract_number,
            warehouse_id: Number(formData.warehouse_id),
            note: formData.note,
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

    const findContractByConsignorId = React.useCallback((consignorId: number): string => {
        const matchedConsignor = consignorsState.data.find((consignorItem: TConsignor) => consignorItem.id === consignorId);

        if (matchedConsignor) {
            return matchedConsignor.contract_number;
        }

        return '';
    }, [consignorsState]);

    React.useEffect(() => {
        const purchaseInvoiceData = history.location.state?.data;

        if (queryId && !purchaseInvoiceData) {
            dispatch(fetchPurchaseInvoices(queryId));
            setReadOnly(true);
        }

        register({ name: 'document_date', type: 'custom' }, { required: true });
        register({ name: 'document_number', type: 'custom' }, { required: true });
        register({ name: 'contract_number', type: 'custom' }, { required: true });
        register({ name: 'note', type: 'custom' });
        register({ name: 'financial_source_id', type: 'custom' }, { required: true });
        register({ name: 'supplier_id', type: 'custom' }, { required: true });
        register({ name: 'consignor_id', type: 'custom' }, { required: true });
        register({ name: 'consignee_id', type: 'custom' }, { required: true });
        register({ name: 'warehouse_id', type: 'custom' }, { required: true });
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
        const purchaseInvoiceData = purchaseInvoicesState.data.find((purchaseInvoiceItem: TPurchaseInvoiceFullData) => purchaseInvoiceItem.id === queryId);

        if (!(purchaseInvoicesState.isLoaded && purchaseInvoiceData)) {
            return;
        }

        const formData = mapFullDataToFormData(purchaseInvoiceData);
        const arrayFormData: Record<string, any>[] = [];

        Object.keys(formData).forEach((formDataKey: keyof TFormData) => {
            arrayFormData.push({
                [formDataKey]: formData[formDataKey],
            });
        });
        setValue(arrayFormData);
        setNomenclaturesItems(mapNomenclaturesApiDataToFormData(purchaseInvoiceData.info));
        setReadOnly(purchaseInvoiceData.status);
    }, [purchaseInvoicesState.isLoaded]);

    const fundingSourcesOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => (
        mapIdNameToValueLabel(fundingSourcesState.data)
    ), [fundingSourcesState.data]);
    const warehousesOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(warehousesState.data), [warehousesState.data]);
    const consigneesOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(consigneesState.data), [consigneesState.data]);
    const consignorsOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(consignorsState.data), [consignorsState.data]);

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
                        <span className="epi__title-label">{t('editPurchaseInvoice.title')}</span>
                        <Input
                            inlineLabel
                            placeholder=""
                            className="epi__line-input"
                            errorMessage={errors.document_number && t('formErrors.id')}
                            isRequired
                            name="document_number"
                            id="purchase-invoice-document_number-input"
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
                            errorMessage={errors.document_date && t('formErrors.id')}
                            id="purchase-invoice-date-input"
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
                        label={t('editPurchaseInvoice.cargoData')}
                        className="epi__accordion"
                    >
                        <div className="accordion-form-content">
                            <Dropdown
                                inline
                                label={t('supplier')}
                                errorMessage={errors.supplier_id && t('formErrors.supplier_id')}
                                isRequired
                                id="purchase-invoice-supplier_id-input"
                                onSelect={(option: number): void => {
                                    setValue('supplier_id', option);
                                    clearError('supplier_id');

                                    if (option) {
                                        setValue('contract_number', findContractByConsignorId(option));
                                        clearError('contract_number');
                                    }
                                }}
                                isLoadingOptions={consignorsState.isLoading}
                                isErrorLoadingOptions={consignorsState.errors.length > 0}
                                options={consignorsOptions}
                                defaultValue={getValues().supplier_id}
                                readOnly={isReadOnly}
                            />
                            <Dropdown
                                inline
                                label={t('consignor')}
                                errorMessage={errors.consignor_id && t('formErrors.consignor_id')}
                                isRequired
                                id="purchase-invoice-consignor_id-input"
                                onSelect={(option: number): void => {
                                    setValue('consignor_id', option);
                                    clearError('consignor_id');
                                }}
                                isLoadingOptions={consignorsState.isLoading}
                                options={consignorsOptions}
                                isErrorLoadingOptions={consignorsState.errors.length > 0}
                                defaultValue={getValues().consignor_id}
                                readOnly={isReadOnly}
                            />
                            <Dropdown
                                inline
                                label={t('consignee')}
                                errorMessage={errors.consignee_id && t('formErrors.consignee_id')}
                                isRequired
                                id="purchase-invoice-consignee_id-input"
                                onSelect={(option: number): void => {
                                    setValue('consignee_id', option);
                                    clearError('consignee_id');
                                }}
                                isLoadingOptions={consigneesState.isLoading}
                                options={consigneesOptions}
                                isErrorLoadingOptions={consigneesState.errors.length > 0}
                                defaultValue={getValues().consignee_id}
                                readOnly={isReadOnly}
                            />
                        </div>
                    </Accordion>
                    <Accordion
                        label={t('editPurchaseInvoice.invoiceData')}
                        className="epi__accordion"
                    >
                        <div className="input-line accordion-form-content">
                            <Input
                                label={t('contract')}
                                placeholder=""
                                errorMessage={errors.contract_number && t('formErrors.contract_number')}
                                isRequired
                                name="contract_number"
                                id="purchase-invoice-contract_number-input"
                                inline
                                childrenWidth="280px"
                                readOnly={isReadOnly}
                                value={getValues().contract_number}
                                onChange={(inputValue: string): void => {
                                    setValue('contract_number', inputValue);
                                }}
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
                        <div>
                            <Input
                                label={t('remark')}
                                placeholder=""
                                errorMessage={errors.note && t('formErrors.note')}
                                name="note"
                                id="purchase-invoice-note-input"
                                childrenWidth="280px"
                                readOnly={isReadOnly}
                                value={getValues().note}
                                onChange={(inputValue: string): void => {
                                    setValue('note', inputValue);
                                }}
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
                title={t('editPurchaseInvoice.savingTitle')}
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
                            <div>{t('editPurchaseInvoice.savingSuccess')}</div>
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

export default EditPurchaseInvoicePage;
