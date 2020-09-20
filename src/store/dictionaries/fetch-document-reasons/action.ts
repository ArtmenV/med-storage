import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_DOCUMENT_REASONS,
    FETCH_DOCUMENT_REASONS_SUCCESS,
    FETCH_DOCUMENT_REASONS_FAIL,
    TFetchDocumentReasonsActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchDocumentReasonsActionTypes> => async (
    dispatch: Dispatch<TFetchDocumentReasonsActionTypes>,
): Promise<TFetchDocumentReasonsActionTypes> => {
    dispatch({
        type: FETCH_DOCUMENT_REASONS,
    });

    let response;

    try {
        response = await Api.get('/taxRate'); // TODO replace endpoint
    } catch (e) {
        return dispatch({
            type: FETCH_DOCUMENT_REASONS_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_DOCUMENT_REASONS_SUCCESS,
        payload: (response.data as { list: TIdNameRecord[]}).list,
    });
};
