import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TNomenclature, TNomenclatureFullData } from 'types/gists';

export const CREATE_NOMENCLATURE = 'CREATE_NOMENCLATURE';
export const CREATE_NOMENCLATURE_SUCCESS = 'CREATE_NOMENCLATURE_SUCCESS';
export const CREATE_NOMENCLATURE_FAIL = 'CREATE_NOMENCLATURE_FAIL';

export type TCreateNomenclatureData = Omit<TNomenclature, 'id'>;

export type TCreateNomenclatureState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TCreateNomenclatureData;
}

const initialState: TCreateNomenclatureState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type CreateNomenclatureAction = TPayloadAction<typeof CREATE_NOMENCLATURE, TCreateNomenclatureData>

export type CreateNomenclatureActionSuccess = TPayloadAction<typeof CREATE_NOMENCLATURE_SUCCESS, TNomenclatureFullData>

type CreateNomenclatureActionFail = TFailedAction<typeof CREATE_NOMENCLATURE_FAIL>

export type TCreateNomenclatureActionTypes =
    CreateNomenclatureAction
    | CreateNomenclatureActionSuccess
    | CreateNomenclatureActionFail;

export default function createNomenclatureCardReducer(
    state = initialState,
    action: TCreateNomenclatureActionTypes,
): TCreateNomenclatureState {
    switch (action.type) {
    case CREATE_NOMENCLATURE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case CREATE_NOMENCLATURE_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case CREATE_NOMENCLATURE_FAIL:
        return {
            ...state,
            isLoading: false,
            isSuccess: false,
            errors: action.errors,
        };

    default:
        return state;
    }
}
