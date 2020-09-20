import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TWriteOfReasonTypeState } from './reducer';

export default (): TWriteOfReasonTypeState => {
    const writeOfReasonState = useSelector((state: TRootState): TWriteOfReasonTypeState => state.dictionaries.writeOfReason);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(writeOfReasonState.isLoaded || writeOfReasonState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return writeOfReasonState;
};
