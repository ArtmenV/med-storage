import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TTaxRate } from 'types/gists';

export const FETCH_FUNDING_SOURCES = 'FETCH_FUNDING_SOURCES';
export const FETCH_FUNDING_SOURCES_SUCCESS = 'FETCH_FUNDING_SOURCES_SUCCESS';
export const FETCH_FUNDING_SOURCES_FAIL = 'FETCH_FUNDING_SOURCES_FAIL';

export type TFundingSourcesState = TLoadableState<TTaxRate[]>;

const initialState: TFundingSourcesState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchFundingSourcesAction = TPlainAction<typeof FETCH_FUNDING_SOURCES>

type FetchFundingSourcesActionSuccess = TPayloadAction<typeof FETCH_FUNDING_SOURCES_SUCCESS, TTaxRate[]>

type FetchFundingSourcesActionFail = TFailedAction<typeof FETCH_FUNDING_SOURCES_FAIL>

export type TFetchFundingSourcesActionTypes =
    FetchFundingSourcesAction
    | FetchFundingSourcesActionSuccess
    | FetchFundingSourcesActionFail;

export default function fundingSourcesReducer(
    state = initialState,
    action: TFetchFundingSourcesActionTypes,
): TFundingSourcesState {
    switch (action.type) {
    case FETCH_FUNDING_SOURCES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_FUNDING_SOURCES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_FUNDING_SOURCES_FAIL:
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
