import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TPurchaseInvoice } from 'types/gists';

export const CREATE_PURCHASE_INVOICE = 'CREATE_PURCHASE_INVOICE';
export const CREATE_PURCHASE_INVOICE_SUCCESS = 'CREATE_PURCHASE_INVOICE_SUCCESS';
export const CREATE_PURCHASE_INVOICE_FAIL = 'CREATE_PURCHASE_INVOICE_FAIL';

export type TCreatePurchaseInvoiceData = Omit<TPurchaseInvoice, 'id'>;

export type TCreatePurchaseInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TCreatePurchaseInvoiceData;
}

const initialState: TCreatePurchaseInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type CreatePurchaseInvoiceAction = TPayloadAction<typeof CREATE_PURCHASE_INVOICE, TCreatePurchaseInvoiceData>

type CreatePurchaseInvoiceActionSuccess = TPlainAction<typeof CREATE_PURCHASE_INVOICE_SUCCESS>

type CreatePurchaseInvoiceActionFail = TFailedAction<typeof CREATE_PURCHASE_INVOICE_FAIL>

export type TCreatePurchaseInvoiceActionTypes =
    CreatePurchaseInvoiceAction
    | CreatePurchaseInvoiceActionSuccess
    | CreatePurchaseInvoiceActionFail;

export default function createPurchaseInvoiceReducer(
    state = initialState,
    action: TCreatePurchaseInvoiceActionTypes,
): TCreatePurchaseInvoiceState {
    switch (action.type) {
    case CREATE_PURCHASE_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case CREATE_PURCHASE_INVOICE_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case CREATE_PURCHASE_INVOICE_FAIL:
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
