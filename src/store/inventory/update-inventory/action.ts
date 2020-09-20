import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';
import { TInventoryFullData } from 'types/gists';

import {
    UPDATE_INVENTORY,
    UPDATE_INVENTORY_SUCCESS,
    UPDATE_INVENTORY_FAIL,
    TUpdateInventoryActionTypes,
    TUpdateInventoryData,
} from './reducer';


export default (payload: TUpdateInventoryData): ThunkAction<void, TRootState, unknown, TUpdateInventoryActionTypes> => async (
    dispatch: Dispatch<TUpdateInventoryActionTypes>,
): Promise<TUpdateInventoryActionTypes> => {
    dispatch({
        type: UPDATE_INVENTORY,
        payload,
    });

    let response;
    try {
        response = await Api.patch('/inventory/update', payload);
    } catch (e) {
        return dispatch({
            type: UPDATE_INVENTORY_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: UPDATE_INVENTORY_SUCCESS,
        payload: (response.data as { 'list': TInventoryFullData[]}).list[0],
    });
};
