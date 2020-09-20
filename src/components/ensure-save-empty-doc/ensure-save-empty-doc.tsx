import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

import Modal from 'medici-ui-kit/components/modal';
import Checkbox from 'medici-ui-kit/components/checkbox';
import Button from 'medici-ui-kit/components/button';

import { ENSURE_SAVE_EMPTY_DOC_COOKIE } from 'constants/general';

type EnsureSaveEmptyDocProps = {
    isOpen: boolean;
    onClickYes: () => void;
    onClickNo: () => void;
}
const EnsureSaveEmptyDoc: React.FC<EnsureSaveEmptyDocProps> = ({
    isOpen,
    onClickYes,
    onClickNo,
}: EnsureSaveEmptyDocProps) => {
    const { t } = useTranslation();
    const [isRefusingChecked, setRefusingChecked] = React.useState(false);
    const isRefusingCookieTrue = (): boolean => (Cookies.get(ENSURE_SAVE_EMPTY_DOC_COOKIE) === 'true');

    const handleClickYes = (): void => {
        if (isRefusingChecked) {
            Cookies.set(ENSURE_SAVE_EMPTY_DOC_COOKIE, 'true');
        }

        onClickYes();
    };

    React.useEffect((): void => {
        if (isOpen && isRefusingCookieTrue()) {
            onClickYes();
        }
    }, [isOpen]);

    if (isRefusingCookieTrue()) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClickNo}
            title=""
            verticalPosition="top"
        >
            <div className="esed">
                <div className="esed__title">
                    {t('ensureSaveEmptyDocTitle')}
                </div>
                <Checkbox
                    className="esed__checkbox"
                    checked={isRefusingChecked}
                    onChange={setRefusingChecked}
                >
                    {t('ensureSaveEmptyDocLabel')}
                </Checkbox>
                <div className="esed__controls">
                    <Button
                        className="esed__controls-first"
                        onClick={handleClickYes}
                    >
                        {t('yes')}
                    </Button>
                    <Button
                        onClick={onClickNo}
                    >
                        {t('no')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EnsureSaveEmptyDoc;
