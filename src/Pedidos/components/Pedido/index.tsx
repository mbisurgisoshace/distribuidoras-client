import * as React from 'react';
import { PedidoForm } from '../PedidoForm';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import { RouteComponentProps } from 'react-router-dom';
import { Movimiento as IMovimiento, MovimientoItem as IMovimientoItem } from '../../../types';
import MovimientosService from '../../../services/movimientos';
import * as styles from '../../../Clientes/components/Cliente/styles.css';
import { LoadingIndicator } from '../../../shared/components/LoadingIndicator';

interface RouteProps {
  pedidoId: string;
}

interface PedidoProps extends RouteComponentProps<RouteProps> {

}

interface PedidoState {
  loading: boolean;
  pedido: IMovimiento;
  items: Array<IMovimientoItem>
}

export class Pedido extends React.Component<PedidoProps, PedidoState> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      pedido: null,
      items: []
    }
  }


  async componentDidMount() {
    const movimiento = await MovimientosService.getMovimientosById(parseInt(this.props.match.params.pedidoId));
    this.setState({
      loading: false,
      pedido: movimiento
    })
  }

  render() {
    const {loading, pedido} = this.state;

    return (
      <OuterWrapper>
        {loading && (
          <div className={styles.LoaderWrapper}>
            <LoadingIndicator size="medium" />
          </div>
        )}
        {!loading && (
          <PedidoForm pedido={pedido} />
        )}
      </OuterWrapper>
    )
  }
}
