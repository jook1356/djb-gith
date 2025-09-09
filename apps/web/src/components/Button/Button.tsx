'use client';

import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  theme?: 'primary';
}

type ButtonTheme = 'primary'

export function Button({ 
  children, 
  theme = 'primary',
  ...rest
}: Props) {

  return (
    <button
      className={`button-${theme}`}
      {...rest}
    >
      {children}
    </button>
  );
}
