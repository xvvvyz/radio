module.exports = {
  siteMetadata: {
    description:
      'Listen to playlists curated by humans. This is the fastest way to discover interesting new music.',
    keywords: 'music, discovery, online, radio, playlists',
    shareImagePath: '/screenshot.png',
    title: 'Radio - Streamlined Music Discovery',
    titleShort: 'Radio',
    url: 'https://radio.xvvvyz.xyz',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: { fonts: ['Lato:400,900'] },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        background_color: '#040404',
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
        name: 'Radio',
        short_name: 'Radio',
        start_url: '/',
        theme_color: '#040404',
      },
    },
  ],
};
