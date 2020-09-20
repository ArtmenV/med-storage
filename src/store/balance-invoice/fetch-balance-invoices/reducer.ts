import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TBalanceInvoiceFullData } from 'types/gists';

import {
    DELETE_BALANCE_INVOICE_SUCCESS,
    DeleteBalanceInvoiceActionSuccess,
} from 'store/balance-invoice/delete-balance-invoice/reducer';

import {
    UPDATE_BALANCE_INVOICE_SUCCESS,
    UpdateBalanceInvoiceActionSuccess,
} from 'store/balance-invoice/update-balance-invoice/reducer';

export const FETCH_BALANCE_INVOICES = 'FETCH_BALANCE_INVOICES';
export const FETCH_BALANCE_INVOICES_SUCCESS = 'FETCH_BALANCE_INVOICES_SUCCESS';
export const FETCH_BALANCE_INVOICES_FAIL = 'FETCH_BALANCE_INVOICES_FAIL';

export type TBalanceInvoicessState = TLoadableState<TBalanceInvoiceFullData[]>;

const initialState: TBalanceInvoicessState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchBalanceInvoicessAction = TPlainAction<typeof FETCH_BALANCE_INVOICES>

type FetchBalanceInvoicessActionSuccess = TPayloadAction<typeof FETCH_BALANCE_INVOICES_SUCCESS, TBalanceInvoiceFullData[]>

type FetchBalanceInvoicessActionFail = TFailedAction<typeof FETCH_BALANCE_INVOICES_FAIL>

export type TFetchBalanceInvoicessActionTypes =
    FetchBalanceInvoicessAction
    | FetchBalanceInvoicessActionSuccess
    | FetchBalanceInvoicessActionFail
    | DeleteBalanceInvoiceActionSuccess
    | UpdateBalanceInvoiceActionSuccess;

export default function balanceInvoiceReducer(
    state = initialState,
    action: TFetchBalanceInvoicessActionTypes,
): TBalanceInvoicessState {
    let newData = [];
    let index: number;

    switch (action.type) {
    case FETCH_BALANCE_INVOICES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_BALANCE_INVOICES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_BALANCE_INVOICES_FAIL:
        return {
            isLoading: false,
            isLoaded: false,
            data: [],
            errors: action.errors,
        };

    case DELETE_BALANCE_INVOICE_SUCCESS:
        newData = state.data.filter((dataItem) => dataItem.id !== action.payload);

        return {
            ...state,
            data: newData,
        };

    case UPDATE_BALANCE_INVOICE_SUCCESS:
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
