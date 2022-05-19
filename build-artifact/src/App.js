import Layout from "./Layout";
import Site from "./Site";
import axios from "axios";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
const { SITE_API_URL } = process.env;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Sites />
      </Layout>
    </QueryClientProvider>
  );
}

function Sites() {
  const { status, data, error } = useQuery(
    "sites",
    async () => {
      // const res = await axios.get(`${SITE_API_URL}/sites`);
      const res = await axios.get(
        `https://promote-builds-api.netlify.app/.netlify/functions/api/sites`
      );
      return res.data;
    },
    {
      // Refetch the data every second
      refetchInterval: 1000,
    }
  );
  if (status === "loading") return <h1>Loading...</h1>;
  if (status === "error") return <span>Error: {error.message}</span>;
  return (
    <ul className="space-y-3">
      {data.map((site) => (
        <li
          key={site.id}
          className="bg-white shadow overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md"
        >
          <Site site={site} />
        </li>
      ))}
    </ul>
  );
}

export default App;
