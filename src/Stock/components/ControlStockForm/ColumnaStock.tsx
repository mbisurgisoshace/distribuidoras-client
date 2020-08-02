import * as React from 'react';
import * as styles from './styles.css';

import {ColumnaStock as IColumnaStock} from '../../../types';

interface ColumnaStockProps {
  column: IColumnaStock;
  control: boolean;
  showDetalle: () => void
}


export class ColumnaStock extends React.Component<ColumnaStockProps, any> {
  render() {
    const {column, control, showDetalle} = this.props;
    return (
      <div className={styles.ColumnaStock}>
        <div className={styles.label}>
          {column.label}
        </div>
        <div className={styles.check} style={{color: control ? 'rgba(106, 176, 76, 1)' : 'rgba(235, 77, 75, 1)'}}>
          {control ? <i className="fas fa-check" /> : <i className="fas fa-times" />}
        </div>
        <div className={styles.search}>
          <i className="fas fa-search" onClick={showDetalle} />
        </div>
      </div>
    )
  }
}
