import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import NossaMissao from '../components/NossaMissao'
import MissionGrid from '../components/MissionGrid'
import InterestForm from '../components/InterestForm'
import ResultSection from '../components/ResultSection'
import { supabase } from '../lib/supabase' // 🔥 AJUSTE AQUI (IMPORTANTE)
import CommunityChart from '../components/CommunityChart'
import LiveCommunityFeed from "../components/LiveCommunityFeed";
import { useToast } from "../context/ToastContext";
import { eventBus } from '../lib/eventBus'
import FinalMessage from '../components/FinalMessage'
import AngelBattle from '../components/AngelBattle'


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
          const handler = (data: any) => {
            addToast({
              title: `${data.name} acabou de responder`,
              message: `❤️ Nova participação registrada na comunidade`,
            });
          };

          eventBus.on("volunteer:new", handler);

          return () => {
            eventBus.off("volunteer:new", handler);
          };
        }, []);

    return (
    <>

      <Navbar />
      <section id="home">
      
      
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


        
        {result && <ResultSection result={result} />}
                <AngelBattle />
      <section id="comunidade">
        <CommunityChart />
      </section>
      </section>
      
       <LiveCommunityFeed />
       
       {/* <CommunityChart refresh={refreshChart} /> */}

     
        <Hero />
      </section>
      <NossaMissao />

      <section id="servicos">
        <MissionGrid />
      </section>


      

      <FinalMessage />
    </>
  )
}

export default Home