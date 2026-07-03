import { useEffect, useRef, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import { startRealtime } from "./lib/realtime";
import { startActivityCounter } from "./lib/activityStore";

function App() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    started.current = true;
    startRealtime();
  }, []);

  useEffect(() => {
    startRealtime();
    startActivityCounter();
  }, []);
  return (
    <div>
      <Home />
    </div>
  )
}

export default App
