import * as React from 'react';
import get from 'lodash/get';

import { useTranslation } from 'react-i18next';
import { ValidatorNames } from 'medici-ui-kit/types/data-types';

export default (): (errorObject?: object) => string => {
    const { t } = useTranslation();

    const getErrorMessage = React.useCallback((errorObject?: object): string => {
        switch (get(errorObject, 'type')) {
        case ValidatorNames.positiveNumber: return t('formErrors.positiveNumber');
        case ValidatorNames.required: return t('formErrors.require');
        default: return '';
        }
    }, []);

    return getErrorMessage;
};
