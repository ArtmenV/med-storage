import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TNomenclatureFullData } from 'types/gists';

import {
    CREATE_NOMENCLATURE_SUCCESS,
    CreateNomenclatureActionSuccess,
} from 'store/nomenclature-card/create-nomenclature-card/reducer';

export const FETCH_NOMENCLATURE_CARDS = 'FETCH_NOMENCLATURE_CARDS';
export const FETCH_NOMENCLATURE_CARDS_SUCCESS = 'FETCH_NOMENCLATURE_CARDS_SUCCESS';
export const FETCH_NOMENCLATURE_CARDS_FAIL = 'FETCH_NOMENCLATURE_CARDS_FAIL';

export type TNomenclatureCardsState = TLoadableState<TNomenclatureFullData[]>;

const initialState: TNomenclatureCardsState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchNomenclatureCardsAction = TPlainAction<typeof FETCH_NOMENCLATURE_CARDS>

type FetchNomenclatureCardsActionSuccess = TPayloadAction<typeof FETCH_NOMENCLATURE_CARDS_SUCCESS, TNomenclatureFullData[]>

type FetchNomenclatureCardsActionFail = TFailedAction<typeof FETCH_NOMENCLATURE_CARDS_FAIL>

export type TFetchNomenclatureCardsActionTypes =
    FetchNomenclatureCardsAction
    | FetchNomenclatureCardsActionSuccess
    | FetchNomenclatureCardsActionFail
    | CreateNomenclatureActionSuccess;

export default function nomenclatureCardReducer(
    state = initialState,
    action: TFetchNomenclatureCardsActionTypes,
): TNomenclatureCardsState {
    switch (action.type) {
    case FETCH_NOMENCLATURE_CARDS:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_NOMENCLATURE_CARDS_SUCCESS:
        return {
            isLoading: false,
            data: action.payload,
            isLoaded: true,
            errors: [],
        };

    case FETCH_NOMENCLATURE_CARDS_FAIL:
        return {
            isLoading: false,
            isLoaded: false,
            data: [],
            errors: action.errors,
        };

    case CREATE_NOMENCLATURE_SUCCESS:
        return {
            ...state,
            data: [...state.data, action.payload],
        };

    default:
        return state;
    }
}
