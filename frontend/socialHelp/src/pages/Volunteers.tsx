import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import VolunteerCard from "../components/VolunteerCard";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("date");

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

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-2">
        ❤️ Voluntários cadastrados
      </h1>

      <div className="flex justify-end mb-8">

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >

          <option value="date">
            Mais recentes
          </option>

          <option value="name">
            Nome (A-Z)
          </option>

          <option value="score">
            Maior afinidade geral
          </option>

        </select>

      </div>

      <p className="text-gray-500 mb-8">
        Total: {volunteers.length} pessoas
      </p>

      <div className="space-y-6">
        {sortedVolunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            volunteer={volunteer}
          />
        ))}
       
      </div>
    </div>
  );
};

export default Volunteers;