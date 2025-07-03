export default function Footer() {
  return (
    <footer className="bg-black/30 border-t border-gray-800 py-6 text-center text-gray-400 text-sm">
      <p>Projeto Pokédex - Não afiliado à Nintendo/The Pokémon Company</p>
      <p className="mt-1">
        Dados da{" "}
        <a
          href="https://pokeapi.co/"
          className="text-yellow-400 hover:underline"
        >
          PokeAPI
        </a>
      </p>
    </footer>
  );
}
