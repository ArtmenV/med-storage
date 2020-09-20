import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';

import { TRootState } from 'store/root-reducer';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_BRANCHES,
    FETCH_BRANCHES_SUCCESS,
    FETCH_BRANCHES_FAIL,
    TFetchBranchesActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchBranchesActionTypes> => async (
    dispatch: Dispatch<TFetchBranchesActionTypes>,
): Promise<TFetchBranchesActionTypes> => {
    dispatch({
        type: FETCH_BRANCHES,
    });

    let response;

    try {
        response = await axios.get('http://test3.biopicmedical.com/api/v1/enterprise/getEnterpriseData');
    } catch (e) {
        return dispatch({
            type: FETCH_BRANCHES_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_BRANCHES_SUCCESS,
        payload: (response.data as { records: TIdNameRecord[]}).records,
    });
};
