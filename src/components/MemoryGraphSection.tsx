'use client';

import { useEffect, useRef, useState } from 'react';
import { DEMO_FAMILY, DEMO_MEMORIES } from '@/lib/demoData';

interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'place' | 'year' | 'object' | 'emotion';
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: string[];
  description?: string;
}

interface GraphEdge {
  source: string;
  target: string;
}

const NODES: GraphNode[] = [
  { id: 'ramesh', label: 'Ramesh Sharma', type: 'person', x: 400, y: 300, vx: 0, vy: 0, connections: ['savitri', 'priya', 'varanasi', 'mumbai', 'father', 'ananya'], description: 'Schoolteacher, 1942–present' },
  { id: 'savitri', label: 'Savitri', type: 'person', x: 250, y: 200, vx: 0, vy: 0, connections: ['ramesh', 'priya', 'allahabad'], description: 'Wife, 1945–2019' },
  { id: 'priya', label: 'Priya', type: 'person', x: 550, y: 180, vx: 0, vy: 0, connections: ['ramesh', 'savitri', 'ananya', 'mumbai'], description: 'Daughter, b. 1975' },
  { id: 'ananya', label: 'Ananya', type: 'person', x: 650, y: 100, vx: 0, vy: 0, connections: ['priya', 'ramesh'], description: 'Granddaughter, b. 2000' },
  { id: 'father', label: 'Shyam Narayan', type: 'person', x: 200, y: 380, vx: 0, vy: 0, connections: ['ramesh', 'varanasi', 'radio'], description: 'Father, 1912–1988' },
  { id: 'varanasi', label: 'Varanasi', type: 'place', x: 250, y: 450, vx: 0, vy: 0, connections: ['ramesh', 'father', '1952', 'radio', '1960'], description: 'City of childhood' },
  { id: 'allahabad', label: 'Allahabad', type: 'place', x: 150, y: 250, vx: 0, vy: 0, connections: ['savitri', 'ramesh', '1963'], description: 'University years' },
  { id: 'mumbai', label: 'Mumbai', type: 'place', x: 550, y: 400, vx: 0, vy: 0, connections: ['ramesh', 'priya', '1983'], description: 'Home since 1983' },
  { id: 'radio', label: 'Murphy Radio', type: 'object', x: 120, y: 420, vx: 0, vy: 0, connections: ['varanasi', 'father', '1952'], description: 'First radio, 1952' },
  { id: '1952', label: '1952', type: 'year', x: 180, y: 500, vx: 0, vy: 0, connections: ['varanasi', 'radio', 'ramesh'], description: 'The Murphy Radio' },
  { id: '1960', label: '1960', type: 'year', x: 320, y: 520, vx: 0, vy: 0, connections: ['varanasi', 'ramesh'], description: 'The Great Floods' },
  { id: '1963', label: '1963', type: 'year', x: 180, y: 180, vx: 0, vy: 0, connections: ['allahabad', 'ramesh'], description: 'Leaves for university' },
  { id: '1983', label: '1983', type: 'year', x: 520, y: 480, vx: 0, vy: 0, connections: ['mumbai', 'ramesh'], description: 'The move to Mumbai' },
  { id: 'wonder', label: 'Wonder', type: 'emotion', x: 80, y: 320, vx: 0, vy: 0, connections: ['radio', 'ramesh', '1952'], description: 'On first hearing the radio' },
];

const EDGES: GraphEdge[] = NODES.flatMap(node =>
  node.connections.map(targetId => ({ source: node.id, target: targetId }))
).filter((e, i, arr) =>
  arr.findIndex(e2 => (e2.source === e.target && e2.target === e.source) || (e2.source === e.source && e2.target === e.target)) === i
);

const TYPE_COLORS: Record<string, string> = {
  person: 'var(--accent-gold)',
  place: 'var(--accent-green-bright)',
  year: 'var(--text-secondary)',
  object: '#c87c6a',
  emotion: '#d4937e',
};

const TYPE_RADIUS: Record<string, number> = {
  person: 8,
  place: 7,
  year: 5,
  object: 6,
  emotion: 5,
};

