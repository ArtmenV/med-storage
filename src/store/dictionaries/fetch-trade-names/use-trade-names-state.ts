import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TTradeNamesState } from './reducer';

export default (): TTradeNamesState => {
    const tradeNamesState = useSelector((state: TRootState): TTradeNamesState => state.dictionaries.tradeNames);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(tradeNamesState.isLoaded || tradeNamesState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return tradeNamesState;
};
