import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TTaxRate } from 'types/gists';

export const FETCH_WAREHOUSES = 'FETCH_WAREHOUSES';
export const FETCH_WAREHOUSES_SUCCESS = 'FETCH_WAREHOUSES_SUCCESS';
export const FETCH_WAREHOUSES_FAIL = 'FETCH_WAREHOUSES_FAIL';

export type TWarehousesState = TLoadableState<TTaxRate[]>;

const initialState: TWarehousesState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchWarehousesAction = TPlainAction<typeof FETCH_WAREHOUSES>

type FetchWarehousesActionSuccess = TPayloadAction<typeof FETCH_WAREHOUSES_SUCCESS, TTaxRate[]>

type FetchWarehousesActionFail = TFailedAction<typeof FETCH_WAREHOUSES_FAIL>

export type TFetchWarehousesActionTypes =
    FetchWarehousesAction
    | FetchWarehousesActionSuccess
    | FetchWarehousesActionFail;

export default function warehousesReducer(
    state = initialState,
    action: TFetchWarehousesActionTypes,
): TWarehousesState {
    switch (action.type) {
    case FETCH_WAREHOUSES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_WAREHOUSES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_WAREHOUSES_FAIL:
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
