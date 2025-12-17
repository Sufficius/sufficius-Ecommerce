import QueryProvider from "@/config/tanstack-query/queryClientProvider";
import Login from "@/pages/Login";

export default function Home() {
  return (
    <QueryProvider>
      <section className="flex justify-center items-center">
        <Login />
      </section>
    </QueryProvider>
  );
}
