import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_FUNDING_SOURCES,
    FETCH_FUNDING_SOURCES_SUCCESS,
    FETCH_FUNDING_SOURCES_FAIL,
    TFetchFundingSourcesActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchFundingSourcesActionTypes> => async (
    dispatch: Dispatch<TFetchFundingSourcesActionTypes>,
): Promise<TFetchFundingSourcesActionTypes> => {
    dispatch({
        type: FETCH_FUNDING_SOURCES,
    });

    let response;

    try {
        response = await Api.get('/financialSource');
    } catch (e) {
        return dispatch({
            type: FETCH_FUNDING_SOURCES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_FUNDING_SOURCES_SUCCESS,
        payload: (response.data as { list: TIdNameRecord[]}).list,
    });
};
