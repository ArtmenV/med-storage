import {
    TPayloadAction,
    TFailedAction,
    TNetworkError,
} from 'medici-ui-kit/types/helper-types';

export const DELETE_SALES_INVOICE = 'DELETE_SALES_INVOICE';
export const DELETE_SALES_INVOICE_SUCCESS = 'DELETE_SALES_INVOICE_SUCCESS';
export const DELETE_SALES_INVOICE_FAIL = 'DELETE_SALES_INVOICE_FAIL';

export type TDeleteSalesInvoiceState = {
    isLoading: boolean;
    isSuccess: boolean;
    errors: TNetworkError[];
    id: number | undefined;
}

const initialState: TDeleteSalesInvoiceState = {
    isLoading: false,
    isSuccess: false,
    errors: [],
    id: undefined,
};

type DeleteSalesInvoiceAction = TPayloadAction<typeof DELETE_SALES_INVOICE, number>

export type DeleteSalesInvoiceActionSuccess = TPayloadAction<typeof DELETE_SALES_INVOICE_SUCCESS, number>

type DeleteSalesInvoiceActionFail = TFailedAction<typeof DELETE_SALES_INVOICE_FAIL>

export type TDeleteSalesInvoiceActionTypes =
    DeleteSalesInvoiceAction
    | DeleteSalesInvoiceActionSuccess
    | DeleteSalesInvoiceActionFail;

export default function deletePurchaseInvoiceReducer(
    state = initialState,
    action: TDeleteSalesInvoiceActionTypes,
): TDeleteSalesInvoiceState {
    switch (action.type) {
    case DELETE_SALES_INVOICE:
        return {
            isLoading: true,
            isSuccess: false,
            errors: [],
            id: action.payload,
        };

    case DELETE_SALES_INVOICE_SUCCESS:
        return {
            ...state,
            isLoading: false,
            isSuccess: true,
            errors: [],
        };

    case DELETE_SALES_INVOICE_FAIL:
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
