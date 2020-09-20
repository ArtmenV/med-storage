import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TCreateSalesInvoice } from 'types/sales-invoice/create-sales-invoice';

export const CREATE_SALES_INVOICE = 'CREATE_SALES_INVOICE';
export const CREATE_SALES_INVOICE_SUCCESS = 'CREATE_SALES_INVOICE_SUCCESS';
export const CREATE_SALES_INVOICE_FAIL = 'CREATE_SALES_INVOICE_FAIL';

// export type TCreatePurchaseInvoiceData = Omit<TCreateSalesInvoice, 'id'>;

export type TCreateSalesInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TCreateSalesInvoice;
}

const initialState: TCreateSalesInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type CreateSalesInvoiceAction = TPayloadAction<typeof CREATE_SALES_INVOICE, TCreateSalesInvoice>

type CreateSalesInvoiceActionSuccess = TPlainAction<typeof CREATE_SALES_INVOICE_SUCCESS>

type CreateSalesInvoiceActionFail = TFailedAction<typeof CREATE_SALES_INVOICE_FAIL>

export type TCreateSalesInvoiceActionTypes =
    CreateSalesInvoiceAction
    | CreateSalesInvoiceActionSuccess
    | CreateSalesInvoiceActionFail;

export default function createPurchaseInvoiceReducer(
    state = initialState,
    action: TCreateSalesInvoiceActionTypes,
): TCreateSalesInvoiceState {
    switch (action.type) {
    case CREATE_SALES_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case CREATE_SALES_INVOICE_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case CREATE_SALES_INVOICE_FAIL:
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
