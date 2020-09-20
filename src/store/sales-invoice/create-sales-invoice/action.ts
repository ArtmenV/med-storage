import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';
import { TCreateSalesInvoice } from 'types/sales-invoice/create-sales-invoice';

import {
    CREATE_SALES_INVOICE,
    CREATE_SALES_INVOICE_SUCCESS,
    CREATE_SALES_INVOICE_FAIL,
    TCreateSalesInvoiceActionTypes,
} from './reducer';


export default (payload: TCreateSalesInvoice): ThunkAction<void, TRootState, unknown, TCreateSalesInvoiceActionTypes> => async (
    dispatch: Dispatch<TCreateSalesInvoiceActionTypes>,
): Promise<TCreateSalesInvoiceActionTypes> => {
    dispatch({
        type: CREATE_SALES_INVOICE,
        payload,
    });

    try {
        await Api.post('/salesInvoice/create', payload);
    } catch (e) {
        return dispatch({
            type: CREATE_SALES_INVOICE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: CREATE_SALES_INVOICE_SUCCESS,
    });
};
