import Footer from "./layout/Footer";
import Header from "./layout/Header";
import { PokemonBackground } from "./layout/PokemonBackground";
import PokemonSearch from "./layout/PokemonSearch";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col text-gray-100 relative overflow-hidden">
      <PokemonBackground />
      <Header />
      <main className="flex-1">
        <PokemonSearch />
      </main>
      <Footer />
    </div>
  );
}
