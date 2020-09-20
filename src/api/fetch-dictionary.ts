import Api from 'api';
import mapIdNameToValueLabel from 'medici-ui-kit/utils/map-id-name-to-value-label';
import { TDropdownOption } from 'medici-ui-kit/components/dropdown';
import { TIdNameRecord } from 'medici-ui-kit/types/data-types';

export default (endpoint: string) => async (): Promise<TDropdownOption[]> => {
    let response;
    try {
        response = await Api.get(endpoint);
    } catch (e) {
        throw new Error(`Can\`t get ${endpoint}`);
    }

    return mapIdNameToValueLabel((response.data as { list: TIdNameRecord[]}).list);
};
