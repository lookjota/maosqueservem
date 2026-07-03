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
  const [nameError, setNameError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');

  const [success, setSuccess] = useState(false);

  const [values, setValues] = useState<Record<string, number>>(
    categories.reduce((acc, cat) => {
      acc[cat] = 5;
      return acc;
    }, {} as Record<string, number>)
  );

  
const handleChange = (category: string, value: number) => {
    setValues({
      ...values,
      [category]: value,
    });
  };

 


    const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
        const cleanName = name.trim();

          let hasError = false;

          if (cleanName.length < 4) {
            setNameError("O nome deve possuir pelo menos 4 caracteres.");
            hasError = true;
          }

          if (whatsapp.length !== 11) {
            setWhatsappError("Informe um WhatsApp com DDD (11 números).");
            hasError = true;
          }

          if (hasError) return;

      const { error } = await supabase
        .from("volunteers")
        .insert([
          {
            name: cleanName,
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
        ])
        .select();
        ;

      if (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao enviar o formulário.");
        return;
      }


      onFinish({
        name,
        values,
      });

      setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 2500);

        setNameError("");
        setWhatsappError("");

        // RESET CAMPOS DO FORM
        setName("");
        setWhatsapp("");

        // RESET SLIDERS
        setValues(
          categories.reduce((acc, cat) => {
            acc[cat] = 5;
            return acc;
          }, {} as Record<string, number>)
        );
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
              onChange={(e) => {
                const value = e.target.value;

                setName(value);

                if (value.trim().length < 4) {
                  setNameError("O nome deve possuir pelo menos 4 caracteres.");
                } else {
                  setNameError("");
                }
              }}
              placeholder="Digite seu nome"
              minLength={3}
              maxLength={100}
              className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition

                ${
                  nameError
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-yellow-400"
                }
                `}
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 11);

                setWhatsapp(value);

                if (value.length < 11) {
                  setWhatsappError("Informe um WhatsApp com DDD (11 números).");
                } else {
                  setWhatsappError("");
                }
              }}
              placeholder="11999998888"
              inputMode="numeric"
              pattern="[0-9]{11}"
              minLength={11}
              className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition

                ${
                  nameError
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-yellow-400"
                }
                `}
              required
            />
            {whatsappError && (
              <p className="mt-2 text-sm text-red-500">
                {whatsappError}
              </p>
          )}
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

         
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn" />

            {/* card */}
            <div className="relative bg-white rounded-2xl shadow-2xl px-10 py-8 text-center animate-popIn">
              
              <div className="text-5xl mb-4">✨</div>

              <h2 className="text-2xl font-bold text-gray-900">
                Resposta enviada!
              </h2>

              <p className="text-gray-600 mt-2">
                Obrigado por fazer parte das Mãos que Servem ❤️
              </p>

              <div className="mt-6 w-full h-1 bg-yellow-400 rounded-full animate-progress" />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default InterestForm;