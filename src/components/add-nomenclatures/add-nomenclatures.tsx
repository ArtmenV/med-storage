import * as React from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'medici-ui-kit/components/button';
import useTrigger from 'medici-ui-kit/hooks/use-trigger';

import { TAddNomenclatureFormData } from 'types/gists';

import NomenclatureForm from 'components/nomenclature-form';

import nomenclaturesReducer, {
    TNomenclatureFormState,
    NewNomenclatureFormItem,
    NOMENCLATURE_SUBMIT,
    NOMENCLATURE_ADD,
    NOMENCLATURE_DELETE,
} from './nomenclatures-form-reducer';

export interface AddNomenclaturesProps {
    onSave: (data: TAddNomenclatureFormData[]) => void;
    onClickNewNomenclature: () => void;
    isEditing?: boolean;
    defaultItem?: TAddNomenclatureFormData;
}

const AddNomenclatures: React.FunctionComponent<AddNomenclaturesProps> = ({
    onSave,
    onClickNewNomenclature,
    isEditing,
    defaultItem,
}: AddNomenclaturesProps) => {
    const { t } = useTranslation();
    const [isSubmitTriggered, triggerSubmit] = useTrigger();

    const [nomenclatures, dispatchNomenclatures] = React.useReducer(nomenclaturesReducer, [NewNomenclatureFormItem(defaultItem)]);
    const handleDeletePosition = (positionIndex: number): void => {
        dispatchNomenclatures({ type: NOMENCLATURE_DELETE, index: positionIndex });
    };
    const handleClickSave = (): void => {
        triggerSubmit();
    };
    const handleClickAdd = (): void => {
        dispatchNomenclatures({ type: NOMENCLATURE_ADD });
    };
    const handleSuccessSubmitNomenclature = (index: number, formData: TAddNomenclatureFormData): void => {
        dispatchNomenclatures({
            type: NOMENCLATURE_SUBMIT,
            index,
            payload: formData,
        });
    };

    React.useEffect(() => {
        const isAllNomenclaturesValid = (nomenclatures.length > 0)
            && !nomenclatures.find((nomenclatureFormItem: TNomenclatureFormState) => nomenclatureFormItem.isSubmitted === false);

        if (isAllNomenclaturesValid) {
            onSave(nomenclatures.map((nomenclatureFormItem: TNomenclatureFormState) => (nomenclatureFormItem.data as TAddNomenclatureFormData)));
        }
    }, [nomenclatures]);

    return (
        <div className="add-nomenclatures">
            {nomenclatures.map((nomenclatureFormItem: TNomenclatureFormState, nomenclatureFormIndex: number) => (
                <NomenclatureForm
                    onDelete={handleDeletePosition}
                    htmlId="nomenclature-form"
                    index={nomenclatureFormIndex}
                    isSubmitTriggered={isSubmitTriggered}
                    onSuccessSubmit={handleSuccessSubmitNomenclature}
                    key={nomenclatureFormItem.key}
                    showDeleteButton={!isEditing}
                    defaultValues={nomenclatures[nomenclatureFormIndex].data}
                />
            ))}
            <div className="add-nomenclatures__controls">
                <Button
                    onClick={handleClickSave}
                    inline
                    className="add-nomenclatures__controls-button"
                >
                    {t('save')}
                </Button>
                {!isEditing && (
                    <Button
                        inline
                        onClick={handleClickAdd}
                        className="add-nomenclatures__controls-button"
                    >
                        {t('add')}
                    </Button>
                )}
                <Button
                    inline
                    onClick={onClickNewNomenclature}
                >
                    {t('newNomenclature')}
                </Button>
            </div>
        </div>
    );
};

export default AddNomenclatures;
