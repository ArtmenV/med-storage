/* eslint-disable indent */
import {
    TPayloadAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TStorageSelectData } from 'types/sales-invoice/storage';

export const ADD_NAMENCLATURE = 'ADD_NAMENCLATURE';

export type TNameclatureTypeState = TLoadableState<TStorageSelectData[]>;

const initialState: TNameclatureTypeState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

export type AddNomenclatureActionSuccess = TPayloadAction<typeof ADD_NAMENCLATURE, TStorageSelectData[]>

export default function financialSourceReducer(
    state = initialState,
    action: AddNomenclatureActionSuccess,
): TNameclatureTypeState {
    switch (action.type) {
        case ADD_NAMENCLATURE:
            return {
                isLoading: true,
                isLoaded: false,
                errors: [],
                data: action.payload,
            };
        default:
            return state;
    }
}
