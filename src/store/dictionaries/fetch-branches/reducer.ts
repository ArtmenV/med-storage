import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TTaxRate } from 'types/gists';

export const FETCH_BRANCHES = 'FETCH_BRANCHES';
export const FETCH_BRANCHES_SUCCESS = 'FETCH_BRANCHES_SUCCESS';
export const FETCH_BRANCHES_FAIL = 'FETCH_BRANCHES_FAIL';

export type TBranchesState = TLoadableState<TTaxRate[]>;

const initialState: TBranchesState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchBranchesAction = TPlainAction<typeof FETCH_BRANCHES>

type FetchBranchesActionSuccess = TPayloadAction<typeof FETCH_BRANCHES_SUCCESS, TTaxRate[]>

type FetchBranchesActionFail = TFailedAction<typeof FETCH_BRANCHES_FAIL>

export type TFetchBranchesActionTypes =
    FetchBranchesAction
    | FetchBranchesActionSuccess
    | FetchBranchesActionFail;

export default function branchesReducer(
    state = initialState,
    action: TFetchBranchesActionTypes,
): TBranchesState {
    switch (action.type) {
    case FETCH_BRANCHES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_BRANCHES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_BRANCHES_FAIL:
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
