import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

type InterestFormProps = {
  onFinish: (data: {
    name: string;
    values: Record<string, number>;
  }) => void;
};

type Category = {
  name: string;
  emoji: string;
  column: string; // coluna correspondente na tabela "volunteers"
};

const categories: Category[] = [
  { name: 'Mutirões ecológicos', emoji: '🌿', column: 'natureza' },
  { name: 'Abrigo de animais', emoji: '🐾', column: 'animais' },
  { name: 'Orfanato', emoji: '🧒', column: 'criancas' },
  { name: 'Lar de idosos', emoji: '🧓', column: 'idosos' },

];

const SUCCESS_DURATION = 2500;

// Começa em 0 (corações vazios) para não enviesar as respostas —
// antes todos os sliders iniciavam em 5.
const emptyValues = () =>
  categories.reduce((acc, cat) => {
    acc[cat.name] = 0;
    return acc;
  }, {} as Record<string, number>);

const affinityLabel = (value: number) => {
  if (value === 0) return 'Toque nos corações para avaliar';
  if (value <= 3) return 'Pouca afinidade';
  if (value <= 6) return 'Afinidade moderada';
  if (value <= 9) return 'Muita afinidade';
  return 'Meu chamado! ❤️';
};

const formatWhatsapp = (digits: string) => {
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-full w-full"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.9}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
    />
  </svg>
);

