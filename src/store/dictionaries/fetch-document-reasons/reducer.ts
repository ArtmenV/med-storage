import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TTaxRate } from 'types/gists';

export const FETCH_DOCUMENT_REASONS = 'FETCH_DOCUMENT_REASONS';
export const FETCH_DOCUMENT_REASONS_SUCCESS = 'FETCH_DOCUMENT_REASONS_SUCCESS';
export const FETCH_DOCUMENT_REASONS_FAIL = 'FETCH_DOCUMENT_REASONS_FAIL';

export type TDocumentReasonsState = TLoadableState<TTaxRate[]>;

const initialState: TDocumentReasonsState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchDocumentReasonsAction = TPlainAction<typeof FETCH_DOCUMENT_REASONS>

type FetchDocumentReasonsActionSuccess = TPayloadAction<typeof FETCH_DOCUMENT_REASONS_SUCCESS, TTaxRate[]>

type FetchDocumentReasonsActionFail = TFailedAction<typeof FETCH_DOCUMENT_REASONS_FAIL>

export type TFetchDocumentReasonsActionTypes =
    FetchDocumentReasonsAction
    | FetchDocumentReasonsActionSuccess
    | FetchDocumentReasonsActionFail;

export default function documentReasonsReducer(
    state = initialState,
    action: TFetchDocumentReasonsActionTypes,
): TDocumentReasonsState {
    switch (action.type) {
    case FETCH_DOCUMENT_REASONS:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_DOCUMENT_REASONS_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_DOCUMENT_REASONS_FAIL:
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
