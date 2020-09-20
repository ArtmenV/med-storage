import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    CREATE_BALANCE_INVOICE,
    CREATE_BALANCE_INVOICE_SUCCESS,
    CREATE_BALANCE_INVOICE_FAIL,
    TCreateBalanceInvoiceActionTypes,
    TCreateBalanceInvoiceData,
} from './reducer';


export default (payload: TCreateBalanceInvoiceData): ThunkAction<void, TRootState, unknown, TCreateBalanceInvoiceActionTypes> => async (
    dispatch: Dispatch<TCreateBalanceInvoiceActionTypes>,
): Promise<TCreateBalanceInvoiceActionTypes> => {
    dispatch({
        type: CREATE_BALANCE_INVOICE,
        payload,
    });

    try {
        await Api.post('/storageDocument/create', payload);
    } catch (e) {
        return dispatch({
            type: CREATE_BALANCE_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: CREATE_BALANCE_INVOICE_SUCCESS,
    });
};
