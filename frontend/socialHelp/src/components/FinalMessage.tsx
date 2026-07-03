
const FinalMessage = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-yellow-50 overflow-hidden">
      
      {/* brilho suave */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-200 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">

        {/* ícone */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center shadow-md">
            <span className="text-2xl">🌅</span>
          </div>
        </div>

        {/* título */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Mensagem Final
        </h2>

        <div className="w-20 h-[2px] bg-yellow-400 mx-auto my-6 rounded-full" />

        {/* mensagem principal */}
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
          Cada gesto de amor importa.
          <br />
          Cada pessoa que decide servir transforma um pedaço do mundo ao seu redor.
        </p>

        {/* mensagem central (mais forte) */}
        <div className="mt-10 bg-white/70 backdrop-blur-md border border-yellow-100 shadow-lg rounded-2xl p-8 md:p-10">
          <p className="text-gray-800 text-lg md:text-xl font-medium leading-relaxed">
            Você não está apenas preenchendo um formulário.  
            <br /><br />
            Você está dizendo “sim” para estar disponível onde houver necessidade,  
            levando cuidado, atenção e esperança a quem mais precisa.
          </p>
        </div>

        {/* encerramento inspirador */}
        <p className="mt-10 text-lg text-gray-600">
          Que essa decisão não fique apenas aqui —  
          mas se torne ação, presença e amor vivido no dia a dia.
        </p>

        {/* assinatura */}
        <div className="mt-10 text-sm text-gray-500">
          Mãos que Servem · Comunidade de voluntários
        </div>

      </div>
    </section>
  );
};

export default FinalMessage;