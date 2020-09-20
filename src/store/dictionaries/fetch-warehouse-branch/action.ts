// import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';

import { TRootState } from 'store/root-reducer';
import { TWarehouseBranch } from 'types/sales-invoice/warehouse-branch';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_WAREHOUSE_BRANCH,
    FETCH_WAREHOUSE_BRANCH_SUCCESS,
    FETCH_WAREHOUSE_BRANCH_FAIL,
    TFetchWarehouseTypeActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchWarehouseTypeActionTypes> => async (
    dispatch: Dispatch<TFetchWarehouseTypeActionTypes>,
): Promise<TFetchWarehouseTypeActionTypes> => {
    dispatch({
        type: FETCH_WAREHOUSE_BRANCH,
    });

    let response;

    try {
        const data = await axios.get('http://test3.biopicmedical.com/api/v1/enterprise/getEnterpriseData');
        response = data.data.records.map((item: TWarehouseBranch) => (
            { id: +item.id, name: item.name }
        ));
    } catch (e) {
        return dispatch({
            type: FETCH_WAREHOUSE_BRANCH_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_WAREHOUSE_BRANCH_SUCCESS,
        payload: (response),
    });
};
