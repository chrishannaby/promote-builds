const redirects = {
  "promote-builds-qa": [
    {
      from: "/api/*",
      to: "https://promote-builds-api.netlify.app/.netlify/functions/api/:splat",
      status: 200,
      force: true,
    },
  ],
  "promote-builds-production": [
    {
      from: "/api/*",
      to: "https://promote-builds-api.netlify.app/.netlify/functions/api/:splat",
      status: 200,
      force: true,
    },
  ],
};

module.exports = {
  onPreBuild({ netlifyConfig }) {
    const { SITE_NAME } = process.env;
    // clear existing redirects
    netlifyConfig.redirects = [];
    for (const redirect of redirects[SITE_NAME]) {
      netlifyConfig.redirects.push(redirect);
    }
  },
};
