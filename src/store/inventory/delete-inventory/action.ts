import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    DELETE_INVENTORY,
    DELETE_INVENTORY_SUCCESS,
    DELETE_INVENTORY_FAIL,
    TDeleteInventoryActionTypes,
} from './reducer';


export default (payload: number): ThunkAction<void, TRootState, unknown, TDeleteInventoryActionTypes> => async (
    dispatch: Dispatch<TDeleteInventoryActionTypes>,
): Promise<TDeleteInventoryActionTypes> => {
    dispatch({
        type: DELETE_INVENTORY,
        payload,
    });

    try {
        await Api.delete('/inventory/delete', { id: payload });
    } catch (e) {
        return dispatch({
            type: DELETE_INVENTORY_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: DELETE_INVENTORY_SUCCESS,
        payload,
    });
};
