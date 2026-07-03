import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import VolunteerCard from "../components/VolunteerCard";
import VolunteerStats from "../components/VolunteerStats";
import { useNavigate } from "react-router-dom";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("date");
  const [search, setSearch] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    async function loadVolunteers() {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setVolunteers(data);
    }

    loadVolunteers();
  }, []);

  const sortedVolunteers = [...volunteers].sort((a, b) => {

  if (sortBy === "name") {
    return a.name.localeCompare(b.name);
  }

  if (sortBy === "score") {

    const scoreA =
      a.natureza +
      a.animais +
      a.criancas +
      a.idosos +
      a.pcd +
      a.familias +
      a.empresas +
      a.hospitais +
      a.presidios;

    const scoreB =
      b.natureza +
      b.animais +
      b.criancas +
      b.idosos +
      b.pcd +
      b.familias +
      b.empresas +
      b.hospitais +
      b.presidios;

    return scoreB - scoreA;
  }

  return (
    new Date(b.created_at).getTime() -
    new Date(a.created_at).getTime()
  );

});

const filteredVolunteers = sortedVolunteers.filter((volunteer) => {

  const text = search.toLowerCase();

  return (
    volunteer.name.toLowerCase().includes(text) ||
    volunteer.whatsapp.includes(search)
  );

});

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex justify-start mb-6">
        <button
          onClick={() => navigate("/")}
          className="
            flex items-center gap-2
            px-4 py-2
            bg-yellow-500 text-white
            rounded-xl shadow-md
            hover:bg-yellow-600
            transition transform hover:scale-105
          "
        >
          ← Home
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-2">
        ❤️ Voluntários cadastrados
      </h1>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">

        <input
          type="text"
          placeholder="🔍 Procurar por nome ou WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            md:w-96
            border
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-yellow-400
          "
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="
            border
            rounded-xl
            px-4
            py-3
          "
        >

          <option value="date">
            Mais recentes
          </option>

          <option value="name">
            Nome (A-Z)
          </option>

          <option value="score">
            Maior afinidade
          </option>

        </select>

      </div>

      <p className="text-gray-500 mb-8">
        Total: {volunteers.length} pessoas
      </p>

      <VolunteerStats volunteers={volunteers} />

      <div className="space-y-6">
        {filteredVolunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            volunteer={volunteer}
          />
        ))}
       
      </div>
      {filteredVolunteers.length === 0 && (

          <div className="text-center py-20">

            <h2 className="text-3xl font-bold text-gray-700">
              Nenhum voluntário encontrado
            </h2>

            <p className="text-gray-500 mt-3">
              Tente pesquisar outro nome ou WhatsApp.
            </p>

          </div>

        )}
    </div>
  );
};

export default Volunteers;