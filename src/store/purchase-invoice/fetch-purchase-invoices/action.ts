import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TPurchaseInvoiceFullData } from 'types/gists';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_PURCHASE_INVOICES,
    FETCH_PURCHASE_INVOICES_SUCCESS,
    FETCH_PURCHASE_INVOICES_FAIL,
    TFetchPurchaseInvoicessActionTypes,
} from './reducer';


export default (invoiceId?: number): ThunkAction<void, TRootState, unknown, TFetchPurchaseInvoicessActionTypes> => async (
    dispatch: Dispatch<TFetchPurchaseInvoicessActionTypes>,
): Promise<TFetchPurchaseInvoicessActionTypes> => {
    dispatch({
        type: FETCH_PURCHASE_INVOICES,
    });

    let response;

    try {
        response = await Api.get('/arrivalInvoice', {
            id: invoiceId,
        });
    } catch (e) {
        return dispatch({
            type: FETCH_PURCHASE_INVOICES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_PURCHASE_INVOICES_SUCCESS,
        payload: (response.data as { 'list': TPurchaseInvoiceFullData[]}).list,
    });
};
