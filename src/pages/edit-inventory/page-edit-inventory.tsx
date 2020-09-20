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
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';

import { ROOT_APP_PATH } from 'constants/general';

import useWarehousesState from 'store/dictionaries/fetch-warehouses/use-warehouses-state';
import useMembersState from 'store/dictionaries/fetch-members/use-members-state';

import createInventory from 'store/inventory/create-inventory/action';
import updateInventory from 'store/inventory/update-inventory/action';
import fetchInventorys from 'store/inventory/fetch-inventories/action';
import fetchStorageData from 'store/storage/fetch-storage-data/action';

import useIdFromQuery from 'hooks/use-id-from-query';

import {
    TInventory,
    TInventoryFullData,
    TInventoryNomenclatureFormData,
    TInventoryNomenclatureInfo,
} from 'types/gists';
import { TRootState } from 'store/root-reducer';

import NomenclaturesTable from './nomenclatures-table';

type TFormData = {
    document_number: string;
    document_date: Date;
    warehouse_id: number;
    status: number;
    comission_chief_id: number;
    comission_members: number[];
}

interface EditInventoryLocationState {
    isReadOnly: boolean;
    data: TInventoryFullData;
}

type TApiData = Omit<TInventory, 'id'>;

const EditInventoryPage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [forceUpdate] = useForceUpdate();
    const history = useHistory<EditInventoryLocationState>();
    const queryId = useIdFromQuery();

    const warehousesState = useWarehousesState();
    const membersState = useMembersState();

    const storageDataState = useSelector((state: TRootState) => state.storage);
    const createActionState = useSelector((state: TRootState) => state.actions.createInventory);
    const updateActionState = useSelector((state: TRootState) => state.actions.updateInventory);
    const inventoriesState = useSelector((state: TRootState) => state.inventories);

    const mapNomenclaturesApiDataToFormData = (apiData: TInventoryNomenclatureInfo[]): TInventoryNomenclatureFormData[] => (
        apiData.map((infoDataItem: TInventoryNomenclatureInfo) => ({
            item_card_id: `${infoDataItem.item_card_id}`,
            storage_id: `${infoDataItem.storage_id}`,
            GTIN: infoDataItem.GTIN,
            SGTIN: infoDataItem.SGTIN,
            quantity_expected: `${infoDataItem.quantity_expected}`,
            quantity_real: `${infoDataItem.quantity_real}`,
            shortage: `${infoDataItem.shortage}`,
        }))
    );

    const getNomenclaturesFormDataFromLocationState = (): TInventoryNomenclatureFormData[] => {
        const infoData = history.location.state?.data?.info;

        if (!infoData) {
            return [];
        }

        return mapNomenclaturesApiDataToFormData(infoData);
    };

    const [isReadOnly, setReadOnly] = React.useState<boolean>(history.location.state?.isReadOnly);
    const [showActionStateModal, setShowActionStateModal] = React.useState(false);
    const [nomenclaturesItems, setNomenclaturesItems] = React.useState<TInventoryNomenclatureFormData[]>(getNomenclaturesFormDataFromLocationState());
    const [actionState, setActionState] = React.useState(updateActionState);

    const toggleActionStateModal = React.useCallback((): void => {
        setShowActionStateModal(!showActionStateModal);
    }, [showActionStateModal]);


    const handleClickBack = React.useCallback((): void => {
        history.push(`${ROOT_APP_PATH}/inventory`);
    }, []);

    const handleClickSuccessProceed = React.useCallback((): void => {
        handleClickBack();
    }, []);


    const mapFullDataToFormData = (defaultData: TInventoryFullData): Partial<TFormData> => ({
        document_number: `${defaultData.document_number}`,
        document_date: new Date(defaultData.document_date.date),
        warehouse_id: defaultData.warehouse.id,
        status: defaultData.status ? 1 : 0,
        comission_chief_id: defaultData.comission_chief?.id,
        comission_members: defaultData.comission_members.map((memberItem: TIdNameRecord) => memberItem.id),
    });

    const getDefaultFormValuesFromLocation = (): Partial<TFormData> => {
        const locationDefaultData: TInventoryFullData | undefined = history.location.state?.data;

        if (!locationDefaultData) {
            return {};
        }

        return mapFullDataToFormData(locationDefaultData);
    };

    const {
        register,
        handleSubmit: getSubmitHandler,
        errors,
        setValue,
        clearError,
        getValues,
    } = useForm<TFormData>({
        defaultValues: {
            ...getDefaultFormValuesFromLocation(),
            document_date: new Date(),
            status: 0,
            document_number: '1111', // TODO remove mock data
            warehouse_id: 1, // TODO remove mock data
            comission_chief_id: 1, // TODO remove mock data
            comission_members: [1], // TODO remove mock data
        },
    });

    const successSubmit = (apiData: TApiData): void => {
        setShowActionStateModal(true);

        const inventoryId = history.location.state?.data?.id;

        if (inventoryId) {
            dispatch(updateInventory({
                ...apiData,
                id: inventoryId,
            }));
        } else {
            dispatch(createInventory(apiData));
        }
    };

    const onSubmit = (formData: TFormData): void => {
        const preparedNomenclatures = nomenclaturesItems.map((nomenclatureFormItem: TInventoryNomenclatureFormData): TInventoryNomenclatureInfo => ({
            item_card_id: 1, // TODO
            storage_id: 1,
            GTIN: '',
            SGTIN: '',
            quantity_expected: 1,
            quantity_real: 1,
            shortage: 1,
            measurement_unit_id: 1,
        }));
        const apiData = {
            warehouse_id: Number(formData.warehouse_id),
            document_number: Number(formData.document_number),
            document_date: formatDateForApi(formData.document_date),
            info: preparedNomenclatures,
            status: formData.status,
            comission_chief_id: Number(formData.comission_chief_id),
            comission_members: formData.comission_members,
        };

        successSubmit(apiData);
    };

    const handleClickNext = React.useCallback((): void => {
        getSubmitHandler((formData: TFormData): void => {
            dispatch(fetchStorageData()); // TODO fetching filter
        })();
    }, [getSubmitHandler]);

    const handleClickSaveAndProceed = React.useCallback((): void => {
        setValue('status', 1);
    }, []);

    const handleRemoveNomenclatureItem = React.useCallback((index: number): void => {
        //
    }, []);

    const handleChangeNomenclatureItemCount = React.useCallback((index: number, count: number): void => {
        //
    }, []);

    React.useEffect(() => {
        const inventoryData = history.location.state?.data;

        if (queryId && !inventoryData) {
            dispatch(fetchInventorys(queryId));
            setReadOnly(true);
        }

        register({ name: 'document_date', type: 'custom' }, { required: true });
        register({ name: 'document_number', type: 'custom' }, { required: true });
        register({ name: 'warehouse_id', type: 'custom' }, { required: true });
        register({ name: 'status', type: 'custom' }, { required: true });
        register({ name: 'comission_chief_id', type: 'custom' }, { required: true });
        register({ name: 'comission_members', type: 'custom' }, { required: true });

        forceUpdate();
    }, []);

    React.useEffect(() => {
        setActionState(createActionState);
    }, [createActionState]);

    React.useEffect(() => {
        setActionState(updateActionState);
    }, [updateActionState]);

    React.useEffect(() => {
        const inventoryData = inventoriesState.data.find((inventoryItem: TInventoryFullData) => inventoryItem.id === queryId);

        if (!(inventoriesState.isLoaded && inventoryData)) {
            return;
        }

        const formData = mapFullDataToFormData(inventoryData);
        const arrayFormData: Record<string, any>[] = [];

        Object.keys(formData).forEach((formDataKey: keyof TFormData) => {
            arrayFormData.push({
                [formDataKey]: formData[formDataKey],
            });
        });
        setValue(arrayFormData);
        setNomenclaturesItems(mapNomenclaturesApiDataToFormData(inventoryData.info));
        setReadOnly(inventoryData.status);
    }, [inventoriesState.isLoaded]);

    const warehousesOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(warehousesState.data), [warehousesState.data]);
    const membersOptions: TDropdownOption[] = React.useMemo((): TDropdownOption[] => mapIdNameToValueLabel(membersState.data), [membersState.data]);

    const shouldShowNextButton = !(storageDataState.isLoading || storageDataState.isLoaded);
    const shouldShowLoader = storageDataState.isLoading;
    const shouldShowNomenclaturesTable = !(shouldShowNextButton || shouldShowLoader);

    return (
        <div className="container">
            <Shape className="inventory__main-shape">
                <IconButton
                    className="inventory__back-button"
                    onClick={handleClickBack}
                    icon="back_arrow"
                />
                <PageTitle className="inventory__title">
                    {t('editInventory.title')}
                </PageTitle>
                <form
                    onSubmit={getSubmitHandler(onSubmit)}
                    className="inventory__form"
                >
                    <Accordion
                        label={t('editInventory.documentData')}
                        className="inventory__accordion"
                    >
                        <div className="accordion-form-content inventory__form">
                            <div className="input-line">
                                <Input
                                    inline
                                    label={t('documentNo')}
                                    placeholder=""
                                    errorMessage={errors.document_number && t('formErrors.id')}
                                    isRequired
                                    name="document_number"
                                    id="inventory-document_number-input"
                                    readOnly={isReadOnly}
                                    value={getValues().document_number}
                                    onChange={(inputValue: string): void => {
                                        setValue('document_number', inputValue);
                                    }}
                                    className="inventory__number-input"
                                />
                                <DateInput
                                    inline
                                    label={t('documentDate')}
                                    placeholder={t('datePlaceholder')}
                                    errorMessage={errors.document_date && t('formErrors.id')}
                                    id="inventory-date-input"
                                    value={getValues().document_date}
                                    onChange={(dateValue: Date): void => {
                                        setValue('document_date', dateValue);
                                        clearError('document_date');
                                    }}
                                    todayLabel={t('today')}
                                    isRequired
                                    locale={ru}
                                    readOnly={isReadOnly}
                                    className="inventory__date-input"
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
                                    className="inventory__warehouse-dropdown"
                                />
                            </div>
                            <div className="input-line">
                                <Dropdown
                                    label={t('comissionChief')}
                                    inline
                                    errorMessage={errors.comission_chief_id && t('formErrors.comission_chief_id')}
                                    isRequired
                                    onSelect={(option: number): void => {
                                        setValue('comission_chief_id', option);
                                        clearError('comission_chief_id');
                                    }}
                                    options={membersOptions}
                                    isLoadingOptions={membersState.isLoading}
                                    isErrorLoadingOptions={membersState.errors.length > 0}
                                    defaultValue={getValues().comission_chief_id}
                                    readOnly={isReadOnly}
                                    className="inventory__members-dropdown"
                                />
                                <Dropdown
                                    label={t('comissionMembers')}
                                    inline
                                    errorMessage={errors.comission_members && t('formErrors.comission_members')}
                                    isRequired
                                    multiSelect
                                    onSelect={(option: number[]): void => {
                                        setValue('comission_members', option);
                                        clearError('comission_members');
                                    }}
                                    options={membersOptions}
                                    isLoadingOptions={membersState.isLoading}
                                    isErrorLoadingOptions={membersState.errors.length > 0}
                                    defaultValue={getValues().comission_members}
                                    readOnly={isReadOnly}
                                    className="inventory__members-dropdown"
                                />
                            </div>
                        </div>
                    </Accordion>
                </form>
                {shouldShowLoader && (
                    <RingLoader
                        width="80px"
                        isCentered
                    />
                )}
                {shouldShowNextButton && (
                    <Button
                        filled
                        className="inventory__next-button"
                        disabled={isReadOnly}
                        onClick={handleClickNext}
                    >
                        {t('next')}
                    </Button>
                )}
                {shouldShowNomenclaturesTable && (
                    <NomenclaturesTable
                        items={[]}
                        onRemoveItem={handleRemoveNomenclatureItem}
                        onChangeItemCount={handleChangeNomenclatureItemCount}
                    />
                )}
                {/* <Button
                    filled
                    className="inventory__save-button"
                    disabled={isReadOnly}
                    type="submit"
                    onClick={handleClickSaveAndProceed}
                >
                    {t('saveAndProceed')}
                </Button>
                <Button
                    filled
                    className="inventory__save-button"
                    disabled={isReadOnly}
                    type="submit"
                >
                    {t('save')}
                </Button> */}
            </Shape>
            <Modal
                isOpen={showActionStateModal}
                onClose={toggleActionStateModal}
                title={t('editInventory.savingTitle')}
                verticalPosition="top"
                withoutCloseButton
            >
                <div className="inventory__modal-content">
                    {actionState.isLoading && (
                        <RingLoader
                            width="80px"
                            isCentered
                        />
                    )}
                    {actionState.isSuccess && (
                        <>
                            <div>{t('editInventory.savingSuccess')}</div>
                            <Button
                                className="inventory__proceed-button"
                                onClick={handleClickSuccessProceed}
                            >
                                {t('proceed')}
                            </Button>
                        </>
                    )}
                    {actionState.errors.length > 0 && (
                        <>
                            <div>{t('editInventory.savingError')}</div>
                            <br />
                            {actionState.errors.map((errorItem: TNetworkError): JSX.Element => <div key={errorItem.message}>{errorItem.message}</div>)}
                            <Button
                                className="inventory__proceed-button"
                                onClick={toggleActionStateModal}
                            >
                                {t('proceed')}
                            </Button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default EditInventoryPage;
