import { graphql, StaticQuery } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import '../styles/Layout.scss';

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            description,
            keywords,
            shareImagePath,
            title,
            titleShort,
            url,
          }
        }
      }
    `}
    render={({
      site: {
        siteMetadata: {
          description,
          keywords,
          shareImagePath,
          title,
          titleShort,
          url,
        },
      },
    }) => (
      <>
        <Helmet>
          <html lang="en" />
          <title>{titleShort}</title>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={`${url}${shareImagePath}`} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={`${url}${shareImagePath}`} />
          <meta property="og:url" content={url} />
          <link rel="canonical" href={url} />
          <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        </Helmet>
        {children}
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
