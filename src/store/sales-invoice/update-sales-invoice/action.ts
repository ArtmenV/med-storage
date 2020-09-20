import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';
import { TSalesInvoiceFullData } from 'types/sales-invoice/sales-invoice-full-data';

import {
    UPDATE_SALES_INVOICE,
    UPDATE_SALES_INVOICE_SUCCESS,
    UPDATE_SALES_INVOICE_FAIL,
    TUpdateSalesInvoiceData,
    TUpdateSalesInvoiceActionTypes,
} from './reducer';


export default (payload: TUpdateSalesInvoiceData): ThunkAction<void, TRootState, unknown, TUpdateSalesInvoiceActionTypes> => async (
    dispatch: Dispatch<TUpdateSalesInvoiceActionTypes>,
): Promise<TUpdateSalesInvoiceActionTypes> => {
    dispatch({
        type: UPDATE_SALES_INVOICE,
        payload,
    });

    let response;
    try {
        response = await Api.patch('/salesInvoice/update', payload);
    } catch (e) {
        return dispatch({
            type: UPDATE_SALES_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: UPDATE_SALES_INVOICE_SUCCESS,
        payload: (response.data as { 'list': TSalesInvoiceFullData[]}).list[0],
    });
};
