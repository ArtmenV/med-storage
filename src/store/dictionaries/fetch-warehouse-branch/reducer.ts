import {
    TPlainAction,
    TPayloadAction,
    TFailedAction,
    TLoadableState,
} from 'medici-ui-kit/types/helper-types';
import { TWarehouseBranch } from 'types/sales-invoice/warehouse-branch';

export const FETCH_WAREHOUSE_BRANCH = 'FETCH_WAREHOUSE_BRANCH';
export const FETCH_WAREHOUSE_BRANCH_SUCCESS = 'FETCH_WAREHOUSE_BRANCH_SUCCESS';
export const FETCH_WAREHOUSE_BRANCH_FAIL = 'FETCH_WAREHOUSE_BRANCH_FAIL';

export type TWarehouseBranchState = TLoadableState<TWarehouseBranch[]>;

const initialState: TWarehouseBranchState = {
    isLoading: false,
    isLoaded: false,
    errors: [],
    data: [],
};

type FetchWarehouseBranchAction = TPlainAction<typeof FETCH_WAREHOUSE_BRANCH>

type FetchWarehouseBranchActionSuccess = TPayloadAction<typeof FETCH_WAREHOUSE_BRANCH_SUCCESS, TWarehouseBranch[]>

type FetchWarehouseBranchActionFail = TFailedAction<typeof FETCH_WAREHOUSE_BRANCH_FAIL>

export type TFetchWarehouseTypeActionTypes =
    FetchWarehouseBranchAction
  | FetchWarehouseBranchActionSuccess
  | FetchWarehouseBranchActionFail;

export default function financialSourceReducer(
    state = initialState,
    action: TFetchWarehouseTypeActionTypes,
): TWarehouseBranchState {
    switch (action.type) {
    case FETCH_WAREHOUSE_BRANCH:
        return {
            isLoading: true,
            isLoaded: false,
            errors: [],
            data: [],
        };

    case FETCH_WAREHOUSE_BRANCH_SUCCESS:
        return {
            isLoading: false,
            isLoaded: true,
            data: action.payload,
            errors: [],
        };

    case FETCH_WAREHOUSE_BRANCH_FAIL:
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
