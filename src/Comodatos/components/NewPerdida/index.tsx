import * as React from 'react';
import { PerdidaForm } from '../PerdidaForm';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

export class NewPerdida extends React.Component {
  render() {
    return (
      <OuterWrapper>
        <PerdidaForm />
      </OuterWrapper>
    )
  }
}
