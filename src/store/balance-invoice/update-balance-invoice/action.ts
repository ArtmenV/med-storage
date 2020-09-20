import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';
import { TBalanceInvoiceFullData } from 'types/gists';

import {
    UPDATE_BALANCE_INVOICE,
    UPDATE_BALANCE_INVOICE_SUCCESS,
    UPDATE_BALANCE_INVOICE_FAIL,
    TUpdateBalanceInvoiceActionTypes,
    TUpdateBalanceInvoiceData,
} from './reducer';


export default (payload: TUpdateBalanceInvoiceData): ThunkAction<void, TRootState, unknown, TUpdateBalanceInvoiceActionTypes> => async (
    dispatch: Dispatch<TUpdateBalanceInvoiceActionTypes>,
): Promise<TUpdateBalanceInvoiceActionTypes> => {
    dispatch({
        type: UPDATE_BALANCE_INVOICE,
        payload,
    });

    let response;
    try {
        response = await Api.patch('/storageDocument/update', payload);
    } catch (e) {
        return dispatch({
            type: UPDATE_BALANCE_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: UPDATE_BALANCE_INVOICE_SUCCESS,
        payload: (response.data as { 'list': TBalanceInvoiceFullData[]}).list[0],
    });
};
