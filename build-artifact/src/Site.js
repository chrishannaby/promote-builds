import axios from "axios";
import { useQuery } from "react-query";

async function promoteBuild(buildHook, commitId) {
  const url = `${buildHook}?trigger_title=${commitId}`;
  await axios.post(url, commitId, {
    headers: { "Content-Type": "text/plain" },
  });
}

function BuildingLabel({ id }) {
  const { status, data } = useQuery(
    id,
    async () => {
      // const res = await axios.get(`${SITE_API_URL}/sites`);
      const res = await axios.get(
        `https://promote-builds-api.netlify.app/.netlify/functions/api/sites/${id}`
      );
      return res.data;
    },
    {
      refetchInterval: 1000,
    }
  );
  if (status === "loading") return;
  if (status === "error") return;

  return (
    <>
      {data.isBuilding && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
          Building
        </span>
      )}
    </>
  );
}

export default function Site({ site }) {
  const hasDeploy = site && site.publishedDeploy;
  const commitId =
    site?.publishedDeploy?.commit_ref || site?.publishedDeploy?.title;
  return (
    <div className="flex sm:flex-row flex-col">
      <div className="mb-6 sm:mb-0 sm:mr-6 flex-shrink-0 sm:self-center">
        {hasDeploy ? (
          <img
            className="border border-gray-300 inline-block h-16 w-24 rounded-md object-cover place-content-center conte"
            src={site.publishedDeploy.screenshot_url}
            alt=""
          />
        ) : (
          <Placeholder />
        )}
      </div>
      <div className="flex-grow">
        <h4 className="text-lg font-bold mb-2 flex items-center">
          <span className="mr-3">{site.name}</span>
          <BuildingLabel id={site.id} />
        </h4>
        <dl className="mb-6 w-full grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Published At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {hasDeploy ? site.publishedDeploy.published_at : "--"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Deploy URL</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <a href={site.url}>{site.url}</a>
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Commit</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {hasDeploy ? (
                <a href={site.publishedDeploy.commit_url}>
                  {site.publishedDeploy.title}
                </a>
              ) : (
                "--"
              )}
            </dd>
          </div>
        </dl>
        {hasDeploy && site.promoteTo.name ? (
          <div className="flex justify-end">
            <button
              onClick={async () =>
                await promoteBuild(site.promoteTo.buildHook, commitId)
              }
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Promote to {site.promoteTo.name}
            </button>
          </div>
        ) : undefined}
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <svg
      className="h-16 w-24 rounded-md border border-gray-300 bg-white text-gray-300"
      preserveAspectRatio="none"
      stroke="currentColor"
      fill="none"
      viewBox="0 0 200 200"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeWidth={1}
        d="M0 0l200 200M0 200L200 0"
      />
    </svg>
  );
}
