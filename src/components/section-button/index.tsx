import * as React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import ICONS, { TButtonIconName } from 'medici-ui-kit/assets/icons';
import './styles.less';

const cssGlobalVars = require('medici-ui-kit/assets/css-global-vars');

export interface SectionButttonProps {
    className?: string;
    icon: TButtonIconName;
    isHasAlerts?: boolean;
    isActive?: boolean;
    label: string;
    onClick: () => void;
    to: string;
}

const SectionButtton = ({
    className,
    icon,
    isHasAlerts,
    label,
    isActive,
    onClick,
    to,
}: SectionButttonProps): JSX.Element => (
    <Link
        className={cx('section-button', className, { 'is-active': isActive })}
        onClick={onClick}
        to={to}
    >
        {React.createElement(ICONS[icon], {
            className: 'section-button__icon',
            style: {
                '--fill-color': isActive ? cssGlobalVars.colorWhite : cssGlobalVars.colorFontPrimary,
            },
        })}
        <div className="section-button__label">
            {label}
        </div>
        {isHasAlerts && (
            <div className="section-button__alert" />
        )}
    </Link>
);

SectionButtton.defaultProps = {
    className: '',
};

export default SectionButtton;
