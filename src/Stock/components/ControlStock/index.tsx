import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as styles from './styles.css';

import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import { ControlStockForm } from '../ControlStockForm';

export class ControlStock extends React.Component<RouteComponentProps, any> {
  render() {
    const { match } = this.props;

    return (
      <OuterWrapper>
        <div className={styles.ControlStock}>
          <ControlStockForm cierre={match.path === '/stock/cierre'}/>
        </div>
      </OuterWrapper>
    );
  }
}
