import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import NossaMissao from '../components/NossaMissao'
import ConviteAoServico from '../components/ConviteAoServico'
import MissionGrid from '../components/MissionGrid'
import InterestForm from '../components/InterestForm'
import ResultSection from '../components/ResultSection'
import { supabase } from '../lib/supabase' // 🔥 AJUSTE AQUI (IMPORTANTE)
import CommunityChart from '../components/CommunityChart'
import LiveCommunityFeed from "../components/LiveCommunityFeed";
import { ToastProvider, useToast } from "../context/ToastContext";
import { eventBus } from '../lib/eventBus'
import FinalMessage from '../components/FinalMessage'

const Home = () => {
  const { addToast } = useToast();

    const [result, setResult] = useState<Record<string, number> | null>(null);


    useEffect(() => {

      async function testConnection() {

        const { data, error } = await supabase
          .from("volunteers")
          .select("*");

        console.log("DATA:", data);
        console.log("ERROR:", error);

      }

      testConnection();

    }, []);

    useEffect(() => {
  eventBus.on("volunteer:new", (data) => {
    addToast({
      title: `${data.name} acabou de responder`,
      message: `❤️ Nova participação registrada na comunidade`,
    });
  });
}, []);
    return (
    <>

      <Navbar />
      <section id="home">
        <Hero />
      </section>
      <NossaMissao />

      <ConviteAoServico />
      <section id="servicos">
        <MissionGrid />
      </section>

      {/* <CommunityChart refresh={refreshChart} /> */}
      <section id="comunidade">
        <CommunityChart />
      </section>
      <LiveCommunityFeed />

      <section id="formulario">
        <InterestForm
          onFinish={(data) => {
            setResult(data.values);

            setTimeout(() => {
              const el = document.getElementById("resultado");

              if (el) {
                el.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          }}
        />
      </section>

      {result && <ResultSection result={result} />}

      <FinalMessage />
    </>
  )
}

export default Home