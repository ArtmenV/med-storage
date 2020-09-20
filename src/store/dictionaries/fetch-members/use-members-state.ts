import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TMembersState } from './reducer';

export default (): TMembersState => {
    const membersState = useSelector((state: TRootState): TMembersState => state.dictionaries.members);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(membersState.isLoaded || membersState.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return membersState;
};
