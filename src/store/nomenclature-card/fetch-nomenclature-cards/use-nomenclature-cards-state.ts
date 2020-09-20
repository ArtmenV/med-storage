import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from 'store/root-reducer';

import fetchAction from './action';
import { TNomenclatureCardsState } from './reducer';

export default (): TNomenclatureCardsState => {
    const nomenclaturesStates = useSelector((state: TRootState): TNomenclatureCardsState => state.nomenclatureCards);
    const dispatch = useDispatch();

    React.useEffect((): void => {
        if (!(nomenclaturesStates.isLoaded || nomenclaturesStates.isLoading)) {
            dispatch(fetchAction());
        }
    }, []);

    return nomenclaturesStates;
};
