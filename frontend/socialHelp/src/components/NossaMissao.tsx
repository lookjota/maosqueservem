import { HeartHandshake } from 'lucide-react';

const NossaMissao = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="max-w-5xl mx-auto px-6">

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 md:p-16">

          {/* Ícone */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center shadow-md">
              <HeartHandshake
                size={38}
                className="text-yellow-500"
              />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mt-8">

            <p className="uppercase tracking-[0.35em] text-blue-600 font-semibold text-sm">
              Nossa Missão
            </p>

            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900">
              Servir ao próximo
            </h2>

          </div>

          {/* Versículo */}
          <blockquote className="mt-12 text-center">

            <p className="text-2xl md:text-3xl italic font-semibold leading-relaxed text-gray-800">
              "Aquele que se compadece do pobre
              <br />
              empresta ao Senhor,
              <br />
              e Ele o recompensará
              <br />
              pelo bem que fez."
            </p>

            <span className="block mt-6 text-yellow-600 font-semibold text-lg">
              Provérbios 19:17
            </span>

          </blockquote>

          {/* Linha */}
          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto my-12"></div>

          {/* Texto */}
          <p className="text-center text-lg md:text-xl leading-9 text-gray-600 max-w-3xl mx-auto">
            Cada gesto de amor aproxima pessoas,
            fortalece comunidades e revela o cuidado de Deus
            por meio daqueles que escolhem servir.
          </p>

        </div>

      </div>
    </section>
  );
};

export default NossaMissao;