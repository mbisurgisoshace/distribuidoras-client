import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import * as styles from './styles.css';
import { Comercio as IComercio } from '../../../types';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import ClientesService from '../../../services/clientes';
import { ComercioForm } from '../ComercioForm';
import { LoadingIndicator } from '../../../shared/components/LoadingIndicator';
import ComerciosService from '../../../services/comercios';

interface RouteProps {
  comercioId: string;
}

interface ComercioProps extends RouteComponentProps<RouteProps> {

}

interface ComercioState {
  loading: boolean;
  comercio: IComercio;
}

export class Comercio extends React.Component<ComercioProps, ComercioState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      comercio: null
    }
  }

  async componentDidMount() {
    const comercio = await ComerciosService.getComercio(parseInt(this.props.match.params.comercioId));

    this.setState({ comercio, loading: false });
  }

  render() {
    const { comercio, loading } = this.state;

    return (
      <OuterWrapper>
        {loading && (
          <div className={styles.LoaderWrapper}>
            <LoadingIndicator size="medium" />
          </div>
        )}
        {!loading && (
          <ComercioForm comercio={comercio} />
        )}
      </OuterWrapper>
    );
  }
}
