import * as React from 'react';
import { Link } from 'react-router-dom';
import * as classnames from 'classnames';

import * as styles from './styles.css';

interface SidebarGroupProps {
    group: string;
    name: string;
    icon: string;
    match: any;
    href?: string;
    expanded?: boolean;
}

interface SidebarGroupState {
    selected: boolean;
}

export class SidebarGroup extends React.Component<SidebarGroupProps, SidebarGroupState> {
    state = {
        selected: false
    }

    isSelected = (group: string, pathname: string): boolean => {
        if (group === '/' && pathname === '/') return true

        if (group !== '/') {
            if (pathname.includes(group)) return true;
        }

        return false;
    }

    render() {
        const { name, icon, href, expanded, group, match } = this.props;
        const { selected } = this.state;

        const menu = href === undefined ? (
            <div className={classnames(styles.SidebarGroup, expanded ? styles.expanded : styles.collapsed)}>
                <div className={classnames(styles.SidebarGroupTitle, expanded ? styles.expanded : styles.collapsed, this.isSelected(group, match.path) ? styles.selected : '')}>
                    <svg className={styles.SidebarIcon}>
                        <use xlinkHref={`/assets/images/sprite.svg#icon-${icon}`}></use>
                    </svg>
                    {expanded && <p>{name}</p>}
                </div>
                <div className={styles.SidebarGroupItems}>
                    {this.props.children}
                </div>
            </div>
        ) : (
                <div className={classnames(styles.SidebarGroup, expanded ? styles.expanded : styles.collapsed)}>
                    <Link to={href} style={{ textDecoration: 'none' }} >
                        <div className={classnames(styles.SidebarGroupTitle, expanded ? styles.expanded : styles.collapsed, this.isSelected(group, match.path) ? styles.selected : '')}>
                            <svg className={styles.SidebarIcon}>
                                <use xlinkHref={`/assets/images/sprite.svg#icon-${icon}`}></use>
                            </svg>
                            {expanded && <p>{name}</p>}
                        </div>
                    </Link>
                </div>
            )

        return menu;
    }
}