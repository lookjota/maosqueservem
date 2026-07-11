import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * AngelBattle.tsx
 * Animação decorativa em SVG (React + Framer Motion) representando
 * um pequeno anjo de luz enfrentando uma criatura sombria.
 *
 * - Não bloqueia cliques (pointer-events: none)
 * - Sem position fixed/absolute fora do próprio SVG
 * - Loop infinito de ~5s
 * - Grupos separados: angel / enemy / effects
 */

const CYCLE = 5; // duração total do ciclo em segundos

// ---------- Timeline do anjo (avanço, golpe, retorno) ----------
const mainTimes = [0, 0.3, 0.38, 0.46, 0.5, 0.9, 1];
const angelX = [0, 0, 0, 150, 150, 0, 0];
const angelY = [0, -5, -7, -7, -6, 0, 0];

// Rotação da espada: repouso -> erguida -> golpe -> baixa novamente
const swordRotate = [0, 0, -70, -10, 10, 0, 0];

// ---------- Timeline do inimigo (recuo, tremor, perda de opacidade) ----------
const enemyTimes = [0, 0.38, 0.44, 0.46, 0.5, 0.56, 0.62, 0.7, 0.88, 1];
const enemyX = [0, 0, 0, -12, 10, -6, 3, 0, 0, 0];
// A criatura agora é derrotada de verdade: some por completo (0.7), permanece
// invisível por ~1s (0.7 -> 0.88 de um ciclo de 5s) e só então reaparece aos poucos.
const enemyOpacity = [0.92, 0.92, 0.92, 0.92, 0.55, 0.35, 0.12, 0, 0, 0.92];

// ---------- Flash do impacto ----------
const flashTimes = [0, 0.43, 0.45, 0.47, 0.53, 1];
const flashOpacity = [0, 0, 1, 0.35, 0, 0];
const flashScale = [0.3, 0.3, 1.5, 1.1, 0.5, 0.3];

// Partículas de luz (impacto) — ângulos distribuídos ao redor do ponto de golpe
const LIGHT_PARTICLES = Array.from({ length: 6 }).map((_, i) => {
  const angle = (i / 6) * Math.PI * 2;
  return { dx: Math.cos(angle) * 34, dy: Math.sin(angle) * 24, delay: i * 0.01 };
});

// Partículas escuras que se dissipam da criatura
const DARK_PARTICLES = Array.from({ length: 4 }).map((_, i) => {
  const angle = (i / 4) * Math.PI * 2 + 0.4;
  return { dx: Math.cos(angle) * 20, dy: -18 - i * 6, delay: i * 0.015 };
});

const IMPACT_X = 470; // ponto de impacto relativo ao grupo do anjo (x local do anjo)
const IMPACT_Y = 110;

