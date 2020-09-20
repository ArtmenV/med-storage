import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

export const DELETE_INVENTORY = 'DELETE_INVENTORY';
export const DELETE_INVENTORY_SUCCESS = 'DELETE_INVENTORY_SUCCESS';
export const DELETE_INVENTORY_FAIL = 'DELETE_INVENTORY_FAIL';

export type TDeleteInventoryState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    id?: number;
}

const initialState: TDeleteInventoryState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    id: undefined,
};

type DeleteInventoryAction = TPayloadAction<typeof DELETE_INVENTORY, number>

export type DeleteInventoryActionSuccess = TPayloadAction<typeof DELETE_INVENTORY_SUCCESS, number>

type DeleteInventoryActionFail = TFailedAction<typeof DELETE_INVENTORY_FAIL>

export type TDeleteInventoryActionTypes =
    DeleteInventoryAction
    | DeleteInventoryActionSuccess
    | DeleteInventoryActionFail;

export default function deleteInventoryReducer(
    state = initialState,
    action: TDeleteInventoryActionTypes,
): TDeleteInventoryState {
    switch (action.type) {
    case DELETE_INVENTORY:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            id: action.payload,
        };

    case DELETE_INVENTORY_SUCCESS:
        return {
            ...state,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case DELETE_INVENTORY_FAIL:
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
