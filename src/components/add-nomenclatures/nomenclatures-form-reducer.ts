import { TAddNomenclatureFormData } from 'types/gists';

export const NOMENCLATURE_SUBMIT = 'submit';
export const NOMENCLATURE_ADD = 'add';
export const NOMENCLATURE_DELETE = 'delete';

type TSubmitNomenclatureAction = {
    type: typeof NOMENCLATURE_SUBMIT;
    index: number;
    payload: TAddNomenclatureFormData;
}

type TAddNomenclatureAction = {
    type: typeof NOMENCLATURE_ADD;
    payload?: TAddNomenclatureFormData;
}

type TDeleteNomenclatureAction = {
    type: typeof NOMENCLATURE_DELETE;
    index: number;
}

type TNomenclatureActions = TSubmitNomenclatureAction | TAddNomenclatureAction | TDeleteNomenclatureAction;


export type TNomenclatureFormState = {
    isSubmitted: boolean;
    data?: TAddNomenclatureFormData;
    key: number;
}

export const NewNomenclatureFormItem = (data?: TAddNomenclatureFormData): TNomenclatureFormState => ({
    isSubmitted: false,
    key: Math.random(),
    data,
});


export default function nomenclaturesReducer(state: TNomenclatureFormState[], action: TNomenclatureActions): TNomenclatureFormState[] {
    const resultState = [...state];

    switch (action.type) {
    case NOMENCLATURE_SUBMIT:
        resultState[action.index] = {
            ...resultState[action.index],
            isSubmitted: true,
            data: action.payload,
        };

        return resultState;

    case NOMENCLATURE_DELETE:
        resultState.splice(action.index, 1);

        return resultState;

    case NOMENCLATURE_ADD:
        resultState.push(NewNomenclatureFormItem(action.payload));

        return resultState;

    default:
        throw new Error();
    }
}
