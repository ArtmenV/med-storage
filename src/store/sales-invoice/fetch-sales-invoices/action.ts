import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TSalesInvoiceFullData } from 'types/sales-invoice/sales-invoice-full-data';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_SALES_INVOICES,
    FETCH_SALES_INVOICES_SUCCESS,
    FETCH_SALES_INVOICES_FAIL,
    TFetchPurchaseInvoicessActionTypes,
} from './reducer';


export default (invoiceId?: number): ThunkAction<void, TRootState, unknown, TFetchPurchaseInvoicessActionTypes> => async (
    dispatch: Dispatch<TFetchPurchaseInvoicessActionTypes>,
): Promise<TFetchPurchaseInvoicessActionTypes> => {
    dispatch({
        type: FETCH_SALES_INVOICES,
    });

    let response;

    try {
        response = await Api.get('/salesInvoice', {
            id: invoiceId,
        });
    } catch (e) {
        return dispatch({
            type: FETCH_SALES_INVOICES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_SALES_INVOICES_SUCCESS,
        payload: (response.data as { 'list': TSalesInvoiceFullData[]}).list,
    });
};
