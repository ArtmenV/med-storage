import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TInventoryFullData } from 'types/gists';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_INVENTORIES,
    FETCH_INVENTORIES_SUCCESS,
    FETCH_INVENTORIES_FAIL,
    TFetchInventoriesActionTypes,
} from './reducer';


export default (invoiceId?: number): ThunkAction<void, TRootState, unknown, TFetchInventoriesActionTypes> => async (
    dispatch: Dispatch<TFetchInventoriesActionTypes>,
): Promise<TFetchInventoriesActionTypes> => {
    dispatch({
        type: FETCH_INVENTORIES,
    });

    let response;

    try {
        response = await Api.get('/inventory', {
            id: invoiceId,
        });
    } catch (e) {
        return dispatch({
            type: FETCH_INVENTORIES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_INVENTORIES_SUCCESS,
        payload: (response.data as { 'list': TInventoryFullData[]}).list,
    });
};
