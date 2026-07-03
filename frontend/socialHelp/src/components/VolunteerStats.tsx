
type Volunteer = {
  created_at: string;

  natureza: number;
  animais: number;
  criancas: number;
  idosos: number;
  pcd: number;
  familias: number;
  empresas: number;
  hospitais: number;
  presidios: number;
};

type Props = {
  volunteers: Volunteer[];
};

const VolunteerStats = ({ volunteers }: Props) => {

  const total = volunteers.length;

  const today = new Date().toLocaleDateString("pt-BR");

  const todayCount = volunteers.filter((v) =>
    new Date(v.created_at).toLocaleDateString("pt-BR") === today
  ).length;

  const totals = {
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

  volunteers.forEach((v) => {

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

  const topArea = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])[0];

  const totalScores = Object.values(totals)
    .reduce((acc, value) => acc + value, 0);

  const average =
    total === 0
      ? 0
      : totalScores / (total * 9);

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

      <Card
        icon="👥"
        title="Voluntários"
        value={total}
      />

      <Card
        icon="🌳"
        title="Área mais procurada"
        value={topArea?.[0]}
      />

      <Card
        icon="⭐"
        title="Média Geral"
        value={Number(average.toFixed(1))}
      />

      <Card
        icon="📅"
        title="Cadastros Hoje"
        value={todayCount}
      />

    </div>

  );
};

type CardProps = {
  icon: string;
  title: string;
  value: string | number;
};

const Card = ({ icon, title, value }: CardProps) => (

  <div className="
    bg-white
    rounded-2xl
    shadow-lg
    border
    p-8
    hover:shadow-xl
    transition
  ">

    <div className="text-4xl">
      {icon}
    </div>

    <p className="mt-5 text-gray-500">
      {title}
    </p>

    <h2 className="text-4xl font-bold text-yellow-600 mt-2">

      {typeof value === "number" ? (

        // <CountUp
        //   start={0}
        //   end={value}
        //   duration={2.2}
        //   separator="."
        //   decimals={Number.isInteger(value) ? 0 : 1}
        // />
        <div>123</div>

      ) : (

        value

      )}

    </h2>

  </div>

);

export default VolunteerStats;