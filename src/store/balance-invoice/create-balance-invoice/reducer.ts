import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TBalanceInvoice } from 'types/gists';

export const CREATE_BALANCE_INVOICE = 'CREATE_BALANCE_INVOICE';
export const CREATE_BALANCE_INVOICE_SUCCESS = 'CREATE_BALANCE_INVOICE_SUCCESS';
export const CREATE_BALANCE_INVOICE_FAIL = 'CREATE_BALANCE_INVOICE_FAIL';

export type TCreateBalanceInvoiceData = Omit<TBalanceInvoice, 'id'>;

export type TCreateBalanceInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TCreateBalanceInvoiceData;
}

const initialState: TCreateBalanceInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type CreateBalanceInvoiceAction = TPayloadAction<typeof CREATE_BALANCE_INVOICE, TCreateBalanceInvoiceData>

type CreateBalanceInvoiceActionSuccess = TPlainAction<typeof CREATE_BALANCE_INVOICE_SUCCESS>

type CreateBalanceInvoiceActionFail = TFailedAction<typeof CREATE_BALANCE_INVOICE_FAIL>

export type TCreateBalanceInvoiceActionTypes =
    CreateBalanceInvoiceAction
    | CreateBalanceInvoiceActionSuccess
    | CreateBalanceInvoiceActionFail;

export default function createBalanceInvoiceReducer(
    state = initialState,
    action: TCreateBalanceInvoiceActionTypes,
): TCreateBalanceInvoiceState {
    switch (action.type) {
    case CREATE_BALANCE_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case CREATE_BALANCE_INVOICE_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case CREATE_BALANCE_INVOICE_FAIL:
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
