import { TNetworkError } from 'medici-ui-kit/types/helper-types';

export default (e: any): TNetworkError[] => {
    const serverMessages = e?.response?.data?.errors;

    if (typeof serverMessages === 'string') {
        return [{
            code: '0',
            message: serverMessages,
        }];
    }

    const response = e?.response;

    if (response) {
        return [{
            code: response.status,
            message: response.statusText,
        }];
    }

    return [{
        code: '0',
        message: 'Unknown network error, please, check your internet connection',
    }];
};
