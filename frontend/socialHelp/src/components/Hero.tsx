import React from 'react';
import HeroImage from '../assets/hero.jpg';

const Hero = () => {
  const scrollToForm = () => {
    const form = document.getElementById('formulario');

    if (form) {
      form.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-white min-h-screen flex items-center pt-24">

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Imagem */}
          <div className="order-1 lg:order-2 flex justify-center">

            <img
              src={HeroImage}
              alt="Pessoas servindo ao próximo"
              className="w-full max-w-2xl rounded-3xl shadow-2xl object-cover"
            />

          </div>

          {/* Texto */}
          <div className="order-2 lg:order-1 text-center lg:text-left">

            {/* Badge */}

            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold shadow-sm">

              🤝 Mãos que Servem

            </span>

            {/* Título */}

            <h1 className="mt-8 text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">

              Pequenas atitudes

              <span className="block text-yellow-500">

                transformam grandes vidas.

              </span>

            </h1>

            {/* Frase */}

            <p className="mt-8 text-xl leading-9 text-gray-700 max-w-xl mx-auto lg:mx-0">

              Talvez Deus tenha colocado em seu coração um dom que ainda não foi descoberto.

            </p>

            {/* Texto */}

            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto lg:mx-0">

              Descubra como seus talentos podem levar esperança,
              acolhimento e amor a quem mais precisa.

              <br />
              <br />

              Deus continua transformando vidas através de pessoas comuns
              que escolhem dizer <span className="font-semibold text-yellow-600">"sim"</span> ao Seu chamado.

            </p>

            {/* Botão */}

            <button
              onClick={scrollToForm}
              className="mt-10 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              Descobrir Onde Posso Servir
            </button>

            {/* Frase Final */}

            <p className="mt-10 italic text-gray-500 text-sm md:text-base">

              "Toda grande transformação começa com um coração disposto a servir."

            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;