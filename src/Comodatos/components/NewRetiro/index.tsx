import * as React from 'react';
import { RetiroForm } from '../RetiroForm';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

export class NewRetiro extends React.Component {
  render() {
    return (
      <OuterWrapper>
        <RetiroForm />
      </OuterWrapper>
    )
  }
}
