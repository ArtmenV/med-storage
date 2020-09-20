import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_STORE_REASONS,
    FETCH_STORE_REASONS_SUCCESS,
    FETCH_STORE_REASONS_FAIL,
    TFetchStoreReasonsActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchStoreReasonsActionTypes> => async (
    dispatch: Dispatch<TFetchStoreReasonsActionTypes>,
): Promise<TFetchStoreReasonsActionTypes> => {
    dispatch({
        type: FETCH_STORE_REASONS,
    });

    let response;

    try {
        response = await Api.get('/storeReason');
    } catch (e) {
        return dispatch({
            type: FETCH_STORE_REASONS_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_STORE_REASONS_SUCCESS,
        payload: (response.data as { list: TIdNameRecord[]}).list,
    });
};
