import * as React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import Shape from 'medici-ui-kit/components/shape';

import SectionButton from 'components/section-button';
import { ROOT_APP_PATH } from 'constants/general';

import './styles.less';

type TSectionNames = 'purchaseInvoice' | 'salesInvoice' | 'reports' | 'inventory'
    | 'storage' | 'orders' | 'enteringBalance' | 'drugLabeling' | undefined;

export interface SectionBarProps {
    className?: string;
    activeSection: TSectionNames;
}

const SectionBar = ({
    className,
    activeSection,
}: SectionBarProps): JSX.Element => {
    const { t } = useTranslation();
    const handleClickButton = (): void => undefined;

    return (
        <Shape className={cx('sections-plate', className)}>
            <SectionButton
                label={t('purchaseInvoice.label')}
                onClick={handleClickButton}
                icon="file_dollar"
                isActive={activeSection === 'purchaseInvoice'}
                to={`${ROOT_APP_PATH}/purchase_invoice`}
            />
            <SectionButton
                label={t('salesInvoice')}
                onClick={handleClickButton}
                icon="file"
                isActive={activeSection === 'salesInvoice'}
                to={`${ROOT_APP_PATH}/sales_invoice`}
            />
            <SectionButton
                label={t('reports')}
                onClick={handleClickButton}
                icon="book"
                isActive={activeSection === 'reports'}
                to={`${ROOT_APP_PATH}/reports`}
            />
            <SectionButton
                label={t('inventory')}
                onClick={handleClickButton}
                icon="file_text"
                isActive={activeSection === 'inventory'}
                to={`${ROOT_APP_PATH}/inventory`}
            />
            <SectionButton
                label={t('storage')}
                onClick={handleClickButton}
                icon="warehouse"
                isActive={activeSection === 'storage'}
                to={`${ROOT_APP_PATH}/storage`}
            />
            <SectionButton
                label={t('orders')}
                onClick={handleClickButton}
                icon="shopping"
                isActive={activeSection === 'orders'}
                to={`${ROOT_APP_PATH}/orders`}
            />
            <SectionButton
                label={t('enteringBalance')}
                onClick={handleClickButton}
                icon="inbox"
                isActive={activeSection === 'enteringBalance'}
                to={`${ROOT_APP_PATH}/entering_balance`}
            />
            <SectionButton
                label={t('drugLabeling')}
                onClick={handleClickButton}
                icon="barcode"
                isActive={activeSection === 'drugLabeling'}
                to={`${ROOT_APP_PATH}/drug_labeling`}
            />
        </Shape>
    );
};

SectionBar.defaultProps = {
    className: '',
};

export default SectionBar;
