import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';

export const FETCH_TRADE_NAMES = 'FETCH_TRADE_NAMES';
export const FETCH_TRADE_NAMES_SUCCESS = 'FETCH_TRADE_NAMES_SUCCESS';
export const FETCH_TRADE_NAMES_FAIL = 'FETCH_TRADE_NAMES_FAIL';

export type TTradeNamesState = TLoadableState<TIdNameRecord[]>;

const initialState: TTradeNamesState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchTradeNamesAction = TPlainAction<typeof FETCH_TRADE_NAMES>

type FetchTradeNamesActionSuccess = TPayloadAction<typeof FETCH_TRADE_NAMES_SUCCESS, TIdNameRecord[]>

type FetchTradeNamesActionFail = TFailedAction<typeof FETCH_TRADE_NAMES_FAIL>

export type TFetchTradeNamesActionTypes =
    FetchTradeNamesAction
    | FetchTradeNamesActionSuccess
    | FetchTradeNamesActionFail;

export default function tradeNamesReducer(
    state = initialState,
    action: TFetchTradeNamesActionTypes,
): TTradeNamesState {
    switch (action.type) {
    case FETCH_TRADE_NAMES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_TRADE_NAMES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_TRADE_NAMES_FAIL:
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
