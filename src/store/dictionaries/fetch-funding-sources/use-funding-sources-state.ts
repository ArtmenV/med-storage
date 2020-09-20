import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TFundingSourcesState } from './reducer';

export default (): TFundingSourcesState => {
    const fundingSourcesState = useSelector((state: TRootState): TFundingSourcesState => state.dictionaries.fundingSources);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(fundingSourcesState.isLoaded || fundingSourcesState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return fundingSourcesState;
};
