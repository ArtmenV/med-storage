import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TWarehousesState } from './reducer';

export default (): TWarehousesState => {
    const warehousesState = useSelector((state: TRootState): TWarehousesState => state.dictionaries.warehouses);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(warehousesState.isLoaded || warehousesState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return warehousesState;
};
