import Api from 'api';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import formatNetworkErrors from 'utils/format-network-errors';
import { TNomenclatureFullData } from 'types/gists';

import {
    CREATE_NOMENCLATURE,
    CREATE_NOMENCLATURE_SUCCESS,
    CREATE_NOMENCLATURE_FAIL,
    TCreateNomenclatureActionTypes,
    TCreateNomenclatureData,
} from './reducer';


export default (payload: TCreateNomenclatureData): ThunkAction<void, TRootState, unknown, TCreateNomenclatureActionTypes> => async (
    dispatch: Dispatch<TCreateNomenclatureActionTypes>,
): Promise<TCreateNomenclatureActionTypes> => {
    dispatch({
        type: CREATE_NOMENCLATURE,
        payload,
    });

    let response;

    try {
        response = await Api.post('/itemCard/create', payload);
    } catch (e) {
        return dispatch({
            type: CREATE_NOMENCLATURE_FAIL,
            errors: formatNetworkErrors(e),
        });
    }

    return dispatch({
        type: CREATE_NOMENCLATURE_SUCCESS,
        payload: (response.data as { list: TNomenclatureFullData[]}).list[0],
    });
};
