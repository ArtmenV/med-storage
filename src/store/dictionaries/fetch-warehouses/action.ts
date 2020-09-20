import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_WAREHOUSES,
    FETCH_WAREHOUSES_SUCCESS,
    FETCH_WAREHOUSES_FAIL,
    TFetchWarehousesActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchWarehousesActionTypes> => async (
    dispatch: Dispatch<TFetchWarehousesActionTypes>,
): Promise<TFetchWarehousesActionTypes> => {
    dispatch({
        type: FETCH_WAREHOUSES,
    });

    let response;

    try {
        response = await Api.get('/warehouse');
    } catch (e) {
        return dispatch({
            type: FETCH_WAREHOUSES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_WAREHOUSES_SUCCESS,
        payload: (response.data as { list: TIdNameRecord[]}).list,
    });
};
