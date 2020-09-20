import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TStorageNomenclature } from 'types/gists';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_STORAGE_DATA,
    FETCH_STORAGE_DATA_SUCCESS,
    FETCH_STORAGE_DATA_FAIL,
    TFetchStorageDataActionTypes,
} from './reducer';


export default (invoiceId?: number): ThunkAction<void, TRootState, unknown, TFetchStorageDataActionTypes> => async (
    dispatch: Dispatch<TFetchStorageDataActionTypes>,
): Promise<TFetchStorageDataActionTypes> => {
    dispatch({
        type: FETCH_STORAGE_DATA,
    });

    let response;

    try {
        response = await Api.get('/storage', {
            id: invoiceId,
        });
    } catch (e) {
        return dispatch({
            type: FETCH_STORAGE_DATA_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_STORAGE_DATA_SUCCESS,
        payload: (response.data as { 'list': TStorageNomenclature[]}).list,
    });
};
