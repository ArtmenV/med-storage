import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';
import { TNamenclatureCard } from '../../types/sales-invoice/sales-invoice';

import {
    FETCH_NOMENCLATURE_SALES_INVOICE_CARDS,
    FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_SUCCESS,
    FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_FAIL,
    TFetchNomenclatureCardsActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchNomenclatureCardsActionTypes> => async (
    dispatch: Dispatch<TFetchNomenclatureCardsActionTypes>,
): Promise<TFetchNomenclatureCardsActionTypes> => {
    dispatch({
        type: FETCH_NOMENCLATURE_SALES_INVOICE_CARDS,
    });

    let response;

    try {
        response = await Api.get('/itemCard');
    } catch (e) {
        return dispatch({
            type: FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_SUCCESS,
        payload: (response.data as { list: TNamenclatureCard[]}).list,
    });
};
