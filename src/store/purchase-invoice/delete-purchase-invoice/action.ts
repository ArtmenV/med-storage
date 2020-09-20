import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    DELETE_PURCHASE_INVOICE,
    DELETE_PURCHASE_INVOICE_SUCCESS,
    DELETE_PURCHASE_INVOICE_FAIL,
    TDeletePurchaseInvoiceActionTypes,
} from './reducer';


export default (payload: number): ThunkAction<void, TRootState, unknown, TDeletePurchaseInvoiceActionTypes> => async (
    dispatch: Dispatch<TDeletePurchaseInvoiceActionTypes>,
): Promise<TDeletePurchaseInvoiceActionTypes> => {
    dispatch({
        type: DELETE_PURCHASE_INVOICE,
        payload,
    });

    try {
        await Api.delete('/arrivalInvoice/delete', { id: payload });
    } catch (e) {
        return dispatch({
            type: DELETE_PURCHASE_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: DELETE_PURCHASE_INVOICE_SUCCESS,
        payload,
    });
};
