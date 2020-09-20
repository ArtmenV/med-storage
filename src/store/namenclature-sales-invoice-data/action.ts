import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TRootState } from 'store/root-reducer';
import { TStorageSelectData } from 'types/sales-invoice/storage';

import {
    ADD_NAMENCLATURE,
    AddNomenclatureActionSuccess,
} from './reducer';

export default (data: TStorageSelectData[]): ThunkAction<void, TRootState, unknown, AddNomenclatureActionSuccess> => async (
    dispatch: Dispatch<AddNomenclatureActionSuccess>,
): Promise<AddNomenclatureActionSuccess> => dispatch({
    type: ADD_NAMENCLATURE,
    payload: data,
});
