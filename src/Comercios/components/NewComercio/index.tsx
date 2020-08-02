import * as React from 'react';
import { ComercioForm } from '../ComercioForm';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

export class NewComercio extends React.Component {
  render() {
    return (
      <OuterWrapper>
        <ComercioForm nuevo={true} />
      </OuterWrapper>
    )
  }
}