const InterestForm = ({ onFinish }: InterestFormProps) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState(''); // apenas dígitos
  const [nameError, setNameError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [values, setValues] = useState<Record<string, number>>(emptyValues);

  const [allowPublicDisplay, setAllowPublicDisplay] = useState(false);

  // Pré-visualização ao passar o mouse sobre os corações (desktop)
  const [hovered, setHovered] = useState<{ cat: string; value: number } | null>(
    null
  );

  const ratedCount = Object.values(values).filter((v) => v > 0).length;

  const handleRate = (category: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      // Tocar de novo no mesmo coração zera a nota
      [category]: prev[category] === value ? 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    if (!allowPublicDisplay) {
      alert(
        "É necessário autorizar a divulgação do primeiro nome e da área de interesse para enviar o formulário."
      );
      return;
    }

    e.preventDefault();
    if (isSubmitting) return;

    const cleanName = name.trim();
    let hasError = false;

    if (cleanName.length < 4) {
      setNameError('O nome deve possuir pelo menos 4 caracteres.');
      hasError = true;
    }

    if (whatsapp.length !== 11) {
      setWhatsappError('Informe um WhatsApp com DDD (11 números).');
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const row: Record<string, string | number> = {
        name: cleanName,
        whatsapp,
      };
      categories.forEach((cat) => {
        row[cat.column] = values[cat.name];
      });

      const { error } = await supabase.from('volunteers').insert([row]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao enviar o formulário.');
        return;
      }

      onFinish({ name: cleanName, values });

      setSuccess(true);
      setTimeout(() => setSuccess(false), SUCCESS_DURATION);

      // Reset
      setName('');
      setWhatsapp('');
      setNameError('');
      setWhatsappError('');
      setValues(emptyValues());
      setAllowPublicDisplay(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOdd = categories.length % 2 === 1;

  return (
    <section
      id="formulario"
      className="py-24 md:py-28"
      style={{ background: 'linear-gradient(180deg, #FEF9C3 0%, #FFFFFF 70%)' }}
    >
      <style>{`
        @keyframes mqsFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes mqsPop {
          from { opacity: 0; transform: scale(.92) translateY(10px) }
          to   { opacity: 1; transform: scale(1) translateY(0) }
        }
        @keyframes mqsBar { from { width: 100% } to { width: 0% } }
        .mqs-fade { animation: mqsFade .25s ease-out both }
        .mqs-pop  { animation: mqsPop .35s cubic-bezier(.16, 1, .3, 1) both }
        .mqs-bar  { animation: mqsBar ${SUCCESS_DURATION}ms linear forwards }
        @media (prefers-reduced-motion: reduce) {
          .mqs-fade, .mqs-pop, .mqs-bar { animation: none }
        }
      `}</style>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Título */}
        <div className="mb-14 text-center md:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white px-4 py-1.5 text-sm font-semibold text-yellow-800 shadow-sm">
            ❤️ Missão 7
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Responder ao chamado
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-700">
            Não queremos apenas coletar informações. Queremos compreender onde
            seus dons podem ser colocados a serviço do próximo.
          </p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl sm:p-8 md:p-12"
        >
          {/* ETAPA 1 — Dados */}
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
              1
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Seus dados
              </h3>
              <p className="text-sm text-gray-600">
                Como podemos te chamar e te encontrar.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Nome */}
            <div>
              <label
                htmlFor="mqs-name"
                className="mb-2 block font-semibold text-gray-900"
              >
                Nome completo
              </label>
              <input
                id="mqs-name"
                type="text"
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  if (value.trim().length < 4) {
                    setNameError('O nome deve possuir pelo menos 4 caracteres.');
                  } else {
                    setNameError('');
                  }
                }}
                placeholder="Digite seu nome"
                maxLength={100}
                autoComplete="name"
                className={`w-full rounded-xl border-2 p-4 text-gray-900 placeholder-gray-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                  nameError
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 bg-gray-50 focus:border-yellow-500 focus:ring-yellow-200'
                }`}
                required
              />
              {nameError && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {nameError}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label
                htmlFor="mqs-whatsapp"
                className="mb-2 block font-semibold text-gray-900"
              >
                WhatsApp
              </label>
              <input
                id="mqs-whatsapp"
                type="tel"
                value={formatWhatsapp(whatsapp)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                  setWhatsapp(digits);
                  if (digits.length < 11) {
                    setWhatsappError(
                      'Informe um WhatsApp com DDD (11 números).'
                    );
                  } else {
                    setWhatsappError('');
                  }
                }}
                placeholder="(61) 99999-8888"
                inputMode="numeric"
                autoComplete="tel-national"
                className={`w-full rounded-xl border-2 p-4 text-gray-900 placeholder-gray-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                  whatsappError
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 bg-gray-50 focus:border-yellow-500 focus:ring-yellow-200'
                }`}
                required
              />
              {whatsappError && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {whatsappError}
                </p>
              )}
            </div>
          </div>

          <div className="my-10 h-px bg-gray-200" />

          {/* ETAPA 2 — Afinidades */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                2
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Suas áreas de serviço
                </h3>
                <p className="text-sm text-gray-600">
                  Toque nos corações para dar uma nota de 0 a 10. Toque de novo
                  no mesmo coração para zerar.
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                ratedCount > 0
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {ratedCount} de {categories.length} avaliadas
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {categories.map((cat, index) => {
              const value = values[cat.name];
              const isPreviewing = hovered?.cat === cat.name;
              const shown = isPreviewing ? hovered!.value : value;
              const isLastOdd = isOdd && index === categories.length - 1;

              return (
                <div
                  key={cat.name}
                  className={`rounded-2xl border-2 p-4 transition-colors duration-200 sm:p-5 ${
                    isLastOdd ? 'sm:col-span-2' : ''
                  } ${
                    value > 0
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50 hover:border-yellow-300'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold text-gray-900">
                      <span className="text-xl" aria-hidden="true">
                        {cat.emoji}
                      </span>
                      {cat.name}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        value > 0
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {value}/10
                    </span>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={`Afinidade com ${cat.name}, de 0 a 10`}
                    className="flex w-full max-w-md items-center justify-between"
                    onMouseLeave={() => setHovered(null)}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleRate(cat.name, n)}
                        onMouseEnter={() =>
                          setHovered({ cat: cat.name, value: n })
                        }
                        aria-label={`Nota ${n} de 10 para ${cat.name}`}
                        aria-pressed={value === n}
                        className={`h-6 w-6 p-0.5 touch-manipulation transition-transform duration-150 hover:scale-125 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded sm:h-7 sm:w-7 ${
                          n <= shown
                            ? isPreviewing
                              ? 'text-yellow-400'
                              : 'text-yellow-500'
                            : 'text-gray-400'
                        }`}
                      >
                        <HeartIcon filled={n <= shown} />
                      </button>
                    ))}
                  </div>

                  <p
                    className={`mt-2 text-sm font-medium ${
                      value > 0 ? 'text-yellow-800' : 'text-gray-500'
                    }`}
                  >
                    {affinityLabel(value)}
                  </p>
                </div>
              );
            })}
          </div>

                        {/* validacao formulario */}
              <div className="mt-10 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowPublicDisplay}
                    onChange={(e) => setAllowPublicDisplay(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                  />

                  <span className="text-sm leading-6 text-gray-700">
                    <strong>Autorizo</strong> a divulgação do meu <strong>primeiro nome</strong> e
                    da minha <strong>principal área de interesse</strong> na página do
                    <strong> Mãos que Servem</strong>, com o objetivo de incentivar outras
                    pessoas a participarem da iniciativa.
                    <br />
                    <span className="text-gray-500">
                      Meu WhatsApp e as demais informações fornecidas não serão exibidos
                      publicamente. Posso solicitar a remoção dessa autorização a qualquer
                      momento.
                    </span>
                  </span>
                </label>
              </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting || !allowPublicDisplay}
            className={`mt-10 w-full rounded-xl py-4 font-bold shadow-lg transition-all duration-300 ${
              isSubmitting || !allowPublicDisplay
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-yellow-400 text-gray-900 hover:-translate-y-0.5 hover:bg-yellow-500 hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                  />
                </svg>
                Enviando…
              </span>
            ) : (
              'Enviar resposta'
            )}
          </button>
        </form>

        {/* Modal de sucesso */}
        {success && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            {/* backdrop */}
            <div
              className="mqs-fade absolute inset-0"
              style={{
                background: 'rgba(17, 24, 39, .45)',
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* card */}
            <div className="mqs-pop relative w-full max-w-sm rounded-3xl bg-white px-8 py-9 text-center shadow-2xl sm:px-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>



              <h2 className="text-2xl font-bold text-gray-900">
                Resposta enviada!
              </h2>

              <p className="mt-2 text-gray-600">
                Obrigado por fazer parte das <strong>Mãos que Servem</strong> ❤️
              </p>

              <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="mqs-bar h-full bg-yellow-400" />
              </div>
            </div>
          </div>
        )}
        
      </div>
      
    </section>
  );
};

export default InterestForm;



// import React, { useState } from 'react';
// import { supabase } from '../lib/supabase';

//  type InterestFormProps = {
//   onFinish: (data: {
//     name: string;
//     values: Record<string, number>;
//   }) => void;
// };

// const categories = [
//   'Natureza',
//   'Animais',
//   'Crianças',
//   'Idosos',
//   'PCD',
//   'Famílias',
//   'Empresas',
//   'Hospitais',
//   'Presídios',
// ];



// const InterestForm = ({ onFinish }: InterestFormProps) => {
//   const [name, setName] = useState('');
//   const [whatsapp, setWhatsapp] = useState('');
//   const [nameError, setNameError] = useState('');
//   const [whatsappError, setWhatsappError] = useState('');

//   const [success, setSuccess] = useState(false);

//   const [values, setValues] = useState<Record<string, number>>(
//     categories.reduce((acc, cat) => {
//       acc[cat] = 5;
//       return acc;
//     }, {} as Record<string, number>)
//   );

  
// const handleChange = (category: string, value: number) => {
//     setValues({
//       ...values,
//       [category]: value,
//     });
//   };

 


//     const handleSubmit = async (
//       e: React.FormEvent<HTMLFormElement>
//     ) => {
//       e.preventDefault();
//         const cleanName = name.trim();

//           let hasError = false;

//           if (cleanName.length < 4) {
//             setNameError("O nome deve possuir pelo menos 4 caracteres.");
//             hasError = true;
//           }

//           if (whatsapp.length !== 11) {
//             setWhatsappError("Informe um WhatsApp com DDD (11 números).");
//             hasError = true;
//           }

//           if (hasError) return;

//       const { error } = await supabase
//         .from("volunteers")
//         .insert([
//           {
//             name: cleanName,
//             whatsapp,

//             natureza: values["Natureza"],
//             animais: values["Animais"],
//             criancas: values["Crianças"],
//             idosos: values["Idosos"],
//             pcd: values["PCD"],
//             familias: values["Famílias"],
//             empresas: values["Empresas"],
//             hospitais: values["Hospitais"],
//             presidios: values["Presídios"],
//           },
//         ])
//         .select();
//         ;

//       if (error) {
//         console.error("Erro ao salvar:", error);
//         alert("Erro ao enviar o formulário.");
//         return;
//       }


//       onFinish({
//         name,
//         values,
//       });

//       setSuccess(true);

//         setTimeout(() => {
//           setSuccess(false);
//         }, 2500);

//         setNameError("");
//         setWhatsappError("");

//         // RESET CAMPOS DO FORM
//         setName("");
//         setWhatsapp("");

//         // RESET SLIDERS
//         setValues(
//           categories.reduce((acc, cat) => {
//             acc[cat] = 5;
//             return acc;
//           }, {} as Record<string, number>)
//         );
//       setName("");
//       setWhatsapp("");

//       setValues(
//         categories.reduce((acc, cat) => {
//           acc[cat] = 5;
//           return acc;
//         }, {} as Record<string, number>)
//       );
//     };

//   return (
//     <section id="formulario" className="py-28 bg-white">

//       <div className="max-w-5xl mx-auto px-6">

//         {/* Título */}
//         <div className="text-center mb-16">

//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
//             ❤️ Responder ao chamado
//           </h2>

//           <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
//             Não queremos apenas coletar informações.
//             Queremos compreender onde seus dons podem ser colocados a serviço do próximo.
//           </p>

//         </div>

//         {/* Formulário */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-gray-50 border border-gray-100 rounded-3xl shadow-lg p-10 md:p-14 space-y-10"
//         >

//           {/* Nome */}
//           <div>
//             <label className="block text-gray-700 font-semibold mb-2">
//               Nome completo
//             </label>

//             <input
//               type="text"
//               value={name}
//               onChange={(e) => {
//                 const value = e.target.value;

//                 setName(value);

//                 if (value.trim().length < 4) {
//                   setNameError("O nome deve possuir pelo menos 4 caracteres.");
//                 } else {
//                   setNameError("");
//                 }
//               }}
//               placeholder="Digite seu nome"
//               minLength={3}
//               maxLength={100}
//               className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition

//                 ${
//                   nameError
//                     ? "border-red-400 focus:ring-red-300"
//                     : "border-gray-200 focus:ring-yellow-400"
//                 }
//                 `}
//               required
//             />
//           </div>

//           {/* WhatsApp */}
//           <div>
//             <label className="block text-gray-700 font-semibold mb-2">
//               WhatsApp
//             </label>

//             <input
//               type="tel"
//               value={whatsapp}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, "").slice(0, 11);

//                 setWhatsapp(value);

//                 if (value.length < 11) {
//                   setWhatsappError("Informe um WhatsApp com DDD (11 números).");
//                 } else {
//                   setWhatsappError("");
//                 }
//               }}
//               placeholder="11999998888"
//               inputMode="numeric"
//               pattern="[0-9]{11}"
//               minLength={11}
//               className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition

//                 ${
//                   nameError
//                     ? "border-red-400 focus:ring-red-300"
//                     : "border-gray-200 focus:ring-yellow-400"
//                 }
//                 `}
//               required
//             />
//             {whatsappError && (
//               <p className="mt-2 text-sm text-red-500">
//                 {whatsappError}
//               </p>
//           )}
//           </div>

//           {/* Sliders */}
//           <div className="space-y-8">

//             <h3 className="text-xl font-semibold text-gray-800">
//               Em quais áreas você sente maior disposição para servir?
//             </h3>

//             {categories.map((cat) => (
//               <div key={cat} className="space-y-2">

//                 <div className="flex justify-between">
//                   <span className="font-medium text-gray-700">
//                     {cat}
//                   </span>

//                   <span className="text-yellow-600 font-semibold">
//                     {values[cat]}
//                   </span>
//                 </div>

//                 <input
//                   type="range"
//                   min="0"
//                   max="10"
//                   value={values[cat]}
//                   onChange={(e) =>
//                     handleChange(cat, Number(e.target.value))
//                   }
//                   className="w-full accent-yellow-500"
//                 />

//               </div>
//             ))}

//           </div>

//           {/* Botão */}
//           <button
//             type="submit"
//             className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
//           >
//             Enviar resposta
//           </button>

//         </form>

         
//         {success && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center">
            
//             {/* backdrop */}
//             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn" />

//             {/* card */}
//             <div className="relative bg-white rounded-2xl shadow-2xl px-10 py-8 text-center animate-popIn">
              
//               <div className="text-5xl mb-4">✨</div>

//               <h2 className="text-2xl font-bold text-gray-900">
//                 Resposta enviada!
//               </h2>

//               <p className="text-gray-600 mt-2">
//                 Obrigado por fazer parte das Mãos que Servem ❤️
//               </p>

//               <div className="mt-6 w-full h-1 bg-yellow-400 rounded-full animate-progress" />
//             </div>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// };

// export default InterestForm;