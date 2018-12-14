module.exports = {
  siteMetadata: {
    description:
      'Listen to playlists curated by humans. This is the fastest way to discover interesting new music.',
    keywords: 'music, discovery, online, radio, playlists',
    shareImagePath: '/screenshot.png',
    title: 'Line Radio - Streamlined Music Discovery',
    titleShort: 'Line Radio',
    url: 'https://linerad.io',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        anonymize: true,
        head: false,
        respectDNT: true,
        trackingId: 'UA-36603722-6',
      },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: ['Lato:400,700,900'],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        background_color: '#040404',
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
        name: 'Line Radio',
        short_name: 'Line Radio',
        start_url: '/',
        theme_color: '#040404',
      },
    },
  ],
};
