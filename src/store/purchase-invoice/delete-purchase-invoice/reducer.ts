import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

export const DELETE_PURCHASE_INVOICE = 'DELETE_PURCHASE_INVOICE';
export const DELETE_PURCHASE_INVOICE_SUCCESS = 'DELETE_PURCHASE_INVOICE_SUCCESS';
export const DELETE_PURCHASE_INVOICE_FAIL = 'DELETE_PURCHASE_INVOICE_FAIL';

export type TDeletePurchaseInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    id?: number;
}

const initialState: TDeletePurchaseInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    id: undefined,
};

type DeletePurchaseInvoiceAction = TPayloadAction<typeof DELETE_PURCHASE_INVOICE, number>

export type DeletePurchaseInvoiceActionSuccess = TPayloadAction<typeof DELETE_PURCHASE_INVOICE_SUCCESS, number>

type DeletePurchaseInvoiceActionFail = TFailedAction<typeof DELETE_PURCHASE_INVOICE_FAIL>

export type TDeletePurchaseInvoiceActionTypes =
    DeletePurchaseInvoiceAction
    | DeletePurchaseInvoiceActionSuccess
    | DeletePurchaseInvoiceActionFail;

export default function deletePurchaseInvoiceReducer(
    state = initialState,
    action: TDeletePurchaseInvoiceActionTypes,
): TDeletePurchaseInvoiceState {
    switch (action.type) {
    case DELETE_PURCHASE_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            id: action.payload,
        };

    case DELETE_PURCHASE_INVOICE_SUCCESS:
        return {
            ...state,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case DELETE_PURCHASE_INVOICE_FAIL:
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
