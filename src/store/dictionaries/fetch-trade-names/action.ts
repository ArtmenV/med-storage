import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TIdNameRecord } from 'medici-ui-kit/types/data-types';
import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_TRADE_NAMES,
    FETCH_TRADE_NAMES_SUCCESS,
    FETCH_TRADE_NAMES_FAIL,
    TFetchTradeNamesActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchTradeNamesActionTypes> => async (
    dispatch: Dispatch<TFetchTradeNamesActionTypes>,
): Promise<TFetchTradeNamesActionTypes> => {
    dispatch({
        type: FETCH_TRADE_NAMES,
    });

    let response;

    try {
        response = await Api.get('/tradeName');
    } catch (e) {
        return dispatch({
            type: FETCH_TRADE_NAMES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_TRADE_NAMES_SUCCESS,
        payload: (response.data as { list: TIdNameRecord[]}).list,
    });
};
