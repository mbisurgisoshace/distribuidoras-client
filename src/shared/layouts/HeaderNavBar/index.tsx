import * as React from 'react';
import { Link } from 'react-router-dom';

import { NavigationBar } from '../NavigationBar';

export const enhanceWithHeader = WrappedComponent => {
    return class WithHeader extends React.Component {
        render() {
            return (
                <NavigationBar.Container>
                    <NavigationBar />
                    <WrappedComponent {...this.props} />
                </NavigationBar.Container> 
            )
        }
    }
}