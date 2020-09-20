import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    CREATE_PURCHASE_INVOICE,
    CREATE_PURCHASE_INVOICE_SUCCESS,
    CREATE_PURCHASE_INVOICE_FAIL,
    TCreatePurchaseInvoiceActionTypes,
    TCreatePurchaseInvoiceData,
} from './reducer';


export default (payload: TCreatePurchaseInvoiceData): ThunkAction<void, TRootState, unknown, TCreatePurchaseInvoiceActionTypes> => async (
    dispatch: Dispatch<TCreatePurchaseInvoiceActionTypes>,
): Promise<TCreatePurchaseInvoiceActionTypes> => {
    dispatch({
        type: CREATE_PURCHASE_INVOICE,
        payload,
    });

    try {
        await Api.post('/arrivalInvoice/create', payload);
    } catch (e) {
        return dispatch({
            type: CREATE_PURCHASE_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: CREATE_PURCHASE_INVOICE_SUCCESS,
    });
};
