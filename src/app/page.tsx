import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-start pt-16 px-6">
      <AppHeader />
      <SearchBar />
    </main>
  );
}
