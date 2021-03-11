import * as React from 'react';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import { TareaComodatoForm } from './TareaComodatoForm';

export class TareaComodato extends React.Component {
  render() {
    return (
      <OuterWrapper>
        <TareaComodatoForm />
      </OuterWrapper>
    )
  }
}
