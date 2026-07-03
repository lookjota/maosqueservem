import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Feature from '../components/Feature'
import Hero from '../components/Hero'
import NossaMissao from '../components/NossaMissao'
import ConviteAoServico from '../components/ConviteAoServico'
import MissionGrid from '../components/MissionGrid'
import InterestForm from '../components/InterestForm'
import ResultSection from '../components/ResultSection'
import { supabase } from '../lib/supabase' // 🔥 AJUSTE AQUI (IMPORTANTE)
import CommunityChart from '../components/CommunityChart'
import LiveCommunityFeed from "../components/LiveCommunityFeed";

const Home = () => {

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

    return (
    <>

      <Navbar />
      <Hero />
      <NossaMissao />
      <ConviteAoServico />
      <MissionGrid />

      {/* <CommunityChart refresh={refreshChart} /> */}
      <CommunityChart />
      <LiveCommunityFeed />


        <InterestForm
          onFinish={(data) => {
            setResult(data.values);
          }}
        />

      {result && <ResultSection result={result} />}

      <Feature />
    </>
  )
}

export default Home