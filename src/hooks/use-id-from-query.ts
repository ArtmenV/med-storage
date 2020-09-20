import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import isNumber from 'medici-ui-kit/utils/is-number';

export default (): number | undefined => {
    const history = useHistory();
    const result = Number(queryString.parse(history.location.search).id);

    return isNumber(result) ? result : undefined;
};
