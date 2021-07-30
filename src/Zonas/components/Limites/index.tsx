import * as React from 'react';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import * as styles from './styles.css';
import { LimitesMap } from './LimitesMap';

export class Limites extends React.Component<any, any> {
  render() {
    return (
      <OuterWrapper>
        <div className={styles.LimitesContainer}>
          <div className={styles.ZonasList}>

          </div>
          <LimitesMap />
        </div>
      </OuterWrapper>
    )
  }
}
