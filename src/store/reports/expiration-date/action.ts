import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TExpirationDateReportData, TExpirationDateReportPaylod } from 'types/gists';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_EXPIRATION_DATE_REPORT,
    FETCH_EXPIRATION_DATE_REPORT_SUCCESS,
    FETCH_EXPIRATION_DATE_REPORT_FAIL,
    TFetchExpirationDateReportActionTypes,
} from './reducer';


export default (payload: TExpirationDateReportPaylod): ThunkAction<void, TRootState, unknown, TFetchExpirationDateReportActionTypes> => async (
    dispatch: Dispatch<TFetchExpirationDateReportActionTypes>,
): Promise<TFetchExpirationDateReportActionTypes> => {
    dispatch({
        type: FETCH_EXPIRATION_DATE_REPORT,
        payload,
    });

    let response;

    try {
        response = await Api.post('/report/expirationDate', payload);
    } catch (e) {
        return dispatch({
            type: FETCH_EXPIRATION_DATE_REPORT_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_EXPIRATION_DATE_REPORT_SUCCESS,
        payload: (response.data as { list: TExpirationDateReportData[] }).list,
    });
};
