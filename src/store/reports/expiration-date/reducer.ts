import {
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TExpirationDateReportData, TExpirationDateReportPaylod } from 'types/gists';

export const FETCH_EXPIRATION_DATE_REPORT = 'FETCH_EXPIRATION_DATE_REPORT';
export const FETCH_EXPIRATION_DATE_REPORT_SUCCESS = 'FETCH_EXPIRATION_DATE_REPORT_SUCCESS';
export const FETCH_EXPIRATION_DATE_REPORT_FAIL = 'FETCH_EXPIRATION_DATE_REPORT_FAIL';

export type TExpirationDateReportState = TLoadableState<TExpirationDateReportData[]>;

const initialState: TExpirationDateReportState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchExpirationDateReportAction = TPayloadAction<typeof FETCH_EXPIRATION_DATE_REPORT, TExpirationDateReportPaylod>

type FetchExpirationDateReportActionSuccess = TPayloadAction<typeof FETCH_EXPIRATION_DATE_REPORT_SUCCESS, TExpirationDateReportData[]>

type FetchExpirationDateReportActionFail = TFailedAction<typeof FETCH_EXPIRATION_DATE_REPORT_FAIL>

export type TFetchExpirationDateReportActionTypes =
    FetchExpirationDateReportAction
    | FetchExpirationDateReportActionSuccess
    | FetchExpirationDateReportActionFail;

export default function expirationDateReportReducer(
    state = initialState,
    action: TFetchExpirationDateReportActionTypes,
): TExpirationDateReportState {
    switch (action.type) {
    case FETCH_EXPIRATION_DATE_REPORT:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_EXPIRATION_DATE_REPORT_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_EXPIRATION_DATE_REPORT_FAIL:
        return {
            isLoading: false,
            isLoaded: false,
            data: [],
            errors: action.errors,
        };

    default:
        return state;
    }
}
