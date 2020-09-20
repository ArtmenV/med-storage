import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TBalanceInvoice, TBalanceInvoiceFullData } from 'types/gists';

export const UPDATE_BALANCE_INVOICE = 'UPDATE_BALANCE_INVOICE';
export const UPDATE_BALANCE_INVOICE_SUCCESS = 'UPDATE_BALANCE_INVOICE_SUCCESS';
export const UPDATE_BALANCE_INVOICE_FAIL = 'UPDATE_BALANCE_INVOICE_FAIL';

export type TUpdateBalanceInvoiceData = Partial<TBalanceInvoice>;

export type TUpdateBalanceInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TUpdateBalanceInvoiceData;
}

const initialState: TUpdateBalanceInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type UpdateBalanceInvoiceAction = TPayloadAction<typeof UPDATE_BALANCE_INVOICE, TUpdateBalanceInvoiceData>

export type UpdateBalanceInvoiceActionSuccess = TPayloadAction<typeof UPDATE_BALANCE_INVOICE_SUCCESS, TBalanceInvoiceFullData>

type UpdateBalanceInvoiceActionFail = TFailedAction<typeof UPDATE_BALANCE_INVOICE_FAIL>

export type TUpdateBalanceInvoiceActionTypes =
    UpdateBalanceInvoiceAction
    | UpdateBalanceInvoiceActionSuccess
    | UpdateBalanceInvoiceActionFail;

export default function updateBalanceInvoiceReducer(
    state = initialState,
    action: TUpdateBalanceInvoiceActionTypes,
): TUpdateBalanceInvoiceState {
    switch (action.type) {
    case UPDATE_BALANCE_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case UPDATE_BALANCE_INVOICE_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case UPDATE_BALANCE_INVOICE_FAIL:
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
