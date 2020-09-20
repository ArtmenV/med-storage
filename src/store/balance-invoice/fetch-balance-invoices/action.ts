import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TBalanceInvoiceFullData } from 'types/gists';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_BALANCE_INVOICES,
    FETCH_BALANCE_INVOICES_SUCCESS,
    FETCH_BALANCE_INVOICES_FAIL,
    TFetchBalanceInvoicessActionTypes,
} from './reducer';


export default (invoiceId?: number): ThunkAction<void, TRootState, unknown, TFetchBalanceInvoicessActionTypes> => async (
    dispatch: Dispatch<TFetchBalanceInvoicessActionTypes>,
): Promise<TFetchBalanceInvoicessActionTypes> => {
    dispatch({
        type: FETCH_BALANCE_INVOICES,
    });

    let response;

    try {
        response = await Api.get('/storageDocument', {
            id: invoiceId,
        });
    } catch (e) {
        return dispatch({
            type: FETCH_BALANCE_INVOICES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_BALANCE_INVOICES_SUCCESS,
        payload: (response.data as { 'list': TBalanceInvoiceFullData[]}).list,
    });
};
