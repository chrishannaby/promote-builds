const NetlifyAPI = require("netlify");
const sites = {
  "e675dda5-c476-4e6b-850d-6cb6df3a39f3": { name: "Production" },
  "33f525cd-6f1d-4bf5-8a32-ff20fc1f0c21": {
    name: "QA",
    promoteTo: "e675dda5-c476-4e6b-850d-6cb6df3a39f3",
  },
  "5ade471d-9800-4baa-9101-7451966efd6b": {
    name: "Release",
    promoteTo: "33f525cd-6f1d-4bf5-8a32-ff20fc1f0c21",
  },
};

exports.handler = async function (event, context) {
  const client = new NetlifyAPI(process.env.NETLIFY_API_ACCESS_TOKEN);

  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, "");
  const segments = path.split("/").filter((e) => e);

  switch (event.httpMethod) {
    case "GET":
      /* GET /.netlify/functions/api */
      if (segments.length === 0) {
        return {
          statusCode: 200,
          body: "hello world",
        };
      }
      /* GET /.netlify/functions/api/sites */
      if (segments.length === 1 && segments[0] === "sites") {
        const filteredSites = [];
        for (const site in sites) {
          const siteData = await client.getSite({ site_id: site });
          filteredSites.push({
            ...sites[site],
            id: site,
            url: siteData.ssl_url,
            publishedDeploy: siteData.published_deploy,
          });
        }
        return {
          statusCode: 200,
          body: JSON.stringify(filteredSites),
        };
      } else {
        return {
          statusCode: 500,
          body: "too many segments in GET request",
        };
      }
    /* POST /.netlify/functions/api */
    case "POST":
      return;
    /* Fallthrough case */
    default:
      return {
        statusCode: 500,
        body: "unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE",
      };
  }
};
