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
} from 'recharts';

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

const CommunityChart = () => {

  const [data, setData] = useState<Record<string, number>>({
    Natureza: 0,
    Animais: 0,
    Crianças: 0,
    Idosos: 0,
    PCD: 0,
    Famílias: 0,
    Empresas: 0,
    Hospitais: 0,
    Presídios: 0,
  });
  const [totalVolunteers, setTotalVolunteers] = useState(0);

  const [averageScore, setAverageScore] = useState(0);

  const [topCategory, setTopCategory] = useState("");

  const [totalPoints, setTotalPoints] = useState(0);

  async function loadCommunityData() {

    const { data: volunteers, error } = await supabase
      .from("volunteers")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    const totals: Record<string, number> = {
      Natureza: 0,
      Animais: 0,
      Crianças: 0,
      Idosos: 0,
      PCD: 0,
      Famílias: 0,
      Empresas: 0,
      Hospitais: 0,
      Presídios: 0,
    };

    volunteers.forEach((v: any) => {

      totals.Natureza += v.natureza;
      totals.Animais += v.animais;
      totals.Crianças += v.criancas;
      totals.Idosos += v.idosos;
      totals.PCD += v.pcd;
      totals.Famílias += v.familias;
      totals.Empresas += v.empresas;
      totals.Hospitais += v.hospitais;
      totals.Presídios += v.presidios;

    });
    const averages: Record<string, number> = {};

        categories.forEach((category) => {

          averages[category] =
            volunteers.length > 0
              ? Number(
                  (
                    totals[category] /
                    volunteers.length
                  ).toFixed(1)
                )
              : 0;

        });

    // Total de voluntários
      setTotalVolunteers(volunteers.length);

      // Total de pontos
      const points =
        Object.values(totals).reduce(
          (acc, value) => acc + value,
          0
        );

      setTotalPoints(points);

      // Média geral

      const average =
        volunteers.length > 0
          ? points / (volunteers.length * categories.length)
          : 0;

      setAverageScore(Number(average.toFixed(1)));

      // Categoria mais votada

      const winner = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])[0];

      setTopCategory(winner?.[0] ?? "");

    setData(averages);

  }

useEffect(() => {
  loadCommunityData();

  const channel = supabase
    .channel("community-chart")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "volunteers",
      },
      (payload) => {
        console.log("RealTime:", payload);
        loadCommunityData();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, []);

  const chartData = categories.map((cat) => ({
    name: cat,
    value: data[cat],
  }));

  return (

    <section className="py-20 bg-white">

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">

          <div className="bg-yellow-50 rounded-2xl shadow p-6 text-center">

            <p className="text-4xl font-bold text-yellow-600">
              {totalVolunteers}
            </p>

            <p className="text-gray-600 mt-2">
              Voluntários
            </p>

          </div>

          <div className="bg-yellow-50 rounded-2xl shadow p-6 text-center">

            <p className="text-4xl font-bold text-yellow-600">
              {averageScore}
            </p>

            <p className="text-gray-600 mt-2">
              Média Geral
            </p>

          </div>

          <div className="bg-yellow-50 rounded-2xl shadow p-6 text-center">

            <p className="text-4xl font-bold text-yellow-600">
              {topCategory}
            </p>

            <p className="text-gray-600 mt-2">
              Área mais procurada
            </p>

          </div>

          <div className="bg-yellow-50 rounded-2xl shadow p-6 text-center">

            <p className="text-4xl font-bold text-yellow-600">
              {totalPoints}
            </p>

            <p className="text-gray-600 mt-2">
              Pontos de Serviço
            </p>

          </div>

        </div>

        <h2 className="text-4xl font-bold text-center text-gray-900">
          📊 Como nossa comunidade deseja servir
        </h2>

        <p className="text-center text-gray-600 mt-4 mb-10">
          Cada resposta fortalece esta visão coletiva da igreja.
        </p>

        <div className="h-[420px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={80}
              />

              <YAxis 
                domain={[0,10]}
                ticks={[0,2,4,6,8,10]}
              />

              <Tooltip 
                formatter={(value:any) => [`${value}/10`, "Afinidade"]}
              />

              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                fill="#f59e0b"
                animationDuration={1200}
                animationEasing="ease-out"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </section>

  );

};

export default CommunityChart;