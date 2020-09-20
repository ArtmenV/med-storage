import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TWarehouseBranchState } from './reducer';

export default (): TWarehouseBranchState => {
    const warehouseBranchState = useSelector((state: TRootState): TWarehouseBranchState => state.dictionaries.warehouseBranch);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(warehouseBranchState.isLoaded || warehouseBranchState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return warehouseBranchState;
};
