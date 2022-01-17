import { AppProps } from 'next/app';
import '../styles/global.scss';
import { Header } from '../components/Header';
import { SessionProvider } from 'next-auth/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

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
