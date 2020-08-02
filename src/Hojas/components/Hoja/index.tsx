import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import * as styles from './styles.css';

import { Hoja as IHoja } from '../../../types';

import { LoadingIndicator } from '../../../shared/components/LoadingIndicator';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import HojasService from '../../../services/hojas';
import { HojaForm } from '../HojaForm';

interface RouteProps {
  hojaId: string;
}

interface HojaProps extends RouteComponentProps<RouteProps> {

}

interface HojaState {
  loading: boolean;
  hoja: IHoja;
}

export class Hoja extends React.Component<HojaProps, HojaState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hoja: null
    }
  }

  async componentDidMount() {
    const hoja = await HojasService.getHoja(parseInt(this.props.match.params.hojaId));

    this.setState({ hoja, loading: false });
  }

  render() {
    const { hoja, loading } = this.state;

    return (
      <OuterWrapper>
        {loading && (
          <div className={styles.LoaderWrapper}>
            <LoadingIndicator size="medium" />
          </div>
        )}
        {!loading && (
          <HojaForm hoja={hoja} />
        )}
      </OuterWrapper>
    );
  }
}
