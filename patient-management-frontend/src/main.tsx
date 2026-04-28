import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { client } from './applo/client';
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client/react';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>  </StrictMode>,
)
