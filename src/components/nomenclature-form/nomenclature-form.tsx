import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ru from 'date-fns/locale/ru';

import Dropdown from 'medici-ui-kit/components/dropdown';
import Input from 'medici-ui-kit/components/input';
import Shape from 'medici-ui-kit/components/shape';
import Accordion from 'medici-ui-kit/components/accordion';
import DateInput from 'medici-ui-kit/components/date-input';
import IconButton from 'medici-ui-kit/components/icon-button';

import ICONS from 'medici-ui-kit/assets/icons';

import { TValueLabelRecord, ValidatorNames } from 'medici-ui-kit/types/data-types';

import useForceUpdate from 'medici-ui-kit/hooks/use-force-update';

import isNumber from 'medici-ui-kit/utils/is-number';
import isPositiveNumber from 'medici-ui-kit/utils/is-positive-number';

import useErrorMessages from 'hooks/use-error-messages';
import useNomenclatureCardsState from 'store/nomenclature-card/fetch-nomenclature-cards/use-nomenclature-cards-state';

import { TAddNomenclatureFormData } from 'types/gists';


type NomenclatureFormProps = {
    htmlId?: string;
    onDelete: (index: number) => void;
    index: number;
    isSubmitTriggered: boolean;
    onSuccessSubmit: (index: number, formData: TAddNomenclatureFormData) => void;
    showDeleteButton?: boolean;
    defaultValues?: TAddNomenclatureFormData;
}

