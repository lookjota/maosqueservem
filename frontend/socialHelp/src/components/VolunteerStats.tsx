import { useEffect, useState } from "react";


type Volunteer = {
  created_at: string;

  natureza: number;
  animais: number;
  criancas: number;
  idosos: number;
  // pcd: number;
  // familias: number;
  // empresas: number;
  // hospitais: number;
  // presidios: number;
};

type Props = {
  volunteers: Volunteer[];
};
const VolunteerStats = ({ volunteers }: Props) => {

  const [visibleCards, setVisibleCards] = useState<number[]>([]);


      useEffect(() => {

      setVisibleCards([]);

      const timers = [0,1,2,3].map((index) => {

        return setTimeout(() => {

          setVisibleCards((prev) => [
            ...prev,
            index
          ]);

        }, index * 180);

      });


      return () => {

        timers.forEach(clearTimeout);

      };


    }, [volunteers]);



  const total = volunteers.length;

  const today = new Date().toLocaleDateString("pt-BR");

  const todayCount = volunteers.filter((v) =>
    new Date(v.created_at).toLocaleDateString("pt-BR") === today
  ).length;

  const totals = {
    Natureza: 0,
    Animais: 0,
    Orfanato: 0,
    Idosos: 0,
    // PCD: 0,
    // Famílias: 0,
    // Empresas: 0,
    // Hospitais: 0,
    // Presídios: 0,
  };

  volunteers.forEach((v) => {

    totals.Natureza += v.natureza;
    totals.Animais += v.animais;
    totals.Orfanato += v.criancas;
    totals.Idosos += v.idosos;
    // totals.PCD += v.pcd;
    // totals.Famílias += v.familias;
    // totals.Empresas += v.empresas;
    // totals.Hospitais += v.hospitais;
    // totals.Presídios += v.presidios;

  });

  const topArea = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])[0];

  const totalScores = Object.values(totals)
    .reduce((acc, value) => acc + value, 0);

  const average =
    total === 0
      ? 0
      : totalScores / (total * 9);

      const cards = [

  {
    icon:"👥",
    title:"Voluntários",
    value:total
  },

  {
    icon:"🌳",
    title:"Área mais procurada",
    value:topArea?.[0] ?? "-"
  },

  {
    icon:"⭐",
    title:"Média Geral",
    value:Number(average.toFixed(1))
  },

  {
    icon:"📅",
    title:"Cadastros Hoje",
    value:todayCount
  }

];

  return (

    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-4
      gap-6
      mb-12
      ">
        {
        cards.map((card,index)=>(

        <Card
          key={index}
          {...card}
          visible={visibleCards.includes(index)}
        />

        ))
        }

    </div>

  );
};

type CardProps = {
  icon: string;
  title: string;
  value: string | number;
  visible: boolean;
};

const Card = ({ icon, title, value, visible }: CardProps) => (

  <div
    className={`
    bg-white
    rounded-2xl
    shadow-lg
    border
    p-8
    hover:shadow-xl
    transition-all
    duration-700

    ${
    visible

    ?
    "opacity-100 translate-y-0"

    :

    "opacity-0 translate-y-6"

    }

    `}
    >

    <div className="text-4xl">
      {icon}
    </div>

    <p className="mt-5 text-gray-500">
      {title}
    </p>

    <h2 className="text-4xl font-bold text-yellow-600 mt-2">

      {/* {typeof value === "number" ? (

        // <CountUp
        //   start={0}
        //   end={value}
        //   duration={2.2}
        //   separator="."
        //   decimals={Number.isInteger(value) ? 0 : 1}
        // />
        value
      ) : (

        value

      )} */}
  {value}
    </h2>

  </div>

);

export default VolunteerStats;