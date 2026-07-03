import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

 type InterestFormProps = {
  onFinish: (data: {
    name: string;
    values: Record<string, number>;
  }) => void;
};

const categories = [
  'Natureza',
  'Animais',
  'Crianças',
  'Idosos',
  'PCD',
  'Famílias',
  'Empresas',
  'Hospitais',
  'Presídios',
];



const InterestForm = ({ onFinish }: InterestFormProps) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [values, setValues] = useState<Record<string, number>>(
    categories.reduce((acc, cat) => {
      acc[cat] = 5;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleChange = (category, value) => {
    setValues({
      ...values,
      [category]: value,
    });
  };

 


    const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();

      const { error } = await supabase
        .from("volunteers")
        .insert([
          {
            name,
            whatsapp,

            natureza: values["Natureza"],
            animais: values["Animais"],
            criancas: values["Crianças"],
            idosos: values["Idosos"],
            pcd: values["PCD"],
            familias: values["Famílias"],
            empresas: values["Empresas"],
            hospitais: values["Hospitais"],
            presidios: values["Presídios"],
          },
        ]);

      if (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao enviar o formulário.");
        return;
      }


      onFinish({
        name,
        values,
      });

      alert("Obrigado por fazer parte das Mãos que Servem ❤️");

      setName("");
      setWhatsapp("");

      setValues(
        categories.reduce((acc, cat) => {
          acc[cat] = 5;
          return acc;
        }, {} as Record<string, number>)
      );
    };

  return (
    <section id="formulario" className="py-28 bg-white">

      <div className="max-w-5xl mx-auto px-6">

        {/* Título */}
        <div className="text-center mb-16">

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            ❤️ Responder ao chamado
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Não queremos apenas coletar informações.
            Queremos compreender onde seus dons podem ser colocados a serviço do próximo.
          </p>

        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border border-gray-100 rounded-3xl shadow-lg p-10 md:p-14 space-y-10"
        >

          {/* Nome */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nome completo
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              WhatsApp
            </label>

            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Sliders */}
          <div className="space-y-8">

            <h3 className="text-xl font-semibold text-gray-800">
              Em quais áreas você sente maior disposição para servir?
            </h3>

            {categories.map((cat) => (
              <div key={cat} className="space-y-2">

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    {cat}
                  </span>

                  <span className="text-yellow-600 font-semibold">
                    {values[cat]}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={values[cat]}
                  onChange={(e) =>
                    handleChange(cat, Number(e.target.value))
                  }
                  className="w-full accent-yellow-500"
                />

              </div>
            ))}

          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Enviar resposta
          </button>

        </form>

      </div>
    </section>
  );
};

export default InterestForm;