const NomenclatureForm: React.FunctionComponent<NomenclatureFormProps> = ({
    htmlId,
    onDelete,
    index,
    isSubmitTriggered,
    onSuccessSubmit,
    showDeleteButton = true,
    defaultValues,
}: NomenclatureFormProps) => {
    const getErrorMessage = useErrorMessages();
    const {
        register,
        handleSubmit,
        errors,
        setValue,
        clearError,
        getValues,
    } = useForm<TAddNomenclatureFormData>({
        defaultValues,
    });
    const [forceUpdate] = useForceUpdate();
    const { t } = useTranslation();
    const nomenclatureCardsState = useNomenclatureCardsState();

    const handleClickDeleteButton = (): void => {
        onDelete(index);
    };

    const handleChangeNumberOfUnits = React.useCallback((value: string): void => {
        setValue('numberOfUnits', value);
        const numValue = Number(value);
        const numPriceValue = Number(getValues().unitPriceWithTaxes);

        if (isNumber(numValue) && isNumber(numPriceValue)) {
            setValue('amountWithTax', `${numPriceValue * numValue}`);
            forceUpdate();
        }
    }, [getValues().unitPriceWithTaxes]);

    const handleChangeUnitPriceWithTaxes = React.useCallback((value: string): void => {
        setValue('unitPriceWithTaxes', value);
        const numValue = Number(value);
        const numNumberOfUnitsValue = Number(getValues().numberOfUnits);

        if (isNumber(numValue) && isNumber(numNumberOfUnitsValue)) {
            setValue('amountWithTax', `${numNumberOfUnitsValue * numValue}`);
            forceUpdate();
        }
    }, [getValues().numberOfUnits]);

    const handleChangeNumberOfPieces = React.useCallback((value: string): void => {
        setValue('quantity', value);
    }, []);

    const handleChangeAmountWithTax = React.useCallback((value: string): void => {
        setValue('amountWithTax', value);
    }, []);

    const nomenclatureOptions = React.useMemo((): TValueLabelRecord[] => (
        nomenclatureCardsState.data.map(
            (nomenclatureItem) => ({
                value: `${nomenclatureItem.id}`,
                label: nomenclatureItem.trade_name.name,
            }),
        )
    ), [nomenclatureCardsState.data]);

    React.useEffect(() => {
        register({ name: 'item_card_id', type: 'custom' }, { required: true });
        register({ name: 'expirationDate', type: 'custom' }, { required: true });
        register({ name: 'numberOfUnits', type: 'custom' }, {
            required: true,
            validate: {
                [ValidatorNames.positiveNumber]: isPositiveNumber,
            },
        });
        register({ name: 'unitPriceWithTaxes', type: 'custom' }, {
            required: true,
            validate: {
                [ValidatorNames.positiveNumber]: isPositiveNumber,
            },
        });
        register({ name: 'quantity', type: 'custom' }, {
            required: true,
            validate: {
                [ValidatorNames.positiveNumber]: isPositiveNumber,
            },
        });
        register({ name: 'amountWithTax', type: 'custom' }, {
            required: true,
            validate: {
                [ValidatorNames.positiveNumber]: isPositiveNumber,
            },
        });

        forceUpdate();
    }, []);

    React.useEffect(() => {
        if (isSubmitTriggered) {
            handleSubmit((formData: TAddNomenclatureFormData) => {
                onSuccessSubmit(index, formData);
            })();
        }
    }, [isSubmitTriggered]);

    return (
        <Shape className="nomenclature-form">
            <Accordion
                className="nomenclature-form__accordion"
                endFixedButton
                label={(
                    <div>
                        <Dropdown
                            className="nomenclature-form__name-dropdown"
                            inline
                            errorMessage={errors.item_card_id && t('formErrors.require')}
                            isRequired
                            id={`${htmlId}-name-dropdown`}
                            onSelect={(option: string): void => {
                                setValue('item_card_id', option);
                                clearError('item_card_id');
                            }}
                            isLoadingOptions={nomenclatureCardsState.isLoading}
                            options={nomenclatureOptions}
                            isErrorLoadingOptions={nomenclatureCardsState.errors.length > 0}
                            defaultValue={getValues().item_card_id}
                        />
                        {React.createElement(ICONS.check, {
                            className: 'nomenclature-form__valid-icon',
                            viewBox: '0 0 12 12',
                        })}
                        {showDeleteButton && (
                            <IconButton
                                icon="thrash_can"
                                onClick={handleClickDeleteButton}
                                className="nomenclature-form__delete-button"
                            />
                        )}
                    </div>
                )}
            >
                <div className="nomenclature-form__input-line input-line">
                    <Input
                        inline
                        label={t('numberOfUnits')}
                        placeholder={t('inputPlaceholder')}
                        isRequired
                        errorMessage={getErrorMessage(errors.numberOfUnits)}
                        value={getValues().numberOfUnits}
                        onChange={handleChangeNumberOfUnits}
                        id={`${htmlId}-number-of-units-input`}
                        className="nomenclature-form__field"
                    />
                    <Input
                        inline
                        label={t('numberOfPieces')}
                        placeholder={t('inputPlaceholder')}
                        isRequired
                        errorMessage={getErrorMessage(errors.quantity)}
                        value={getValues().quantity}
                        onChange={handleChangeNumberOfPieces}
                        id={`${htmlId}-quantity-input`}
                        className="nomenclature-form__field"
                    />
                    <Input
                        inline
                        label={t('unitPriceWithTaxes')}
                        placeholder={t('inputPlaceholder')}
                        isRequired
                        errorMessage={getErrorMessage(errors.unitPriceWithTaxes)}
                        value={getValues().unitPriceWithTaxes}
                        onChange={handleChangeUnitPriceWithTaxes}
                        id={`${htmlId}-unit-price-with-taxes-input`}
                        className="nomenclature-form__field"
                    />
                </div>
                <div className="nomenclature-form__input-line">
                    <Input
                        inline
                        label={t('series')}
                        placeholder={t('inputPlaceholder')}
                        errorMessage={errors.series && t('formErrors.require')}
                        isRequired
                        name="series"
                        inputRef={register({ required: true })}
                        id={`${htmlId}-series-input`}
                        className="nomenclature-form__field"
                    />
                    <DateInput
                        inline
                        label={t('expirationDate')}
                        placeholder={t('datePlaceholder')}
                        errorMessage={errors.expirationDate && t('formErrors.require')}
                        id={`${htmlId}-expiration-date-input`}
                        value={getValues().expirationDate}
                        onChange={(dateValue: Date): void => {
                            setValue('expirationDate', dateValue);
                            clearError('expirationDate');
                        }}
                        locale={ru}
                        className="nomenclature-form__field"
                    />
                    <Input
                        inline
                        label={t('amountWithTax')}
                        placeholder={t('inputPlaceholder')}
                        isRequired
                        errorMessage={getErrorMessage(errors.amountWithTax)}
                        value={getValues().amountWithTax}
                        onChange={handleChangeAmountWithTax}
                        id={`${htmlId}-amount-with-tax-input`}
                        className="nomenclature-form__field"
                    />
                </div>
            </Accordion>
        </Shape>
    );
};

export default NomenclatureForm;
