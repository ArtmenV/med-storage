import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TTaxRate } from 'types/gists';

export const FETCH_MEMBERS = 'FETCH_MEMBERS';
export const FETCH_MEMBERS_SUCCESS = 'FETCH_MEMBERS_SUCCESS';
export const FETCH_MEMBERS_FAIL = 'FETCH_MEMBERS_FAIL';

export type TMembersState = TLoadableState<TTaxRate[]>;

const initialState: TMembersState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchMembersAction = TPlainAction<typeof FETCH_MEMBERS>

type FetchMembersActionSuccess = TPayloadAction<typeof FETCH_MEMBERS_SUCCESS, TTaxRate[]>

type FetchMembersActionFail = TFailedAction<typeof FETCH_MEMBERS_FAIL>

export type TFetchMembersActionTypes =
    FetchMembersAction
    | FetchMembersActionSuccess
    | FetchMembersActionFail;

export default function membersReducer(
    state = initialState,
    action: TFetchMembersActionTypes,
): TMembersState {
    switch (action.type) {
    case FETCH_MEMBERS:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_MEMBERS_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_MEMBERS_FAIL:
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
