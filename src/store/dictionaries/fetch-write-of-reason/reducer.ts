/* eslint-disable indent */
import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TWriteOfReason } from 'types/sales-invoice/write-reason';

export const FETCH_WRITE_OF_REASON = 'FETCH_WRITE_OF_REASON';
export const FETCH_WRITE_OF_REASON_SUCCESS = 'FETCH_WRITE_OF_REASON_SUCCESS';
export const FETCH_WRITE_OF_REASON_FAIL = 'FETCH_WRITE_OF_REASON_FAIL';

export type TWriteOfReasonTypeState = TLoadableState<TWriteOfReason[]>;

const initialState: TWriteOfReasonTypeState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchWriteOfReasonAction = TPlainAction<typeof FETCH_WRITE_OF_REASON>

type FetchWriteOfReasonActionSuccess = TPayloadAction<typeof FETCH_WRITE_OF_REASON_SUCCESS, TWriteOfReason[]>

type FetchWriteOfReasonActionFail = TFailedAction<typeof FETCH_WRITE_OF_REASON_FAIL>

export type TFetchWriteOfReasonTypeActionTypes =
    FetchWriteOfReasonAction
    | FetchWriteOfReasonActionSuccess
    | FetchWriteOfReasonActionFail;

export default function financialSourceReducer(
    state = initialState,
    action: TFetchWriteOfReasonTypeActionTypes,
): TWriteOfReasonTypeState {
    switch (action.type) {
        case FETCH_WRITE_OF_REASON:
            return {
                isLoading: true,
                isLoaded: false,
                errors: [],
                data: [],
            };

        case FETCH_WRITE_OF_REASON_SUCCESS:
            return {
                isLoading: false,
                isLoaded: true,
                data: action.payload,
                errors: [],
            };

        case FETCH_WRITE_OF_REASON_FAIL:
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
