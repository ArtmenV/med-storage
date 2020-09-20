import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TConsignor } from 'types/gists';

export const FETCH_CONSIGNORS = 'FETCH_CONSIGNORS';
export const FETCH_CONSIGNORS_SUCCESS = 'FETCH_CONSIGNORS_SUCCESS';
export const FETCH_CONSIGNORS_FAIL = 'FETCH_CONSIGNORS_FAIL';

export type TConsignorsState = TLoadableState<TConsignor[]>;

const initialState: TConsignorsState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchConsignorsAction = TPlainAction<typeof FETCH_CONSIGNORS>

type FetchConsignorsActionSuccess = TPayloadAction<typeof FETCH_CONSIGNORS_SUCCESS, TConsignor[]>

type FetchConsignorsActionFail = TFailedAction<typeof FETCH_CONSIGNORS_FAIL>

export type TFetchConsignorsActionTypes =
    FetchConsignorsAction
    | FetchConsignorsActionSuccess
    | FetchConsignorsActionFail;

export default function consignorsReducer(
    state = initialState,
    action: TFetchConsignorsActionTypes,
): TConsignorsState {
    switch (action.type) {
    case FETCH_CONSIGNORS:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_CONSIGNORS_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_CONSIGNORS_FAIL:
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
