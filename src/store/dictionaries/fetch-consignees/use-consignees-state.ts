import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TConsigneesState } from './reducer';

export default (): TConsigneesState => {
    const consigneesState = useSelector((state: TRootState): TConsigneesState => state.dictionaries.consignees);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(consigneesState.isLoaded || consigneesState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return consigneesState;
};
