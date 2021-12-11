import React from 'react';

import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IToastProps {
  onCancel: () => void;
  onProceed: () => void;
  config: IToasterConfig;
  iconClassName?: string;
  proceedButtonText?: string;
  cancelButtonText?: string;
}

interface IToasterConfig {
  header: string;
  description?: string;
  showProceed?: boolean;
  showCancel?: boolean;
  proceedButtonText?: string;
}

export const configureToastContainer = () => {
  return (
    <ToastContainer
      position={toast.POSITION.BOTTOM_CENTER}
      transition={Slide}
      draggable={false}
      autoClose={3000}
      hideProgressBar={true}
  />
)};

const toastNotify = {
  success: (config: IToasterConfig) => {
    return toast.success(config.header, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  },
  error: (config: IToasterConfig) => {
    return toast.error(config.header, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  },
};

export default toastNotify;
