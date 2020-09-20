import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TConsignor } from 'types/gists';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_CONSIGNORS,
    FETCH_CONSIGNORS_SUCCESS,
    FETCH_CONSIGNORS_FAIL,
    TFetchConsignorsActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchConsignorsActionTypes> => async (
    dispatch: Dispatch<TFetchConsignorsActionTypes>,
): Promise<TFetchConsignorsActionTypes> => {
    dispatch({
        type: FETCH_CONSIGNORS,
    });

    let response;

    try {
        response = await Api.get('/suppliers');
    } catch (e) {
        return dispatch({
            type: FETCH_CONSIGNORS_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_CONSIGNORS_SUCCESS,
        payload: (response.data as { list: TConsignor[]}).list,
    });
};
