import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TBranchesState } from './reducer';

export default (): TBranchesState => {
    const branchesState = useSelector((state: TRootState): TBranchesState => state.dictionaries.branches);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(branchesState.isLoaded || branchesState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return branchesState;
};
