import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TInventoryFullData } from 'types/gists';

import {
    DELETE_INVENTORY_SUCCESS,
    DeleteInventoryActionSuccess,
} from 'store/inventory/delete-inventory/reducer';

import {
    UPDATE_INVENTORY_SUCCESS,
    UpdateInventoryActionSuccess,
} from 'store/inventory/update-inventory/reducer';

export const FETCH_INVENTORIES = 'FETCH_INVENTORIES';
export const FETCH_INVENTORIES_SUCCESS = 'FETCH_INVENTORIES_SUCCESS';
export const FETCH_INVENTORIES_FAIL = 'FETCH_INVENTORIES_FAIL';

export type TInventoryssState = TLoadableState<TInventoryFullData[]>;

const initialState: TInventoryssState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchInventorysAction = TPlainAction<typeof FETCH_INVENTORIES>

type FetchInventorysActionSuccess = TPayloadAction<typeof FETCH_INVENTORIES_SUCCESS, TInventoryFullData[]>

type FetchInventorysActionFail = TFailedAction<typeof FETCH_INVENTORIES_FAIL>

export type TFetchInventoriesActionTypes =
    FetchInventorysAction
    | FetchInventorysActionSuccess
    | FetchInventorysActionFail
    | DeleteInventoryActionSuccess
    | UpdateInventoryActionSuccess;

export default function InventoriesReducer(
    state = initialState,
    action: TFetchInventoriesActionTypes,
): TInventoryssState {
    let newData = [];
    let index: number;

    switch (action.type) {
    case FETCH_INVENTORIES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_INVENTORIES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_INVENTORIES_FAIL:
        return {
            isLoading: false,
            isLoaded: false,
            data: [],
            errors: action.errors,
        };

    case DELETE_INVENTORY_SUCCESS:
        newData = state.data.filter((dataItem) => dataItem.id !== action.payload);

        return {
            ...state,
            data: newData,
        };

    case UPDATE_INVENTORY_SUCCESS:
        newData = [...state.data];
        index = newData.findIndex((dataItem) => dataItem.id === action.payload.id);

        if (index >= 0) {
            newData[index] = action.payload;
        }

        return {
            ...state,
            data: newData,
        };
    default:
        return state;
    }
}