export default function MemoryGraphSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>(NODES);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const animRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>(NODES);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const updateDims = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement!.getBoundingClientRect();
        setDimensions({ w: rect.width, h: Math.min(rect.height || 600, 600) });
      }
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Force-directed layout simulation
  useEffect(() => {
    if (!visible) return;

    const simulate = () => {
      const ns = [...nodesRef.current];
      const W = dimensions.w;
      const H = dimensions.h;

      // Repulsion between nodes
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x;
          const dy = ns[i].y - ns[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = Math.min(2000 / (dist * dist), 4);
          ns[i].vx += (dx / dist) * force;
          ns[i].vy += (dy / dist) * force;
          ns[j].vx -= (dx / dist) * force;
          ns[j].vy -= (dy / dist) * force;
        }
      }

      // Attraction along edges
      EDGES.forEach(edge => {
        const src = ns.find(n => n.id === edge.source);
        const tgt = ns.find(n => n.id === edge.target);
        if (!src || !tgt) return;
        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 140;
        const force = (dist - targetDist) * 0.02;
        src.vx += (dx / dist) * force;
        src.vy += (dy / dist) * force;
        tgt.vx -= (dx / dist) * force;
        tgt.vy -= (dy / dist) * force;
      });

      // Center attraction
      ns.forEach(n => {
        n.vx += (W / 2 - n.x) * 0.003;
        n.vy += (H / 2 - n.y) * 0.003;
        // Damping
        n.vx *= 0.85;
        n.vy *= 0.85;
        // Apply velocity
        n.x = Math.max(30, Math.min(W - 30, n.x + n.vx));
        n.y = Math.max(30, Math.min(H - 30, n.y + n.vy));
      });

      nodesRef.current = ns;
      setNodes([...ns]);
      animRef.current = requestAnimationFrame(simulate);
    };

    animRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animRef.current);
  }, [visible, dimensions]);

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <section
      ref={sectionRef}
      id="memory-graph"
      className="relative py-32 px-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[300px_1fr] gap-16 items-start">
          {/* Left label area */}
          <div
            className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="archival-label mb-6" style={{ letterSpacing: '0.25em' }}>
              LIVING MEMORY GRAPH
            </div>
            <h2
              className="font-display text-3xl md:text-4xl font-light text-primary leading-[1.2]"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              People, places,<br />
              and moments —<br />
              <em className="text-gold not-italic">connected.</em>
            </h2>

            <div className="mt-8 w-8 h-px bg-gold" />

            <p className="mt-6 text-secondary text-sm leading-[1.8]" style={{ fontFamily: 'var(--font-display)' }}>
              Every memory adds new relationships to the living graph. Stories become visible.
              Connections become clear across generations.
            </p>

            {/* Legend */}
            <div className="mt-10 flex flex-col gap-3">
              {(['person', 'place', 'year', 'object', 'emotion'] as const).map(type => (
                <div key={type} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: TYPE_COLORS[type] }}
                    aria-hidden="true"
                  />
                  <span className="archival-label">{type.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Hovered node info */}
            {hoveredNode && (
              <div className="mt-10 p-5 border border-[var(--border-medium)] bg-[var(--bg-surface)]">
                <div className="archival-label mb-2" style={{ color: TYPE_COLORS[hoveredNode.type] }}>
                  {hoveredNode.type.toUpperCase()}
                </div>
                <div className="font-display text-lg text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                  {hoveredNode.label}
                </div>
                {hoveredNode.description && (
                  <div className="mt-2 text-muted text-sm">{hoveredNode.description}</div>
                )}
                <div className="mt-3 text-muted text-xs">
                  {hoveredNode.connections.length} connections
                </div>
              </div>
            )}
          </div>

          {/* Graph canvas */}
          <div
            className={`relative h-[500px] lg:h-[600px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all duration-1000 delay-200 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              role="img"
              aria-label="Interactive family memory graph"
            >
              <defs>
                <radialGradient id="node-glow">
                  <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0"/>
                </radialGradient>
              </defs>

              {/* Edges */}
              {EDGES.map((edge, i) => {
                const src = nodeMap.get(edge.source);
                const tgt = nodeMap.get(edge.target);
                if (!src || !tgt) return null;
                const isHighlighted = hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target);
                return (
                  <line
                    key={i}
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isHighlighted ? 'var(--accent-gold)' : 'var(--border-medium)'}
                    strokeWidth={isHighlighted ? 1.5 : 0.8}
                    strokeOpacity={isHighlighted ? 0.6 : 0.4}
                    strokeDasharray={isHighlighted ? undefined : "3,3"}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const r = TYPE_RADIUS[node.type] || 6;
                const isHovered = hoveredNode?.id === node.id;
                const isConnected = hoveredNode?.connections.includes(node.id);
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x},${node.y})`}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    aria-label={`${node.type}: ${node.label}`}
                    tabIndex={0}
                    onFocus={() => setHoveredNode(node)}
                    onBlur={() => setHoveredNode(null)}
                  >
                    {isHovered && (
                      <circle r={r * 3} fill="url(#node-glow)" />
                    )}
                    <circle
                      r={isHovered ? r * 1.5 : isConnected ? r * 1.2 : r}
                      fill={TYPE_COLORS[node.type]}
                      opacity={isHovered ? 1 : isConnected ? 0.85 : 0.7}
                      style={{ transition: 'r 0.2s, opacity 0.2s' }}
                    />
                    {(isHovered || node.type === 'person') && (
                      <text
                        y={-r - 5}
                        textAnchor="middle"
                        fill={isHovered ? TYPE_COLORS[node.type] : 'var(--text-muted)'}
                        fontSize={isHovered ? "11" : "9"}
                        fontFamily="var(--font-body)"
                        letterSpacing="0.05em"
                        style={{ transition: 'all 0.2s' }}
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Instruction */}
            <div
              className="absolute bottom-4 right-4 archival-label"
              style={{ fontSize: '9px' }}
            >
              HOVER TO EXPLORE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
