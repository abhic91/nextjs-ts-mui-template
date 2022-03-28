// import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'createEmotionCache';
import { appWithTranslation } from 'next-i18next';
import 'styles/font.css';
import 'styles/globals.css';
import Layout from 'components/Layout/Layout';
import App, { AppContext, AppProps } from 'next/app';
import allThemes from 'theme';
import { useState } from 'react';
import whitelabel, { T_SingleBusinessWhitelabelInfo } from 'whitelabel/whitelabel';
import { getWhitelabelKeyFromHostname } from 'utils/utils';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const selectedBusinessWhitelabelKey = getWhitelabelKeyFromHostname(appContext.ctx.req?.headers.host || '');
  const selectedBusinessWhitelabelValues = whitelabel[selectedBusinessWhitelabelKey];
  return {
    ...appProps,
    selectedBusinessWhitelabelValues,
    themeObj: allThemes[selectedBusinessWhitelabelKey],
  };
};

function MyApp(
  props: AppProps & {
    emotionCache: EmotionCache;
    selectedBusinessWhitelabelValues: T_SingleBusinessWhitelabelInfo;
    [key: string]: any;
  }
) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, themeObj, selectedBusinessWhitelabelValues } = props;
  const [theme] = useState(createTheme(themeObj));

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`favicons/${selectedBusinessWhitelabelValues.businessKey}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`favicons/${selectedBusinessWhitelabelValues.businessKey}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`favicons/${selectedBusinessWhitelabelValues.businessKey}/favicon-16x16.png`}
        />
        <link
          rel="mask-icon"
          href={`favicons/${selectedBusinessWhitelabelValues.businessKey}/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content={theme.palette.primary.main}></meta>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout selectedBusinessWhitelabelValues={selectedBusinessWhitelabelValues}>
          <Component {...pageProps} selectedBusinessWhitelabelValues={selectedBusinessWhitelabelValues} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}
export default appWithTranslation(MyApp);
