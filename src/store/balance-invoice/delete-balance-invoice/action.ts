import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    DELETE_BALANCE_INVOICE,
    DELETE_BALANCE_INVOICE_SUCCESS,
    DELETE_BALANCE_INVOICE_FAIL,
    TDeleteBalanceInvoiceActionTypes,
} from './reducer';


export default (payload: number): ThunkAction<void, TRootState, unknown, TDeleteBalanceInvoiceActionTypes> => async (
    dispatch: Dispatch<TDeleteBalanceInvoiceActionTypes>,
): Promise<TDeleteBalanceInvoiceActionTypes> => {
    dispatch({
        type: DELETE_BALANCE_INVOICE,
        payload,
    });

    try {
        await Api.delete('/storageDocument/delete', { id: payload });
    } catch (e) {
        return dispatch({
            type: DELETE_BALANCE_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: DELETE_BALANCE_INVOICE_SUCCESS,
        payload,
    });
};
