import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_CONSIGNEES,
    FETCH_CONSIGNEES_SUCCESS,
    FETCH_CONSIGNEES_FAIL,
    TFetchConsigneesActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchConsigneesActionTypes> => async (
    dispatch: Dispatch<TFetchConsigneesActionTypes>,
): Promise<TFetchConsigneesActionTypes> => {
    dispatch({
        type: FETCH_CONSIGNEES,
    });

    let response;

    try {
        response = await Api.get('/recipientOrganization');
    } catch (e) {
        return dispatch({
            type: FETCH_CONSIGNEES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_CONSIGNEES_SUCCESS,
        payload: (response.data as { list: TIdNameRecord[]}).list,
    });
};
