import * as React from 'react';
import { Link } from 'react-router-dom';
import * as classnames from 'classnames';

import * as styles from './styles.css';
import { MenuItem } from '../../../types/Sidebar';

interface SidebarMenuProps {
    menuitems: MenuItem[];
    title: string;
    group: string;
    match: any;
    expanded?: boolean;
}

interface SidebarMenuState {
    selected: boolean;
}

export class SidebarMenu extends React.Component<SidebarMenuProps, SidebarMenuState> {
    state = {
        selected: false
    };

    isSelected = (group: string, subgroup: string, pathname: string) => {
        if (pathname.includes(group) && pathname.includes(subgroup)) return true;

        return false;
    };

    render() {
        const { group, expanded, match } = this.props;
        const { selected } = this.state;

        return (
            <div className={styles.SidebarMenu}>
                {!expanded && (<div style={{ padding: '0 1rem', height: '52px', display: 'flex', alignItems: 'center' }}>{this.props.title}</div>)}
                {this.props.menuitems.map((m, i) => {
                    return (
                        <div key={i} className={classnames(styles.SidebarMenuItem, expanded ? styles.expanded : styles.collapsed, this.isSelected(group, m.subgroup, match.path) ? styles.selected : '')}>
                            <Link to={m.href}>
                                {m.title}
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}