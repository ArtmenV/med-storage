import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TInventory, TInventoryFullData } from 'types/gists';

export const UPDATE_INVENTORY = 'UPDATE_INVENTORY';
export const UPDATE_INVENTORY_SUCCESS = 'UPDATE_INVENTORY_SUCCESS';
export const UPDATE_INVENTORY_FAIL = 'UPDATE_INVENTORY_FAIL';

export type TUpdateInventoryData = Partial<TInventory>;

export type TUpdateInventoryState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TUpdateInventoryData;
}

const initialState: TUpdateInventoryState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type UpdateInventoryAction = TPayloadAction<typeof UPDATE_INVENTORY, TUpdateInventoryData>

export type UpdateInventoryActionSuccess = TPayloadAction<typeof UPDATE_INVENTORY_SUCCESS, TInventoryFullData>

type UpdateInventoryActionFail = TFailedAction<typeof UPDATE_INVENTORY_FAIL>

export type TUpdateInventoryActionTypes =
    UpdateInventoryAction
    | UpdateInventoryActionSuccess
    | UpdateInventoryActionFail;

export default function updateInventoryReducer(
    state = initialState,
    action: TUpdateInventoryActionTypes,
): TUpdateInventoryState {
    switch (action.type) {
    case UPDATE_INVENTORY:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case UPDATE_INVENTORY_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case UPDATE_INVENTORY_FAIL:
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
