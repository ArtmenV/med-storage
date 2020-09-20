import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

import { TSalesInvoiceFullData } from 'types/sales-invoice/sales-invoice-full-data';

export const UPDATE_SALES_INVOICE = 'UPDATE_SALES_INVOICE';
export const UPDATE_SALES_INVOICE_SUCCESS = 'UPDATE_SALES_INVOICE_SUCCESS';
export const UPDATE_SALES_INVOICE_FAIL = 'UPDATE_SALES_INVOICE_FAIL';

export type TUpdateSalesInvoiceData = Partial<TSalesInvoiceFullData>;

export type TUpdatePurchaseInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    data?: TUpdateSalesInvoiceData;
}

const initialState: TUpdatePurchaseInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    data: undefined,
};

type UpdateSalesInvoiceAction = TPayloadAction<typeof UPDATE_SALES_INVOICE, TUpdateSalesInvoiceData>

export type UpdateSalesInvoiceActionSuccess = TPayloadAction<typeof UPDATE_SALES_INVOICE_SUCCESS, TSalesInvoiceFullData>

type UpdateSalesInvoiceActionFail = TFailedAction<typeof UPDATE_SALES_INVOICE_FAIL>

export type TUpdateSalesInvoiceActionTypes =
    UpdateSalesInvoiceAction
    | UpdateSalesInvoiceActionSuccess
    | UpdateSalesInvoiceActionFail;

export default function updatePurchaseInvoiceReducer(
    state = initialState,
    action: TUpdateSalesInvoiceActionTypes,
): TUpdatePurchaseInvoiceState {
    switch (action.type) {
    case UPDATE_SALES_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            data: action.payload,
        };

    case UPDATE_SALES_INVOICE_SUCCESS:
        return {
            data: undefined,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case UPDATE_SALES_INVOICE_FAIL:
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
