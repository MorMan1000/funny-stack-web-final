import React from 'react';
import { AuthProvider } from './AuthContext';
import { WebProvider } from './WebContext';


//This components includes all the app contexts.
const Contexts = ({ children }) => {
  return <AuthProvider>
    <WebProvider> {children} </WebProvider>
  </AuthProvider>;
};

export default Contexts;