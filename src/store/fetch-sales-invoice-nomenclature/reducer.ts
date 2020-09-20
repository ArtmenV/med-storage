import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TNamenclatureCard } from '../../types/sales-invoice/sales-invoice';

export const FETCH_NOMENCLATURE_SALES_INVOICE_CARDS = 'FETCH_NOMENCLATURE_SALES_INVOICE_CARDS';
export const FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_SUCCESS = 'FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_SUCCESS';
export const FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_FAIL = 'FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_FAIL';

export type TNomenclatureCardsState = TLoadableState<TNamenclatureCard[]>;

const initialState: TNomenclatureCardsState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchNomenclatureCardsAction = TPlainAction<typeof FETCH_NOMENCLATURE_SALES_INVOICE_CARDS>

type FetchNomenclatureCardsActionSuccess = TPayloadAction<typeof FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_SUCCESS, TNamenclatureCard[]>

type FetchNomenclatureCardsActionFail = TFailedAction<typeof FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_FAIL>

export type TFetchNomenclatureCardsActionTypes =
    FetchNomenclatureCardsAction
    | FetchNomenclatureCardsActionSuccess
    | FetchNomenclatureCardsActionFail;

export default function financialSourceReducer(
    state = initialState,
    action: TFetchNomenclatureCardsActionTypes,
): TNomenclatureCardsState {
    switch (action.type) {
    case FETCH_NOMENCLATURE_SALES_INVOICE_CARDS:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_SUCCESS:
        return {
            isLoading: false,
            data: action.payload,
            isLoaded: true,
            errors: [],
        };

    case FETCH_NOMENCLATURE_SALES_INVOICE_CARDS_FAIL:
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
