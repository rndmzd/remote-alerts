import React from 'react';
import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      body: {
        margin: 0,
        padding: 0,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      '*': {
        boxSizing: 'border-box',
      },
    }}
  />
);

export default GlobalStyles;
