import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TTaxRate } from 'types/gists';

export const FETCH_STORE_REASONS = 'FETCH_STORE_REASONS';
export const FETCH_STORE_REASONS_SUCCESS = 'FETCH_STORE_REASONS_SUCCESS';
export const FETCH_STORE_REASONS_FAIL = 'FETCH_STORE_REASONS_FAIL';

export type TStoreReasonsState = TLoadableState<TTaxRate[]>;

const initialState: TStoreReasonsState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchStoreReasonsAction = TPlainAction<typeof FETCH_STORE_REASONS>

type FetchStoreReasonsActionSuccess = TPayloadAction<typeof FETCH_STORE_REASONS_SUCCESS, TTaxRate[]>

type FetchStoreReasonsActionFail = TFailedAction<typeof FETCH_STORE_REASONS_FAIL>

export type TFetchStoreReasonsActionTypes =
    FetchStoreReasonsAction
    | FetchStoreReasonsActionSuccess
    | FetchStoreReasonsActionFail;

export default function storeReasonsReducer(
    state = initialState,
    action: TFetchStoreReasonsActionTypes,
): TStoreReasonsState {
    switch (action.type) {
    case FETCH_STORE_REASONS:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_STORE_REASONS_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_STORE_REASONS_FAIL:
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
