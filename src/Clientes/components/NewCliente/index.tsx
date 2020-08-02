import * as React from 'react';
import { ClienteForm } from '../ClienteForm';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

export class NewCliente extends React.Component {
  render() {
    return (
      <OuterWrapper>
        <ClienteForm nuevo={true} />
      </OuterWrapper>
    )
  }
}
