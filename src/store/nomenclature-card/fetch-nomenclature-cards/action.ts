import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TNomenclatureFullData } from 'types/gists';
import formatNetworkErrors from 'utils/format-network-errors';

import {
    FETCH_NOMENCLATURE_CARDS,
    FETCH_NOMENCLATURE_CARDS_SUCCESS,
    FETCH_NOMENCLATURE_CARDS_FAIL,
    TFetchNomenclatureCardsActionTypes,
} from './reducer';


export default (): ThunkAction<void, TRootState, unknown, TFetchNomenclatureCardsActionTypes> => async (
    dispatch: Dispatch<TFetchNomenclatureCardsActionTypes>,
): Promise<TFetchNomenclatureCardsActionTypes> => {
    dispatch({
        type: FETCH_NOMENCLATURE_CARDS,
    });

    let response;

    try {
        response = await Api.get('/itemCard');
    } catch (e) {
        return dispatch({
            type: FETCH_NOMENCLATURE_CARDS_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: FETCH_NOMENCLATURE_CARDS_SUCCESS,
        payload: (response.data as { list: TNomenclatureFullData[]}).list,
    });
};
