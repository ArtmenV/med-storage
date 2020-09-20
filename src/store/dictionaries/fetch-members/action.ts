import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_MEMBERS,
    FETCH_MEMBERS_SUCCESS,
    FETCH_MEMBERS_FAIL,
    TFetchMembersActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchMembersActionTypes> => async (
    dispatch: Dispatch<TFetchMembersActionTypes>,
): Promise<TFetchMembersActionTypes> => {
    dispatch({
        type: FETCH_MEMBERS,
    });

    let response;

    try {
        // response = await Api.get('/members');
        response = {
            data: {
                list: [
                    { id: 1, name: 'Первый Член Комиссии' },
                    { id: 2, name: 'Второй Член Комиссии' },
                    { id: 3, name: 'Третий Член Комиссии' },
                ],
            },
        };
    } catch (e) {
        return dispatch({
            type: FETCH_MEMBERS_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_MEMBERS_SUCCESS,
        payload: (response.data as { list: TIdNameRecord[]}).list,
    });
};
