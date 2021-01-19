import * as React from 'react';
import { ComodatoForm } from '../ComodatoForm';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

export class NewComodato extends React.Component {
  render() {
    return (
      <OuterWrapper>
       <ComodatoForm />
      </OuterWrapper>
    )
  }
}
