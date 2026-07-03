import { useEffect, useRef } from 'react'
import './App.css'
import Home from './pages/Home'
import { startRealtime } from "./lib/realtime";
import { startActivityCounter } from "./lib/activityStore";
import Volunteers from './pages/Volunteers';
import { Route, Routes } from 'react-router-dom';

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/volunteers" element={<Volunteers />} />
      </Routes>
    </div>
  )
}

export default App
