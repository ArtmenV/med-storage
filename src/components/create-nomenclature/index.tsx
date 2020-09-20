import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Input from 'medici-ui-kit/components/input';
import Button from 'medici-ui-kit/components/button';
import RemoteDropdown from 'medici-ui-kit/components/remote-dropdown';
import RingLoader from 'medici-ui-kit/components/ring-loader';

import useForceUpdate from 'medici-ui-kit/hooks/use-force-update';

import {
    fetchDosageForms,
    fetchDosages,
    fetchPackings,
    fetchPackagings,
    fetchCountries,
    fetchManufacturers,
    fetchMeasurementUnits,
    fetchTaxRates,
    fetchMedicationTypes,
    fetchTradeNames,
    fetchInternationalNames,
} from 'api/dictionaries';

import { TRootState } from 'store/root-reducer';
import createNomenclature from 'store/nomenclature-card/create-nomenclature-card/action';
import { TCreateNomenclatureData } from 'store/nomenclature-card/create-nomenclature-card/reducer';

import './styles.less';

type FormData = TCreateNomenclatureData;

export interface CreateNomenclatureProps {
    onClose: () => void;
}

const CreateNomenclature: React.FC<CreateNomenclatureProps> = ({
    onClose,
}: CreateNomenclatureProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [forceUpdate] = useForceUpdate();
    const actionState = useSelector((state: TRootState) => state.actions.createNomenclature);
    const [isFormHidden, setFormHidden] = React.useState(false);
    const {
        register,
        handleSubmit,
        errors,
        setValue,
        clearError,
        getValues,
    } = useForm<FormData>({
        defaultValues: actionState.data,
    });
    const handleTryAgain = (): void => {
        setFormHidden(false);
    };
    const onSubmit = (data: FormData): void => {
        setFormHidden(true);
        dispatch(createNomenclature({
            ...data,
            coefficient: '1', // TODO remove hardcode
            gtin: '123', // TODO remove hardcode
            barcode: '10010111101', // TODO remove hardcode
        }));
    };

    React.useEffect(() => {
        register({ name: 'trade_name_id', type: 'custom' }, { required: true });
        register({ name: 'international_name_id', type: 'custom' }, { required: true });
        register({ name: 'dosage_form_id', type: 'custom' }, { required: true });
        register({ name: 'dosage_id', type: 'custom' }, { required: true });
        register({ name: 'packing_id', type: 'custom' }, { required: true });
        register({ name: 'packaging_id', type: 'custom' }, { required: true });
        register({ name: 'country_id', type: 'custom' }, { required: true });
        register({ name: 'manufacturer_id', type: 'custom' }, { required: true });
        register({ name: 'measurement_unit_id', type: 'custom' }, { required: true });
        register({ name: 'tax_rate_id', type: 'custom' }, { required: true });
        register({ name: 'medication_type_id', type: 'custom' }, { required: true });

        forceUpdate();
    }, []);

    return (
        <>
            {actionState.isLoading && (
                <div className="create-nom__service-window">
                    <RingLoader
                        width="80px"
                        isCentered
                    />
                </div>
            )}
            {isFormHidden && actionState.isSuccess && (
                <div className="create-nom__service-window">
                    <p className="create-nom__service-message">
                        {t('createNomenclature.createSuccess')}
                    </p>
                    <Button
                        onClick={onClose}
                        className="create-nom__proceed-button"
                    >
                        {t('proceed')}
                    </Button>
                </div>
            )}
            {isFormHidden && actionState.errors.length > 0 && (
                <div className="create-nom__service-window">
                    <p className="create-nom__service-message">
                        {t('createNomenclature.createError')}
                        <br />
                        {actionState.errors[0].message}
                    </p>
                    <div className="create-nom__service-btn-wrapper">
                        <Button
                            onClick={handleTryAgain}
                            className="create-nom__proceed-button"
                        >
                            {t('tryAgain')}
                        </Button>
                        <Button
                            onClick={onClose}
                            className="create-nom__proceed-button"
                        >
                            {t('cancel')}
                        </Button>
                    </div>
                </div>
            )}
            {!isFormHidden && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="create-nom__input-line input-line">
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.name')}
                            isRequired
                            id="create-nomenclature-trade_name_id-dropdown"
                            errorMessage={errors.trade_name_id && t('formErrors.require')}
                            defaultValue={getValues().trade_name_id}
                            onSelect={(option: string): void => {
                                setValue('trade_name_id', option);
                                clearError('trade_name_id');
                            }}
                            fetchOptions={fetchTradeNames}
                            className="create-nom__form-field"
                        />
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.internationalName')}
                            isRequired
                            id="create-nomenclature-international_name_id-dropdown"
                            errorMessage={errors.international_name_id && t('formErrors.require')}
                            defaultValue={getValues().international_name_id}
                            onSelect={(option: string): void => {
                                setValue('international_name_id', option);
                                clearError('international_name_id');
                            }}
                            fetchOptions={fetchInternationalNames}
                            className="create-nom__form-field"
                        />
                        <Input
                            label={t('createNomenclature.latinName')}
                            errorMessage={errors.latin_name && t('formErrors.require')}
                            isRequired
                            name="latin_name"
                            inputRef={register({ required: true })}
                            id="create-nomenclature-latin_name-input"
                            inline
                            className="create-nom__form-field"
                        />
                    </div>
                    <div className="create-nom__input-line input-line">
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.dosageForm')}
                            errorMessage={errors.dosage_form_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-dosage_form_id-dropdown"
                            defaultValue={getValues().dosage_form_id}
                            onSelect={(option: string): void => {
                                setValue('dosage_form_id', option);
                                clearError('dosage_form_id');
                            }}
                            fetchOptions={fetchDosageForms}
                            className="create-nom__form-field"
                        />
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.dosage')}
                            errorMessage={errors.dosage_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-dosage_id-dropdown"
                            defaultValue={getValues().dosage_id}
                            onSelect={(option: string): void => {
                                setValue('dosage_id', option);
                                clearError('dosage_id');
                            }}
                            fetchOptions={fetchDosages}
                            className="create-nom__form-field"
                        />
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.packing')}
                            errorMessage={errors.packing_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-packing_id-dropdown"
                            defaultValue={getValues().packing_id}
                            onSelect={(option: string): void => {
                                setValue('packing_id', option);
                                clearError('packing_id');
                            }}
                            fetchOptions={fetchPackings}
                            className="create-nom__form-field"
                        />
                    </div>
                    <div className="create-nom__input-line input-line">
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.packaging')}
                            errorMessage={errors.packaging_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-packaging_id-dropdown"
                            defaultValue={getValues().packaging_id}
                            onSelect={(option: string): void => {
                                setValue('packaging_id', option);
                                clearError('packaging_id');
                            }}
                            fetchOptions={fetchPackagings}
                            className="create-nom__form-field"
                        />
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.country')}
                            errorMessage={errors.country_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-country_id-dropdown"
                            defaultValue={getValues().country_id}
                            onSelect={(option: string): void => {
                                setValue('country_id', option);
                                clearError('country_id');
                            }}
                            fetchOptions={fetchCountries}
                            className="create-nom__form-field"
                        />
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.manufacturer')}
                            errorMessage={errors.manufacturer_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-manufacturer_id-dropdown"
                            defaultValue={getValues().manufacturer_id}
                            onSelect={(option: string): void => {
                                setValue('manufacturer_id', option);
                                clearError('manufacturer_id');
                            }}
                            fetchOptions={fetchManufacturers}
                            className="create-nom__form-field"
                        />
                    </div>
                    <div className="create-nom__input-line">
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.unit')}
                            errorMessage={errors.measurement_unit_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-measurement_unit_id-dropdown"
                            defaultValue={getValues().measurement_unit_id}
                            onSelect={(option: string): void => {
                                setValue('measurement_unit_id', option);
                                clearError('measurement_unit_id');
                            }}
                            fetchOptions={fetchMeasurementUnits}
                            className="create-nom__form-field"
                        />
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.nds')}
                            errorMessage={errors.tax_rate_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-tax_rate_id-dropdown"
                            defaultValue={getValues().tax_rate_id}
                            onSelect={(option: string): void => {
                                setValue('tax_rate_id', option);
                                clearError('tax_rate_id');
                            }}
                            fetchOptions={fetchTaxRates}
                            className="create-nom__form-field"
                        />
                        <RemoteDropdown
                            inline
                            label={t('createNomenclature.type')}
                            errorMessage={errors.medication_type_id && t('formErrors.require')}
                            isRequired
                            id="create-nomenclature-medication_type_id-dropdown"
                            defaultValue={getValues().medication_type_id}
                            onSelect={(option: string): void => {
                                setValue('medication_type_id', option);
                                clearError('medication_type_id');
                            }}
                            fetchOptions={fetchMedicationTypes}
                            className="create-nom__form-field"
                        />
                    </div>
                    <Button
                        filled
                        type="submit"
                        onClick={(): void => undefined}
                        className="epi__save-button"
                    >
                        {t('save')}
                    </Button>
                </form>
            )}
        </>
    );
};

export default CreateNomenclature;
