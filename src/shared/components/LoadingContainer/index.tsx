import * as React from 'react';
import * as styles from './styles.css';
import { LoadingIndicator } from '../LoadingIndicator';

interface LoadingContainerProps {
  size?: string;
}

export const LoadingContainer = ({size}: LoadingContainerProps) => (
  <div className={styles.LoadingContainer}>
    <LoadingIndicator size={size} />
  </div>
);
