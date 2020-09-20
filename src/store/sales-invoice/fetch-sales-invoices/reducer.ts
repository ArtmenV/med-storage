import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TSalesInvoiceFullData } from 'types/sales-invoice/sales-invoice-full-data';

export const FETCH_SALES_INVOICES = 'FETCH_SALES_INVOICES';
export const FETCH_SALES_INVOICES_SUCCESS = 'FETCH_SALES_INVOICES_SUCCESS';
export const FETCH_SALES_INVOICES_FAIL = 'FETCH_SALES_INVOICES_FAIL';

export type TPurchaseInvoicessState = TLoadableState<TSalesInvoiceFullData[]>;

const initialState: TPurchaseInvoicessState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchSalesInvoicessAction = TPlainAction<typeof FETCH_SALES_INVOICES>

type FetchSalesInvoicessActionSuccess = TPayloadAction<typeof FETCH_SALES_INVOICES_SUCCESS, TSalesInvoiceFullData[]>

type FetchSalesInvoicessActionFail = TFailedAction<typeof FETCH_SALES_INVOICES_FAIL>

export type TFetchPurchaseInvoicessActionTypes =
    FetchSalesInvoicessAction
    | FetchSalesInvoicessActionSuccess
    | FetchSalesInvoicessActionFail

export default function purchaseInvoicesReducer(
    state = initialState,
    action: TFetchPurchaseInvoicessActionTypes,
): TPurchaseInvoicessState {
    switch (action.type) {
    case FETCH_SALES_INVOICES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_SALES_INVOICES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_SALES_INVOICES_FAIL:
        return {
            isLoading: false,
            isLoaded: false,
            data: [],
            errors: action.errors,
        };
    default:
        return state;
    }
}
