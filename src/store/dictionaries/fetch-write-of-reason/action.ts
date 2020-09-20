import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TWriteOfReason } from 'types/sales-invoice/write-reason';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_WRITE_OF_REASON,
    FETCH_WRITE_OF_REASON_SUCCESS,
    FETCH_WRITE_OF_REASON_FAIL,
    TFetchWriteOfReasonTypeActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchWriteOfReasonTypeActionTypes> => async (
    dispatch: Dispatch<TFetchWriteOfReasonTypeActionTypes>,
): Promise<TFetchWriteOfReasonTypeActionTypes> => {
    dispatch({
        type: FETCH_WRITE_OF_REASON,
    });

    let response;

    try {
        response = await Api.get('/writeOffReason');
    } catch (e) {
        return dispatch({
            type: FETCH_WRITE_OF_REASON_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_WRITE_OF_REASON_SUCCESS,
        payload: (response.data as { list: TWriteOfReason[] }).list,
    });
};
