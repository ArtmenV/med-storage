import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TConsignorsState } from './reducer';

export default (): TConsignorsState => {
    const consignorsState = useSelector((state: TRootState): TConsignorsState => state.dictionaries.consignors);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(consignorsState.isLoaded || consignorsState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return consignorsState;
};
