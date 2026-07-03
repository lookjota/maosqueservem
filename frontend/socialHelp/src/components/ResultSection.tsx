import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

type Props = {
  result: Record<string, number>;
};

const ResultSection = ({ result }: Props) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!result) return null;

  const sorted = Object.entries(result)
    .sort((a, b) => b[1] - a[1]);

  const top3 = sorted.slice(0, 3);

  console.log("RESULT RECEBIDO:", result);

  return (
    <section className="py-32 bg-gradient-to-b from-white via-yellow-50 to-white">

      <div className="max-w-4xl mx-auto px-6">

        <div className={`
          bg-white border border-gray-100 shadow-2xl rounded-3xl p-12 text-center
          transition-all duration-1000 ease-out
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}>

          {/* ÍCONE */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center shadow-md">
              <Heart className="text-yellow-500" size={34} />
            </div>
          </div>

          {/* TÍTULO */}
          <h2 className="mt-8 text-3xl md:text-5xl font-bold text-gray-900">
            ❤️ Obrigado por fazer parte das Mãos que Servem
          </h2>

          {/* INTRO */}
          <p className="mt-6 text-lg text-gray-600 leading-8 max-w-2xl mx-auto">
            Deus concede dons diferentes a cada pessoa.
            Suas respostas indicam maior afinidade com estas áreas de serviço:
          </p>

          {/* TOP 3 */}
          <div className="mt-14 space-y-6">
            {top3.map(([key, value], index) => (
              <div
                key={key}
                className={`
                  flex items-center justify-between bg-gray-50
                  border border-gray-100 rounded-2xl p-6
                  transition-all duration-700 ease-out
                  ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}
              >
                <span className="text-2xl font-bold text-yellow-500">
                  {index + 1}º
                </span>

                <span className="text-lg font-semibold text-gray-800">
                  {key}
                </span>

                <span className="text-yellow-600 font-bold text-lg">
                  {value}/10
                </span>
              </div>
            ))}
          </div>

          {/* TEXTO FINAL */}
          <div className={`
            mt-14 text-gray-600 text-lg leading-8 max-w-2xl mx-auto
            transition-all duration-1000 delay-700
            ${show ? 'opacity-100' : 'opacity-0'}
          `}>
            <p>
              Talvez Deus esteja despertando em seu coração um chamado especial
              para cuidar de pessoas, acolher famílias e levar esperança.
            </p>

            <p className="mt-6 font-semibold text-gray-900">
              Que esses dons floresçam e sejam usados para abençoar muitas vidas.
            </p>
          </div>

          {/* 📊 GRÁFICO (AGORA FUNCIONA) */}
          <div className="mt-16">
          </div>

          {/* DEBUG (OPCIONAL) */}
          <pre className="text-xs text-left mt-10 bg-gray-50 p-4 rounded-lg">
            {JSON.stringify(result, null, 2)}
          </pre>

        </div>
      </div>

    </section>
  );
};

export default ResultSection;