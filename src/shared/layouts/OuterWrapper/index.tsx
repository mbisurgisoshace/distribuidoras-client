import * as React from 'react';
import { withRouter } from 'react-router-dom';

import * as styles from './styles.css';
import { Sidebar } from '../Sidebar';

class OuterWrapper extends React.Component<any, any> {
    render() {
        return (
            <div className={styles.OuterWrapper}>
                <Sidebar history={this.props.history} location={this.props.location} match={this.props.match} />
                {this.props.children}
            </div>
        )
    }
};

export const RoutedOuterWrapper = withRouter(OuterWrapper);