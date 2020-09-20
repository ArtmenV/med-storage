import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TTaxRate } from 'types/gists';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_TAX_RATES,
    FETCH_TAX_RATES_SUCCESS,
    FETCH_TAX_RATES_FAIL,
    TFetchTaxRatesActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchTaxRatesActionTypes> => async (
    dispatch: Dispatch<TFetchTaxRatesActionTypes>,
): Promise<TFetchTaxRatesActionTypes> => {
    dispatch({
        type: FETCH_TAX_RATES,
    });

    let response;

    try {
        response = await Api.get('/taxRate');
    } catch (e) {
        return dispatch({
            type: FETCH_TAX_RATES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_TAX_RATES_SUCCESS,
        payload: (response.data as { list: TTaxRate[]}).list,
    });
};
