import React from 'react';
import { Sparkles } from 'lucide-react';

const ConviteAoServico = () => {
  return (
    <section className="py-28 bg-white">

      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold shadow-sm">

            <Sparkles size={18} />

            Um Convite ao Serviço

          </div>

          <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900">

            Exista uma missão
            <span className="block text-yellow-500">
              esperando justamente por você.
            </span>

          </h2>

        </div>

        <div className="mt-16 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg border border-gray-100 p-10 md:p-16">

          <div className="space-y-8 text-gray-700 text-lg leading-9">

            <p>
              Deus criou cada pessoa com talentos únicos.
              Nenhuma história é igual à outra, porque cada coração foi chamado para servir de uma maneira especial.
            </p>

            <p>
              Alguns têm facilidade para ensinar.
            </p>

            <p>
              Outros possuem o dom de ouvir, acolher e aconselhar.
            </p>

            <p>
              Há quem cuide, quem organize, quem visite, quem console,
              quem incentive, quem cozinhe, quem ore, quem simplesmente esteja presente quando alguém mais precisa.
            </p>

            <p className="font-semibold text-gray-900 text-xl">
              Nenhum dom é pequeno quando é colocado nas mãos de Deus.
            </p>

            <p>
              Nosso desejo é descobrir, juntos, onde cada irmão pode servir
              com alegria, amor e propósito, colocando seus talentos a serviço
              das pessoas e da comunidade.
            </p>

            <p className="text-2xl font-bold text-center text-yellow-600 pt-6">
           
              Talvez Deus já tenha colocado essa missão diante de você.<br/>
              Talvez hoje seja apenas o dia de reconhecê-la.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ConviteAoServico;