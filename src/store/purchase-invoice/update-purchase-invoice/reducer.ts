import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TPurchaseInvoice, TPurchaseInvoiceFullData } from 'types/gists';

export const UPDATE_PURCHASE_INVOICE = 'UPDATE_PURCHASE_INVOICE';
export const UPDATE_PURCHASE_INVOICE_SUCCESS = 'UPDATE_PURCHASE_INVOICE_SUCCESS';
export const UPDATE_PURCHASE_INVOICE_FAIL = 'UPDATE_PURCHASE_INVOICE_FAIL';

export type TUpdatePurchaseInvoiceData = Partial<TPurchaseInvoice>;

export type TUpdatePurchaseInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TUpdatePurchaseInvoiceData;
}

const initialState: TUpdatePurchaseInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type UpdatePurchaseInvoiceAction = TPayloadAction<typeof UPDATE_PURCHASE_INVOICE, TUpdatePurchaseInvoiceData>

export type UpdatePurchaseInvoiceActionSuccess = TPayloadAction<typeof UPDATE_PURCHASE_INVOICE_SUCCESS, TPurchaseInvoiceFullData>

type UpdatePurchaseInvoiceActionFail = TFailedAction<typeof UPDATE_PURCHASE_INVOICE_FAIL>

export type TUpdatePurchaseInvoiceActionTypes =
    UpdatePurchaseInvoiceAction
    | UpdatePurchaseInvoiceActionSuccess
    | UpdatePurchaseInvoiceActionFail;

export default function updatePurchaseInvoiceReducer(
    state = initialState,
    action: TUpdatePurchaseInvoiceActionTypes,
): TUpdatePurchaseInvoiceState {
    switch (action.type) {
    case UPDATE_PURCHASE_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case UPDATE_PURCHASE_INVOICE_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case UPDATE_PURCHASE_INVOICE_FAIL:
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
