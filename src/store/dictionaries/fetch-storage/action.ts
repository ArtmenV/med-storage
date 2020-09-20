import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TStorageData } from 'types/sales-invoice/storage';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_STORAGE,
    FETCH_STORAGE_SUCCESS,
    FETCH_STORAGE_FAIL,
    TFetchTaxRatesActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchTaxRatesActionTypes> => async (
    dispatch: Dispatch<TFetchTaxRatesActionTypes>,
): Promise<TFetchTaxRatesActionTypes> => {
    dispatch({
        type: FETCH_STORAGE,
    });

    let response;

    try {
        response = await Api.get('/storage');
    } catch (e) {
        return dispatch({
            type: FETCH_STORAGE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_STORAGE_SUCCESS,
        payload: (response.data as { list: TStorageData[] }).list,
    });
};
