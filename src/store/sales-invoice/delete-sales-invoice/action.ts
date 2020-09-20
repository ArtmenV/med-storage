import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    DELETE_SALES_INVOICE,
    DELETE_SALES_INVOICE_SUCCESS,
    DELETE_SALES_INVOICE_FAIL,
    TDeleteSalesInvoiceActionTypes,
} from './reducer';


export default (payload: number): ThunkAction<void, TRootState, unknown, TDeleteSalesInvoiceActionTypes> => async (
    dispatch: Dispatch<TDeleteSalesInvoiceActionTypes>,
): Promise<TDeleteSalesInvoiceActionTypes> => {
    dispatch({
        type: DELETE_SALES_INVOICE,
        payload,
    });

    try {
        await Api.delete('/salesInvoice/delete', { id: payload });
    } catch (e) {
        return dispatch({
            type: DELETE_SALES_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: DELETE_SALES_INVOICE_SUCCESS,
        payload,
    });
};
