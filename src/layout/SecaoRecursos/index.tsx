export default function SecaoRecursos() {
  return (
    <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
        Recursos da Pokédex
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "🔍",
            title: "Busca Avançada",
            description: "Encontre Pokémon por tipo, habilidade ou região",
            color: "blue",
          },
          {
            icon: "📊",
            title: "Status Detalhados",
            description:
              "Visualize todas as estatísticas em gráficos interativos",
            color: "green",
          },
          {
            icon: "❤️",
            title: "Favoritos",
            description: "Salve seus Pokémon favoritos para acesso rápido",
            color: "red",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className={`bg-gray-900/50 p-6 rounded-lg border border-gray-700 hover:border-${feature.color}-400/50 transition-colors`}
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-yellow-300">
              {feature.title}
            </h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
