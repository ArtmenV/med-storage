import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TStorageState } from './reducer';

export default (): TStorageState => {
    const storageState = useSelector((state: TRootState): TStorageState => state.dictionaries.storageSalesInvoice);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(storageState.isLoaded || storageState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return storageState;
};
