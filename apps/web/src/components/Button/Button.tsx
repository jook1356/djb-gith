'use client';

import React from 'react';
import styles from './Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  theme?: 'primary' | 'modern' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}


export function Button({ 
  children, 
  theme = 'primary',
  size = 'medium',
  ...rest
}: Props) {

  return (
    <button
      
      {...rest}
      className={`${styles[`button-${theme}`]} ${styles[`button-size-${size}`]} ${rest.className}`}
    >
      {children}
    </button>
  );
}
