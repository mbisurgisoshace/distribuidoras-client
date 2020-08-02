import * as React from 'react';
import * as classnames from 'classnames';

import * as styles from './styles.css';

type IconSize = 'medium' | 'large' | 'small';

export interface IconProps {
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
    size?: IconSize;
    href?: string;
    icon: string;
}

const iconClassname = (
    size: IconSize
): string => classnames(
    styles.Icon,
    {
        [styles.medium]: size === 'medium',
        [styles.large]: size === 'large',
        [styles.small]: size === 'small'
    }
);

export const Icon = ({
    size = 'medium',
    onClick,
    href,
    icon
}: IconProps) => {
    return (
        <div className={iconClassname(size)}>
            {!onClick && !href && (
                <svg>
                    <use xlinkHref={`/assets/images/sprite.svg#icon-${icon}`}></use>
                </svg>
            )}
        </div>
    )
};
