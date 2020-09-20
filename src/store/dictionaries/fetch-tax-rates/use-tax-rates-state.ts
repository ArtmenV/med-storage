import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TTaxRatesState } from './reducer';

export default (): TTaxRatesState => {
    const taxRatesState = useSelector((state: TRootState): TTaxRatesState => state.dictionaries.taxRates);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(taxRatesState.isLoaded || taxRatesState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return taxRatesState;
};
