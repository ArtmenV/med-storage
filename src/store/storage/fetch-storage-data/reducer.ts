import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TStorageNomenclature } from 'types/gists';

export const FETCH_STORAGE_DATA = 'FETCH_STORAGE_DATA';
export const FETCH_STORAGE_DATA_SUCCESS = 'FETCH_STORAGE_DATA_SUCCESS';
export const FETCH_STORAGE_DATA_FAIL = 'FETCH_STORAGE_DATA_FAIL';

export type TStorageDataState = TLoadableState<TStorageNomenclature[]>;

const initialState: TStorageDataState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchStorageDataAction = TPlainAction<typeof FETCH_STORAGE_DATA>

type FetchStorageDataActionSuccess = TPayloadAction<typeof FETCH_STORAGE_DATA_SUCCESS, TStorageNomenclature[]>

type FetchStorageDataActionFail = TFailedAction<typeof FETCH_STORAGE_DATA_FAIL>

export type TFetchStorageDataActionTypes =
    FetchStorageDataAction
    | FetchStorageDataActionSuccess
    | FetchStorageDataActionFail;

export default function storageDataReducer(
    state = initialState,
    action: TFetchStorageDataActionTypes,
): TStorageDataState {
    switch (action.type) {
    case FETCH_STORAGE_DATA:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_STORAGE_DATA_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_STORAGE_DATA_FAIL:
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
