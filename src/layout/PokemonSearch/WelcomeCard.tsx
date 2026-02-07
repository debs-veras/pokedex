import { Pokeball } from "../../icons";

export function WelcomeCard() {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border-2 border-dashed border-gray-700/50">
      <div className="text-center max-w-md">
        <Pokeball className="w-16 h-16 mx-auto text-yellow-500/50 mb-6" />
        <h3 className="text-2xl text-gray-300 mb-4">Bem-vindo a Pokedex</h3>
        <p className="text-gray-400 mb-6">
          Comece pesquisando pelo nome ou numero de um Pokemon, ou filtre por
          tipo para encontrar suas criaturas favoritas!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <p className="text-yellow-400 text-sm font-medium mb-2">
              Exemplo de Nome:
            </p>
            <p className="text-gray-300">"charizard"</p>
            <p className="text-gray-300">"mewtwo"</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <p className="text-yellow-400 text-sm font-medium mb-2">
              Exemplo de Numero:
            </p>
            <p className="text-gray-300">"6"</p>
            <p className="text-gray-300">"150"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
