import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import '../styles/global.scss';

const initialOptions = {
  'client-id':
    'AZvUic-sD4XxWBhpl3EMshstRlk1kJ8eJeS8MHcxrgjOa6oS4KV1tyATanY70zkNKmaJ1OSmBixXdinK',
  currency: 'BRL',
  intent: 'capture',
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </SessionProvider>
  );
}

export default MyApp;
