import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TStorageData } from 'types/sales-invoice/storage';

export const FETCH_STORAGE = 'FETCH_STORAGE_RATES';
export const FETCH_STORAGE_SUCCESS = 'FETCH_STORAGE_SUCCESS';
export const FETCH_STORAGE_FAIL = 'FETCH_STORAGE_FAIL';

export type TStorageState = TLoadableState<TStorageData[]>;

const initialState: TStorageState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchStorageAction = TPlainAction<typeof FETCH_STORAGE>

type FetchStorageActionSuccess = TPayloadAction<typeof FETCH_STORAGE_SUCCESS, TStorageData[]>

type FetchStorageActionFail = TFailedAction<typeof FETCH_STORAGE_FAIL>

export type TFetchTaxRatesActionTypes =
    FetchStorageAction
    | FetchStorageActionSuccess
    | FetchStorageActionFail;

export default function financialSourceReducer(
    state = initialState,
    action: TFetchTaxRatesActionTypes,
): TStorageState {
    switch (action.type) {
    case FETCH_STORAGE:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_STORAGE_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_STORAGE_FAIL:
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
