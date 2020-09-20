import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TStoreReasonsState } from './reducer';

export default (): TStoreReasonsState => {
    const storeReasonsState = useSelector((state: TRootState): TStoreReasonsState => state.dictionaries.storeReasons);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(storeReasonsState.isLoaded || storeReasonsState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return storeReasonsState;
};
