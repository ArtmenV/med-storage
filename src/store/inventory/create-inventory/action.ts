import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    CREATE_INVENTORY,
    CREATE_INVENTORY_SUCCESS,
    CREATE_INVENTORY_FAIL,
    TCreateInventoryActionTypes,
    TCreateInventoryData,
} from './reducer';


export default (payload: TCreateInventoryData): ThunkAction<void, TRootState, unknown, TCreateInventoryActionTypes> => async (
    dispatch: Dispatch<TCreateInventoryActionTypes>,
): Promise<TCreateInventoryActionTypes> => {
    dispatch({
        type: CREATE_INVENTORY,
        payload,
    });

    try {
        await Api.post('/inventory/create', payload);
    } catch (e) {
        return dispatch({
            type: CREATE_INVENTORY_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: CREATE_INVENTORY_SUCCESS,
    });
};