export default function AngelBattle() {
  const particleTimes = useMemo(() => [0, 0.44, 0.46, 0.5, 0.58, 1], []);

  // Parallax discreto: acompanha a rolagem da página com um deslocamento
  // vertical pequeno (~40px de amplitude total), sem sair do fluxo do layout
  // e sem position: fixed.
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <motion.div
      ref={containerRef}
      style={{ y: parallaxY }}
      className="w-full h-[220px] pointer-events-none select-none overflow-hidden"
    >
      <svg
        viewBox="0 0 800 220"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ pointerEvents: "none", display: "block", background: "transparent" }}
      >
        <defs>
          <radialGradient id="haloGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flashGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#fde68a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          {/* Sombra muito suave para o anjo se destacar sobre fundos claros */}
          <filter id="angelShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#94a3b8" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* ===================== GRUPO: ANGEL ===================== */}
        <motion.g
          id="angel"
          animate={{ x: angelX, y: angelY }}
          transition={{ duration: CYCLE, times: mainTimes, repeat: Infinity, ease: "easeInOut" }}
        >
          <g transform="translate(150,110)">
            {/* Aura pulsante */}
            <motion.circle
              r={34}
              fill="url(#haloGradient)"
              filter="url(#softBlur)"
              animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Auréola */}
            <motion.ellipse
              cx={0}
              cy={-34}
              rx={11}
              ry={4}
              fill="none"
              stroke="#f5b301"
              strokeWidth={3}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Asa esquerda */}
            <motion.path
              d="M -6 -8 C -26 -18, -34 -2, -30 14 C -22 6, -12 2, -4 4 Z"
              fill="#f8fafc"
              stroke="#94a3b8"
              strokeWidth={1}
              opacity={1}
              style={{ transformOrigin: "-4px -2px" }}
              animate={{ rotate: [-6, 12, -6] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Asa direita */}
            <motion.path
              d="M 6 -8 C 26 -18, 34 -2, 30 14 C 22 6, 12 2, 4 4 Z"
              fill="#f8fafc"
              stroke="#94a3b8"
              strokeWidth={1}
              opacity={1}
              style={{ transformOrigin: "4px -2px" }}
              animate={{ rotate: [6, -12, 6] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Corpo e cabeça — contorno sutil + sombra suave para contraste em fundos claros */}
            <g filter="url(#angelShadow)">
              <path
                d="M -8 0 C -8 20, 8 20, 8 0 C 8 -6, -8 -6, -8 0 Z"
                fill="#fefce8"
                stroke="#94a3b8"
                strokeWidth={1}
              />
              <circle cx={0} cy={-14} r={7} fill="#fff7ed" stroke="#94a3b8" strokeWidth={1} />
            </g>

            {/* Espada luminosa */}
            <motion.g
              style={{ transformOrigin: "6px -4px" }}
              animate={{ rotate: swordRotate }}
              transition={{ duration: CYCLE, times: mainTimes, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* brilho por trás da lâmina, para a espada ficar mais luminosa */}
              <rect x={3.4} y={-31} width={5.6} height={28} rx={2.8} fill="#fff7d6" opacity={0.6} filter="url(#softBlur)" />
              <rect x={5} y={-30} width={2.4} height={26} rx={1.2} fill="#fffdf5" />
              <rect x={1} y={-6} width={10} height={2.4} rx={1.2} fill="#f59e0b" />
            </motion.g>
          </g>
        </motion.g>

        {/* ===================== GRUPO: ENEMY ===================== */}
        <motion.g
          id="enemy"
          animate={{ x: enemyX, opacity: enemyOpacity }}
          transition={{ duration: CYCLE, times: enemyTimes, repeat: Infinity, ease: "easeInOut" }}
        >
          <g transform="translate(600,112)">
            <motion.path
              d="M 0 -30 C 16 -30, 24 -10, 20 8 C 26 16, 18 30, 6 30 C -6 34, -22 24, -22 8
                 C -26 -6, -18 -22, 0 -30 Z"
              fill="#1f2937"
              filter="url(#softBlur)"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx={-6} cy={-6} r={2} fill="#f87171" opacity={0.85} />
            <circle cx={6} cy={-6} r={2} fill="#f87171" opacity={0.85} />
          </g>
        </motion.g>

        {/* ===================== GRUPO: EFFECTS ===================== */}
        <g id="effects" transform="translate(150,110)">
          {/* Flash de impacto */}
          <motion.circle
            cx={IMPACT_X - 150}
            cy={IMPACT_Y - 110}
            r={26}
            fill="url(#flashGradient)"
            animate={{ opacity: flashOpacity, scale: flashScale }}
            transition={{ duration: CYCLE, times: flashTimes, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Partículas de luz */}
          {LIGHT_PARTICLES.map((p, i) => (
            <motion.circle
              key={`light-${i}`}
              cx={IMPACT_X - 150}
              cy={IMPACT_Y - 110}
              r={2.4}
              fill="#fde68a"
              animate={{
                cx: [IMPACT_X - 150, IMPACT_X - 150, IMPACT_X - 150 + p.dx, IMPACT_X - 150 + p.dx * 1.4, IMPACT_X - 150, IMPACT_X - 150],
                cy: [IMPACT_Y - 110, IMPACT_Y - 110, IMPACT_Y - 110 + p.dy, IMPACT_Y - 110 + p.dy * 1.4, IMPACT_Y - 110, IMPACT_Y - 110],
                opacity: [0, 0, 1, 0, 0, 0],
              }}
              transition={{ duration: CYCLE, times: particleTimes, repeat: Infinity, ease: "easeOut", delay: p.delay }}
            />
          ))}

          {/* Partículas escuras dissipando da criatura */}
          {DARK_PARTICLES.map((p, i) => (
            <motion.circle
              key={`dark-${i}`}
              cx={600 - 150 + p.dx / 3}
              cy={112 - 110}
              r={2}
              fill="#374151"
              animate={{
                cy: [112 - 110, 112 - 110, (112 - 110) + p.dy, (112 - 110) + p.dy * 1.6],
                opacity: [0, 0, 0.7, 0],
              }}
              transition={{
                duration: CYCLE,
                times: [0, 0.46, 0.6, 0.85],
                repeat: Infinity,
                ease: "easeOut",
                delay: p.delay,
              }}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}