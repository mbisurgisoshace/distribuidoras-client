import * as React from 'react';
import { PedidoForm } from '../PedidoForm';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

export class NewPedido extends React.Component {
  render() {
    return (
      <OuterWrapper>
       <PedidoForm nuevo={true} />
      </OuterWrapper>
    )
  }
}
