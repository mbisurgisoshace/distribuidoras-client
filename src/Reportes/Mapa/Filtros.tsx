import * as React from 'react';
import * as styles from './styles.css';
import { Canal, Chofer, Cliente, CondicionVenta } from '../../types';
import CanalesService from '../../services/canales';
import { Select } from '../../shared/components/Select';
import { Button } from '../../shared/components/Button';

interface FiltrosProps {
  onSearch: (currFilter) => void;
}

interface FiltrosState {
  currFilter: any;
  canales: Array<Canal>;
}

export default class Filtros extends React.Component<FiltrosProps, FiltrosState> {
  constructor(props) {
    super(props);

    this.state = {
      canales: [],
      currFilter: {}
    };
  }

  async componentDidMount() {
    const canales = await CanalesService.getCanales();
    this.setState({
      canales
    });
  }

  onOptionChange = (e) => {
    this.setState({
      currFilter: {
        ...this.state.currFilter,
        [e.target.name]: e.target.value
      }
    });
  };

  render() {
    const { canales, currFilter } = this.state;

    const canalesOptions = canales.map(c => ({
      label: c.canal_nombre,
      value: c.canal_id
    }));

    return (
      <div className={styles.FiltrosContainer}>
        <div className={styles.FiltrosItem}>
          <Select
            multiple
            size={'small'}
            name={'canal'}
            label={'Canal'}
            options={canalesOptions}
            onChange={this.onOptionChange}
            value={currFilter.canal || []}
          />
          <Button
            size={'small'}
            onClick={() => this.props.onSearch(currFilter)}
          >
            Filtrar
          </Button>
        </div>
      </div>
    )
  }
}
