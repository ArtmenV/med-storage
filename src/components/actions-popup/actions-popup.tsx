import * as React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import Shape from 'medici-ui-kit/components/shape';
import IconButton from 'medici-ui-kit/components/icon-button';

interface ActionsPopupProps {
    onOpen?: () => void;
    onTransact?: () => void;
    onEdit?: () => void;
    onRemove?: () => void;
    onPrint?: () => void;
    className?: string;
}

const ActionsPopup: React.FunctionComponent<ActionsPopupProps> = ({
    onOpen,
    onTransact,
    onEdit,
    onRemove,
    onPrint,
    className,
}: ActionsPopupProps) => {
    const { t } = useTranslation();
    const wrapperRef = React.useRef(null);
    const [isPopupOpened, setPopupOpened] = React.useState(false);
    const handleToggleOpened = React.useCallback((e: React.MouseEvent): void => {
        e.stopPropagation();
        setPopupOpened(!isPopupOpened);
    }, [isPopupOpened]);

    const onClickOutsideClose = React.useCallback((event: any): void => {
        const closestWrapper = event.target.closest('.actions-popup');

        if (!(wrapperRef.current && closestWrapper && wrapperRef.current === closestWrapper)) {
            setPopupOpened(false);
        }
    }, []);


    React.useEffect(() => {
        document.body.addEventListener('click', onClickOutsideClose);
        return (): void => {
            document.body.removeEventListener('click', onClickOutsideClose);
        };
    }, []);

    return (
        <div
            className={cx('actions-popup', className)}
            ref={wrapperRef}
        >
            <IconButton
                icon="action"
                onClick={handleToggleOpened}
            />
            {isPopupOpened && (
                <Shape
                    className="actions-popup__popup"
                    onClick={handleToggleOpened}
                >
                    {!!onOpen && (
                        <div
                            className="actions-popup__action"
                            onClick={onOpen}
                        >
                            <IconButton
                                icon="file"
                                className="actions-popup__icon"
                            />
                            <span className="actions-popup__label">{t('open')}</span>
                        </div>
                    )}
                    {!!onTransact && (
                        <div
                            className="actions-popup__action"
                            onClick={onTransact}
                        >
                            <IconButton
                                icon="proceed"
                                className="actions-popup__icon"
                            />
                            <span className="actions-popup__label">{t('transactDocument')}</span>
                        </div>
                    )}
                    {!!onEdit && (
                        <div
                            className="actions-popup__action"
                            onClick={onEdit}
                        >
                            <IconButton
                                icon="edit"
                                className="actions-popup__icon"
                            />
                            <span className="actions-popup__label">{t('edit')}</span>
                        </div>
                    )}
                    {!!onRemove && (
                        <div
                            className="actions-popup__action"
                            onClick={onRemove}
                        >
                            <IconButton
                                icon="thrash_can"
                                className="actions-popup__icon"
                            />
                            <span className="actions-popup__label">{t('remove')}</span>
                        </div>
                    )}
                    {!!onPrint && (
                        <div
                            className="actions-popup__action"
                            onClick={onPrint}
                        >
                            <IconButton
                                icon="print"
                                className="actions-popup__icon"
                            />
                            <span className="actions-popup__label">{t('print')}</span>
                        </div>
                    )}
                </Shape>
            )}
        </div>
    );
};

export default ActionsPopup;
