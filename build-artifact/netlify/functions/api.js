exports.handler = async (event, context) => {
  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, "");
  const segments = path.split("/").filter((e) => e);

  switch (event.httpMethod) {
    case "GET":
      /* GET /.netlify/functions/api */
      if (segments.length === 0) {
        return;
      }
      /* GET /.netlify/functions/api/123456 */
      if (segments.length === 1) {
        event.id = segments[0];
        return;
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
