// import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import defaultTheme from '../theme/default.theme';
import createEmotionCache from '../createEmotionCache';
import { AppProps } from 'next/dist/shared/lib/router/router';
import { appWithTranslation } from 'next-i18next';
import '../styles/font.css';
import '../styles/globals.css';
import Layout from '../components/Layout/Layout';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function App(props: AppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [theme, setTheme] = useState(defaultTheme);
  useEffect(() => {
    (async () => {
      try {
        const orgThemeKey = getCookie('org-theme-key');
        const orgTheme = await import(`../theme/${orgThemeKey}.theme.ts`);
        setTheme(orgTheme.default || defaultTheme);
      } catch (error) {
        console.log(error);
        setTheme(defaultTheme);
      }
    })();
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}
export default appWithTranslation(App);
