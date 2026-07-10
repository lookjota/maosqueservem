import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { eventBus } from "../lib/eventBus";

type Volunteer = {
  id: number;
  name: string;
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

const LiveCommunityFeed = () => {

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [latestId, setLatestId] = useState<number | null>(null);

  async function loadVolunteers() {

    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error(error);
      return;
    }

    setVolunteers(data);

if (data.length > 0) {

    setLatestId(data[0].id);

    setTimeout(() => {

        setLatestId(null);

    }, 4000);

}

  }

useEffect(() => {
  loadVolunteers();

  eventBus.on("volunteer:new", () => {
    loadVolunteers();
  });

}, []);

  return (

    <section className="py-16">

      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center">
          👥 Comunidade Participando
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-10">
          Últimos voluntários cadastrados
        </p>

        <div className="space-y-5">

          {volunteers.map((person) => (

            <VolunteerCard

                key={person.id}

                volunteer={person}

                highlight={person.id === latestId}

            />
          ))}

        </div>

      </div>

    </section>

  );

};


type CardProps = {
  volunteer: Volunteer;
  highlight: boolean;
};

const VolunteerCard = ({ volunteer, highlight, }: CardProps) => {

  const scores = [
    { name: "Natureza", value: volunteer.natureza },
    { name: "Animais", value: volunteer.animais },
    { name: "Crianças", value: volunteer.criancas },
    { name: "Idosos", value: volunteer.idosos },
    // { name: "PCD", value: volunteer.pcd },
    // { name: "Famílias", value: volunteer.familias },
    // { name: "Empresas", value: volunteer.empresas },
    // { name: "Hospitais", value: volunteer.hospitais },
    // { name: "Presídios", value: volunteer.presidios },
  ];

  scores.sort((a, b) => b.value - a.value);

  const favorite = scores[0];

  return (

<div
    className={`
        rounded-2xl
        p-6
        border
        shadow-lg
        transition-all
        duration-700

        ${
            highlight
                ? "bg-yellow-50 border-yellow-300 shadow-yellow-200 scale-[1.02]"
                : "bg-white border-gray-100"
        }
    `}
>
      <div className="flex justify-between items-center">

        <div>

          <h3 className="font-bold text-lg">
            {volunteer.name}
          </h3>

          <p className="text-gray-500">

            ❤️ Afinidade:
            <span className="font-semibold ml-1">

              {favorite.name}

            </span>

          </p>

        </div>

        <div className="text-sm text-gray-400">

          {new Date(volunteer.created_at).toLocaleString("pt-BR")}

        </div>

      </div>

    </div>

  );

};
export default LiveCommunityFeed;