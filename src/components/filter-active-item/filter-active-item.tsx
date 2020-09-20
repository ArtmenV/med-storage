import * as React from 'react';
import cx from 'classnames';

import IconButtom from 'medici-ui-kit/components/icon-button';

export interface ActiveItemProps {
    className?: string;
    label: string;
    onCancel: () => void;
}

const ActiveItem = ({
    className,
    label,
    onCancel,
}: ActiveItemProps): JSX.Element => (
    <div className={cx('filters-active-item', className)}>
        {label}
        <IconButtom
            icon="cancel"
            onClick={onCancel}
            className="filters-item-cancel"
        />
    </div>
);

export default ActiveItem;
