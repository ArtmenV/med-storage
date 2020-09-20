import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TPurchaseInvoiceFullData } from 'types/gists';

import {
    DELETE_PURCHASE_INVOICE_SUCCESS,
    DeletePurchaseInvoiceActionSuccess,
} from 'store/purchase-invoice/delete-purchase-invoice/reducer';

import {
    UPDATE_PURCHASE_INVOICE_SUCCESS,
    UpdatePurchaseInvoiceActionSuccess,
} from 'store/purchase-invoice/update-purchase-invoice/reducer';

export const FETCH_PURCHASE_INVOICES = 'FETCH_PURCHASE_INVOICES';
export const FETCH_PURCHASE_INVOICES_SUCCESS = 'FETCH_PURCHASE_INVOICES_SUCCESS';
export const FETCH_PURCHASE_INVOICES_FAIL = 'FETCH_PURCHASE_INVOICES_FAIL';

export type TPurchaseInvoicessState = TLoadableState<TPurchaseInvoiceFullData[]>;

const initialState: TPurchaseInvoicessState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchPurchaseInvoicessAction = TPlainAction<typeof FETCH_PURCHASE_INVOICES>

type FetchPurchaseInvoicessActionSuccess = TPayloadAction<typeof FETCH_PURCHASE_INVOICES_SUCCESS, TPurchaseInvoiceFullData[]>

type FetchPurchaseInvoicessActionFail = TFailedAction<typeof FETCH_PURCHASE_INVOICES_FAIL>

export type TFetchPurchaseInvoicessActionTypes =
    FetchPurchaseInvoicessAction
    | FetchPurchaseInvoicessActionSuccess
    | FetchPurchaseInvoicessActionFail
    | DeletePurchaseInvoiceActionSuccess
    | UpdatePurchaseInvoiceActionSuccess;

export default function purchaseInvoicesReducer(
    state = initialState,
    action: TFetchPurchaseInvoicessActionTypes,
): TPurchaseInvoicessState {
    let newData = [];
    let index: number;

    switch (action.type) {
    case FETCH_PURCHASE_INVOICES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_PURCHASE_INVOICES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_PURCHASE_INVOICES_FAIL:
        return {
            isLoading: false,
            isLoaded: false,
            data: [],
            errors: action.errors,
        };

    case DELETE_PURCHASE_INVOICE_SUCCESS:
        newData = state.data.filter((dataItem) => dataItem.id !== action.payload);

        return {
            ...state,
            data: newData,
        };

    case UPDATE_PURCHASE_INVOICE_SUCCESS:
        newData = [...state.data];
        index = newData.findIndex((dataItem) => dataItem.id === action.payload.id);

        if (index >= 0) {
            newData[index] = action.payload;
        }

        return {
            ...state,
            data: newData,
        };
    default:
        return state;
    }
}
