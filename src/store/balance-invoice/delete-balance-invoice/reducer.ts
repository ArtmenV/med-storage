import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

export const DELETE_BALANCE_INVOICE = 'DELETE_BALANCE_INVOICE';
export const DELETE_BALANCE_INVOICE_SUCCESS = 'DELETE_BALANCE_INVOICE_SUCCESS';
export const DELETE_BALANCE_INVOICE_FAIL = 'DELETE_BALANCE_INVOICE_FAIL';

export type TDeleteBalanceInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    id?: number;
}

const initialState: TDeleteBalanceInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    id: undefined,
};

type DeleteBalanceInvoiceAction = TPayloadAction<typeof DELETE_BALANCE_INVOICE, number>

export type DeleteBalanceInvoiceActionSuccess = TPayloadAction<typeof DELETE_BALANCE_INVOICE_SUCCESS, number>

type DeleteBalanceInvoiceActionFail = TFailedAction<typeof DELETE_BALANCE_INVOICE_FAIL>

export type TDeleteBalanceInvoiceActionTypes =
    DeleteBalanceInvoiceAction
    | DeleteBalanceInvoiceActionSuccess
    | DeleteBalanceInvoiceActionFail;

export default function deleteBalanceInvoiceReducer(
    state = initialState,
    action: TDeleteBalanceInvoiceActionTypes,
): TDeleteBalanceInvoiceState {
    switch (action.type) {
    case DELETE_BALANCE_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            id: action.payload,
        };

    case DELETE_BALANCE_INVOICE_SUCCESS:
        return {
            ...state,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case DELETE_BALANCE_INVOICE_FAIL:
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
