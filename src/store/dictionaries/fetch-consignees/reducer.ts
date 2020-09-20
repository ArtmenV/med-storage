import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TTaxRate } from 'types/gists';

export const FETCH_CONSIGNEES = 'FETCH_CONSIGNEES';
export const FETCH_CONSIGNEES_SUCCESS = 'FETCH_CONSIGNEES_SUCCESS';
export const FETCH_CONSIGNEES_FAIL = 'FETCH_CONSIGNEES_FAIL';

export type TConsigneesState = TLoadableState<TTaxRate[]>;

const initialState: TConsigneesState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchConsigneesAction = TPlainAction<typeof FETCH_CONSIGNEES>

type FetchConsigneesActionSuccess = TPayloadAction<typeof FETCH_CONSIGNEES_SUCCESS, TTaxRate[]>

type FetchConsigneesActionFail = TFailedAction<typeof FETCH_CONSIGNEES_FAIL>

export type TFetchConsigneesActionTypes =
    FetchConsigneesAction
    | FetchConsigneesActionSuccess
    | FetchConsigneesActionFail;

export default function consigneesReducer(
    state = initialState,
    action: TFetchConsigneesActionTypes,
): TConsigneesState {
    switch (action.type) {
    case FETCH_CONSIGNEES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_CONSIGNEES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_CONSIGNEES_FAIL:
        return {
            isLoading: false,
            isLoaded: false,
            data: [],
            errors: action.errors,
        };

    default:
        return state;
    }
}
