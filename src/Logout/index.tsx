import * as React from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/auth';

export class Logout extends React.Component {
  componentDidMount() {
    AuthService.logout();
  }

  render() {
    return <Redirect to="/" />;
  }
}