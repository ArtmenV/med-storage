import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TTaxRate } from 'types/gists';

export const FETCH_TAX_RATES = 'FETCH_TAX_RATES';
export const FETCH_TAX_RATES_SUCCESS = 'FETCH_TAX_RATES_SUCCESS';
export const FETCH_TAX_RATES_FAIL = 'FETCH_TAX_RATES_FAIL';

export type TTaxRatesState = TLoadableState<TTaxRate[]>;

const initialState: TTaxRatesState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchTaxRatesAction = TPlainAction<typeof FETCH_TAX_RATES>

type FetchTaxRatesActionSuccess = TPayloadAction<typeof FETCH_TAX_RATES_SUCCESS, TTaxRate[]>

type FetchTaxRatesActionFail = TFailedAction<typeof FETCH_TAX_RATES_FAIL>

export type TFetchTaxRatesActionTypes =
    FetchTaxRatesAction
    | FetchTaxRatesActionSuccess
    | FetchTaxRatesActionFail;

export default function taxRatesReducer(
    state = initialState,
    action: TFetchTaxRatesActionTypes,
): TTaxRatesState {
    switch (action.type) {
    case FETCH_TAX_RATES:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_TAX_RATES_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_TAX_RATES_FAIL:
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
