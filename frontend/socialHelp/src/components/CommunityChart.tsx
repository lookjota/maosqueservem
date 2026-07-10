import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
} from 'recharts';

type Category = {
  name: string;
  emoji: string;
  column: string; // coluna correspondente na tabela "volunteers"
};

// Agora com as 9 áreas — a v1 mostrava apenas 5,
// o que também distorcia o cálculo da média geral.
const categories: Category[] = [
  { name: 'Mutirões ecológicos', emoji: '🌿', column: 'natureza' },
  { name: 'Abrigo de animais', emoji: '🐾', column: 'animais' },
  { name: 'Orfanato', emoji: '🧒', column: 'criancas' },
  { name: 'Lar de idosos', emoji: '🧓', column: 'idosos' },
  // { name: 'PCD', emoji: '♿', column: 'pcd' },
  // { name: 'Famílias', emoji: '👨‍👩‍👧‍👦', column: 'familias' },
  // { name: 'Empresas', emoji: '🏢', column: 'empresas' },
  // { name: 'Hospitais', emoji: '🏥', column: 'hospitais' },
  // { name: 'Presídios', emoji: '🕊️', column: 'presidios' },
];

const BAR_COLOR = '#FCD34D'; // yellow-300
const BAR_COLOR_LEADER = '#F59E0B'; // amber-500

const formatBR = (value: number) =>
  value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
      <p className="font-semibold text-gray-800">{item.payload.name}</p>
      <p className="mt-0.5 text-sm text-gray-500">
        Afinidade média:{' '}
        <span className="font-semibold text-yellow-600">
          {formatBR(item.value)}/10
        </span>
      </p>
    </div>
  );
};

