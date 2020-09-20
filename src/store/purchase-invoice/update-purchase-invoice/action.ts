import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';
import { TPurchaseInvoiceFullData } from 'types/gists';

import {
    UPDATE_PURCHASE_INVOICE,
    UPDATE_PURCHASE_INVOICE_SUCCESS,
    UPDATE_PURCHASE_INVOICE_FAIL,
    TUpdatePurchaseInvoiceActionTypes,
    TUpdatePurchaseInvoiceData,
} from './reducer';


export default (payload: TUpdatePurchaseInvoiceData): ThunkAction<void, TRootState, unknown, TUpdatePurchaseInvoiceActionTypes> => async (
    dispatch: Dispatch<TUpdatePurchaseInvoiceActionTypes>,
): Promise<TUpdatePurchaseInvoiceActionTypes> => {
    dispatch({
        type: UPDATE_PURCHASE_INVOICE,
        payload,
    });

    let response;
    try {
        response = await Api.patch('/arrivalInvoice/update', payload);
    } catch (e) {
        return dispatch({
            type: UPDATE_PURCHASE_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: UPDATE_PURCHASE_INVOICE_SUCCESS,
        payload: (response.data as { 'list': TPurchaseInvoiceFullData[]}).list[0],
    });
};
