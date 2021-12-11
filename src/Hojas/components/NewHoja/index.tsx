import * as React from 'react';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import { HojaForm } from '../HojaForm';
import { RouteComponentProps } from 'react-router-dom';

export class NewHoja extends React.Component<RouteComponentProps<any>> {
  onNuevaHoja = () => {
    this.props.history.push('/hojas')
  }

  render() {
    return (
      <OuterWrapper>
        <HojaForm nuevo={true} onNueva={this.onNuevaHoja} />
      </OuterWrapper>
    )
  }
}
