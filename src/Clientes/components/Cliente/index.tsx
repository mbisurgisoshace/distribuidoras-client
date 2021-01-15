import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import * as styles from './styles.css';
import { Cliente as ICliente, UltimoPedidoView as IUltimoPedidoView, UltimoComodatoView as IUltimoComodatoView } from '../../../types';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import ClientesService from '../../../services/clientes';
import { ClienteForm } from '../ClienteForm';
import { LoadingIndicator } from '../../../shared/components/LoadingIndicator';

interface RouteProps {
  clienteId: string;
}

interface ClienteProps extends RouteComponentProps<RouteProps> {

}

interface ClienteState {
  loading: boolean;
  cliente: ICliente;
  ultimoPedido: IUltimoPedidoView;
  ultimoComodato: IUltimoComodatoView;
}

export class Cliente extends React.Component<ClienteProps, ClienteState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      cliente: null,
      ultimoPedido: null,
      ultimoComodato: null
    }
  }

  async componentDidMount() {
    const cliente = await ClientesService.getCliente(parseInt(this.props.match.params.clienteId));
    let ultimoPedido = null;
    let ultimoComodato = null;
    if (cliente) {
      try {
        ultimoPedido = await ClientesService.getLastPedidoCliente(parseInt(this.props.match.params.clienteId));

      } catch (e) {
        ultimoPedido = null;
      }

      try {
        ultimoComodato = await ClientesService.getLastComodatoCliente(parseInt(this.props.match.params.clienteId));
      } catch (e) {
        ultimoComodato = null;
      }
    }
    this.setState({ cliente, ultimoPedido, ultimoComodato, loading: false });
  }

  render() {
    const { cliente, ultimoPedido, ultimoComodato, loading } = this.state;

    return (
      <OuterWrapper>
        {loading && (
          <div className={styles.LoaderWrapper}>
            <LoadingIndicator size="medium" />
          </div>
        )}
        {!loading && (
          <ClienteForm cliente={cliente} ultimoPedido={ultimoPedido} ultimoComodato={ultimoComodato}/>
        )}
      </OuterWrapper>
    );
  }
}
