import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TInventory } from 'types/gists';

export const CREATE_INVENTORY = 'CREATE_INVENTORY';
export const CREATE_INVENTORY_SUCCESS = 'CREATE_INVENTORY_SUCCESS';
export const CREATE_INVENTORY_FAIL = 'CREATE_INVENTORY_FAIL';

export type TCreateInventoryData = Omit<TInventory, 'id'>;

export type TCreateInventoryState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TCreateInventoryData;
}

const initialState: TCreateInventoryState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type CreateInventoryAction = TPayloadAction<typeof CREATE_INVENTORY, TCreateInventoryData>

type CreateInventoryActionSuccess = TPlainAction<typeof CREATE_INVENTORY_SUCCESS>

type CreateInventoryActionFail = TFailedAction<typeof CREATE_INVENTORY_FAIL>

export type TCreateInventoryActionTypes =
    CreateInventoryAction
    | CreateInventoryActionSuccess
    | CreateInventoryActionFail;

export default function createInventoryReducer(
    state = initialState,
    action: TCreateInventoryActionTypes,
): TCreateInventoryState {
    switch (action.type) {
    case CREATE_INVENTORY:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case CREATE_INVENTORY_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case CREATE_INVENTORY_FAIL:
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
