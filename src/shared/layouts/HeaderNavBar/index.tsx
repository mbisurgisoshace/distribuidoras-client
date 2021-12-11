import * as React from 'react';
import { Link } from 'react-router-dom';
import { configureToastContainer } from '../../components/ToastNotification';

import { NavigationBar } from '../NavigationBar';
import { Slide, toast, ToastContainer } from 'react-toastify';

export const enhanceWithHeader = WrappedComponent => {
    return class WithHeader extends React.Component {
        render() {
            return (
                <NavigationBar.Container>
                    {/*{configureToastContainer()}*/}
                    <ToastContainer
                      position={toast.POSITION.BOTTOM_RIGHT}
                      transition={Slide}
                      draggable={false}
                      autoClose={3000}
                      hideProgressBar={true}
                    />
                    <NavigationBar />
                    <WrappedComponent {...this.props} />
                </NavigationBar.Container>
            )
        }
    }
}