const CommunityChart = () => {
  const [loading, setLoading] = useState(true);
  const [averages, setAverages] = useState<Record<string, number>>({});
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [topCategory, setTopCategory] = useState<Category | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  async function loadCommunityData() {
    const { data: volunteers, error } = await supabase
      .from('volunteers')
      .select('*');

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const totals: Record<string, number> = {};
    categories.forEach((cat) => {
      totals[cat.name] = 0;
    });

    (volunteers ?? []).forEach((v: any) => {
      categories.forEach((cat) => {
        totals[cat.name] += Number(v[cat.column] ?? 0);
      });
    });

    const count = volunteers?.length ?? 0;

    const avgs: Record<string, number> = {};
    categories.forEach((cat) => {
      avgs[cat.name] =
        count > 0 ? Number((totals[cat.name] / count).toFixed(1)) : 0;
    });

    const points = Object.values(totals).reduce((acc, value) => acc + value, 0);

    const average =
      count > 0 ? points / (count * categories.length) : 0;

    const winnerName = Object.entries(totals).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    setTotalVolunteers(count);
    setTotalPoints(points);
    setAverageScore(Number(average.toFixed(1)));
    setTopCategory(categories.find((c) => c.name === winnerName) ?? null);
    setAverages(avgs);
    setLoading(false);
  }

  useEffect(() => {
    loadCommunityData();

    const channel = supabase
      .channel('community-chart')
      .on(
        'postgres_changes',
        {
          // "*" para o gráfico refletir também edições e exclusões,
          // não apenas novas respostas.
          event: '*',
          schema: 'public',
          table: 'volunteers',
        },
        () => {
          loadCommunityData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Ordenado da maior para a menor afinidade — vira um ranking
  const chartData = categories
    .map((cat) => ({
      name: `${cat.emoji} ${cat.name}`,
      plainName: cat.name,
      value: averages[cat.name] ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  const leaderName = chartData[0]?.plainName;

  const stats = [
    { emoji: '🙌', label: 'Voluntários', value: String(totalVolunteers) },
    { emoji: '💛', label: 'Média geral', value: formatBR(averageScore) },
    {
      emoji: '🏆',
      label: 'Área mais procurada',
      value: topCategory ? `${topCategory.emoji} ${topCategory.name}` : '—',
      small: true,
    },
    {
      emoji: '✨',
      label: 'Pontos de serviço',
      value: totalPoints.toLocaleString('pt-BR'),
    },
  ];

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Título */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-700">
            📊 Visão da comunidade
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Como nossa comunidade deseja servir
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Cada resposta fortalece esta visão coletiva da igreja.
          </p>

          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Atualizado em tempo real
          </span>
        </div>

        {loading ? (
          /* Esqueleto de carregamento */
          <div className="animate-pulse">
            <div className="mb-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-gray-100" />
              ))}
            </div>
            <div className="rounded-3xl bg-gray-100" style={{ height: 480 }} />
          </div>
        ) : totalVolunteers === 0 ? (
          /* Estado vazio */
          <div className="rounded-3xl border-2 border-dashed border-yellow-200 bg-yellow-50 p-10 text-center sm:p-14">
            <div className="text-5xl">🙌</div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">
              Ainda não há respostas
            </h3>
            <p className="mx-auto mt-2 max-w-md text-gray-600">
              Seja a primeira pessoa a responder ao chamado e ajude a formar
              esta visão coletiva.
            </p>
            <a
              href="#formulario"
              className="mt-6 inline-block rounded-xl bg-yellow-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-yellow-600"
            >
              Responder ao chamado
            </a>
          </div>
        ) : (
          <>
            {/* Cards de estatísticas */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-xl">
                    {stat.emoji}
                  </div>
                  <p
                    className={`mt-3 font-bold text-gray-900 ${
                      stat.small ? 'text-lg sm:text-xl' : 'text-3xl'
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Gráfico */}
            <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-xl sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 px-2">
                <h3 className="font-semibold text-gray-900">
                  Afinidade média por área
                </h3>
                <span className="text-xs text-gray-400">
                  Escala de 0 a 10
                </span>
              </div>

              <div style={{ height: 460 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      strokeDasharray="3 3"
                      stroke="#F3F4F6"
                    />

                    <XAxis
                      type="number"
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={130}
                      interval={0}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#374151', fontSize: 13 }}
                    />

                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: 'rgba(250, 204, 21, 0.08)' }}
                    />

                    <Bar
                      dataKey="value"
                      radius={[0, 8, 8, 0]}
                      barSize={22}
                      animationDuration={900}
                      animationEasing="ease-out"
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.plainName}
                          fill={
                            entry.plainName === leaderName
                              ? BAR_COLOR_LEADER
                              : BAR_COLOR
                          }
                        />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        fill="#6B7280"
                        fontSize={12}
                        fontWeight={600}
                        formatter={(value: any) => formatBR(Number(value))}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CommunityChart;





// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from 'recharts';

// const categories = [
//   'Natureza',
//   'Animais',
//   'Crianças',
//   'Idosos',

//   'Famílias',


// ];

// const CommunityChart = () => {

//   const [data, setData] = useState<Record<string, number>>({
//     Natureza: 0,
//     Animais: 0,
//     Crianças: 0,
//     Idosos: 0,

//     Famílias: 0,



//   });
//   const [totalVolunteers, setTotalVolunteers] = useState(0);

//   const [averageScore, setAverageScore] = useState(0);

//   const [topCategory, setTopCategory] = useState("");

//   const [totalPoints, setTotalPoints] = useState(0);

//   async function loadCommunityData() {

//     const { data: volunteers, error } = await supabase
//       .from("volunteers")
//       .select("*");

//     if (error) {
//       console.error(error);
//       return;
//     }

//     const totals: Record<string, number> = {
//       Natureza: 0,
//       Animais: 0,
//       Crianças: 0,
//       Idosos: 0,
//       PCD: 0,
//       Famílias: 0,
//       Empresas: 0,
//       Hospitais: 0,
//       Presídios: 0,
//     };

//     volunteers.forEach((v: any) => {

//       totals.Natureza += v.natureza;
//       totals.Animais += v.animais;
//       totals.Crianças += v.criancas;
//       totals.Idosos += v.idosos;
//       totals.PCD += v.pcd;
//       totals.Famílias += v.familias;
//       totals.Empresas += v.empresas;
//       totals.Hospitais += v.hospitais;
//       totals.Presídios += v.presidios;

//     });
//     const averages: Record<string, number> = {};

//         categories.forEach((category) => {

//           averages[category] =
//             volunteers.length > 0
//               ? Number(
//                   (
//                     totals[category] /
//                     volunteers.length
//                   ).toFixed(1)
//                 )
//               : 0;

//         });

//     // Total de voluntários
//       setTotalVolunteers(volunteers.length);

//       // Total de pontos
//       const points =
//         Object.values(totals).reduce(
//           (acc, value) => acc + value,
//           0
//         );

//       setTotalPoints(points);

//       // Média geral

//       const average =
//         volunteers.length > 0
//           ? points / (volunteers.length * categories.length)
//           : 0;

//       setAverageScore(Number(average.toFixed(1)));

//       // Categoria mais votada

//       const winner = Object.entries(totals)
//         .sort((a, b) => b[1] - a[1])[0];

//       setTopCategory(winner?.[0] ?? "");

//     setData(averages);

//   }

// useEffect(() => {
//   loadCommunityData();

//   const channel = supabase
//     .channel("community-chart")
//     .on(
//       "postgres_changes",
//       {
//         event: "INSERT",
//         schema: "public",
//         table: "volunteers",
//       },
//       (payload) => {
//         console.log("RealTime:", payload);
//         loadCommunityData();
//       }
//     )
//     .subscribe();

//   return () => {
//     supabase.removeChannel(channel);
//   };

// }, []);

//   const chartData = categories.map((cat) => ({
//     name: cat,
//     value: data[cat],
//   }));

//   return (

//     <section className="py-20 bg-white">

//       <div className="max-w-6xl mx-auto px-6">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">

//           <div className="bg-yellow-50 rounded-2xl shadow p-6 text-center">

//             <p className="text-4xl font-bold text-yellow-600">
//               {totalVolunteers}
//             </p>

//             <p className="text-gray-600 mt-2">
//               Voluntários
//             </p>

//           </div>

//           <div className="bg-yellow-50 rounded-2xl shadow p-6 text-center">

//             <p className="text-4xl font-bold text-yellow-600">
//               {averageScore}
//             </p>

//             <p className="text-gray-600 mt-2">
//               Média Geral
//             </p>

//           </div>

//           <div className="bg-yellow-50 rounded-2xl shadow p-6 text-center">

//             <p className="text-4xl font-bold text-yellow-600">
//               {topCategory}
//             </p>

//             <p className="text-gray-600 mt-2">
//               Área mais procurada
//             </p>

//           </div>

//           <div className="bg-yellow-50 rounded-2xl shadow p-6 text-center">

//             <p className="text-4xl font-bold text-yellow-600">
//               {totalPoints}
//             </p>

//             <p className="text-gray-600 mt-2">
//               Pontos de Serviço
//             </p>

//           </div>

//         </div>

//         <h2 className="text-4xl font-bold text-center text-gray-900">
//           📊 Como nossa comunidade deseja servir
//         </h2>

//         <p className="text-center text-gray-600 mt-4 mb-10">
//           Cada resposta fortalece esta visão coletiva da igreja.
//         </p>

//         <div className="h-[420px]">

//           <ResponsiveContainer width="100%" height="100%">

//             <BarChart data={chartData}>

//               <CartesianGrid strokeDasharray="3 3" />

//               <XAxis
//                 dataKey="name"
//                 interval={0}
//                 angle={-25}
//                 textAnchor="end"
//                 height={80}
//               />

//               <YAxis 
//                 domain={[0,10]}
//                 ticks={[0,2,4,6,8,10]}
//               />

//               <Tooltip 
//                 formatter={(value:any) => [`${value}/10`, "Afinidade"]}
//               />

//               <Bar
//                 dataKey="value"
//                 radius={[8, 8, 0, 0]}
//                 fill="#f59e0b"
//                 animationDuration={1200}
//                 animationEasing="ease-out"
//               />

//             </BarChart>

//           </ResponsiveContainer>

//         </div>

//       </div>

//     </section>

//   );

// };

// export default CommunityChart;