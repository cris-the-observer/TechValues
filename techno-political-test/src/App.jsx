
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ChevronLeft, ChevronRight, Cpu, Share2, RotateCcw, Shield, Sparkles, Brain, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

/**
 * Techno‑Political Values — Fresh App (from scratch)
 * - 13 axes (12 core + UBI), 4 items each = 52 items total
 * - Questions are interleaved so you never answer a cluster from the same axis
 * - Results are hidden until submission
 */

const LIKERT = [
  { value: 0, label: "Strongly Disagree" },
  { value: 1, label: "Disagree" },
  { value: 2, label: "Neutral" },
  { value: 3, label: "Agree" },
  { value: 4, label: "Strongly Agree" },
];

const AXES = [
  {
    id: "tech_orientation",
    title: "Tech Orientation",
    leftLabel: "Primitivism",
    rightLabel: "Transhumanism",
    icon: Cpu,
    bins: [
      { max: 10, label: "Primalist" },
      { max: 25, label: "Primitivist" },
      { max: 40, label: "Neo‑Luddite" },
      { max: 59, label: "Status Quo / Bioconservative" },
      { max: 74, label: "Technologist" },
      { max: 89, label: "Transhumanist" },
      { max: 100, label: "Posthuman‑leaning" },
    ],
    items: [
      { id: "to1", dir: "left", text: "Daily life would improve if society relied on simpler tools." },
      { id: "to2", dir: "right", text: "Using technology to upgrade human abilities should be pursued." },
      { id: "to3", dir: "left", text: "Low‑tech fixes should be preferred when they match performance." },
      { id: "to4", dir: "right", text: "If technological enhancement is safe and voluntary, it’s good to push forward." },
    ],
  },
  {
    id: "state_stewardship",
    title: "State Stewardship",
    leftLabel: "Minimal State",
    rightLabel: "Maximal State",
    icon: Shield,
    bins: [
      { max: 20, label: "Minimal" },
      { max: 40, label: "Light‑touch" },
      { max: 60, label: "Mixed" },
      { max: 80, label: "Strong" },
      { max: 100, label: "Command" },
    ],
    items: [
      { id: "ss1", dir: "left", text: "Markets are better than ministries at picking technologies." },
      { id: "ss2", dir: "right", text: "Government should set direction for key platforms like AI and biotech." },
      { id: "ss3", dir: "left", text: "Experts can advise but shouldn’t have binding power." },
      { id: "ss4", dir: "right", text: "Public agencies must be able to halt deployments that risk harm." },
    ],
  },
  {
    id: "regulation_tempo",
    title: "Regulation Tempo",
    leftLabel: "De‑accel / Pause",
    rightLabel: "Acceleration",
    icon: Sparkles,
    bins: [
      { max: 20, label: "Active De‑accel" },
      { max: 40, label: "Pause" },
      { max: 60, label: "Cautious" },
      { max: 80, label: "No‑Pause" },
      { max: 100, label: "Accelerationist" },
    ],
    items: [
      { id: "rt1", dir: "left", text: "Frontier AI work should pause until key risks are evaluated." },
      { id: "rt2", dir: "left", text: "Rolling back access to high‑capability models is justified." },
      { id: "rt3", dir: "right", text: "We should build enforcement and safety faster than capability." },
      { id: "rt4", dir: "right", text: "Delaying progress costs more than it prevents." },
    ],
  },
  {
    id: "embodiment",
    title: "Embodiment Preference",
    leftLabel: "Digital‑Only",
    rightLabel: "Radical Embodiment",
    icon: Cpu,
    bins: [
      { max: 25, label: "Screen‑bound" },
      { max: 50, label: "Limited Physicality" },
      { max: 75, label: "Human‑Machine Merge" },
      { max: 100, label: "Non‑human Embodiment" },
    ],
    items: [
      { id: "em1", dir: "left", text: "AI should remain software without bodies." },
      { id: "em2", dir: "right", text: "Robots should handle hazardous physical tasks." },
      { id: "em3", dir: "left", text: "Implants and brain interfaces should be rare." },
      { id: "em4", dir: "right", text: "Non‑human robot forms should be allowed where useful." },
    ],
  },
  {
    id: "power_expectation",
    title: "Power Expectation",
    leftLabel: "Mundane",
    rightLabel: "Unfathomable",
    icon: BarChart3,
    bins: [
      { max: 15, label: "No real change" },
      { max: 35, label: "Cosmetic" },
      { max: 55, label: "Some big changes" },
      { max: 75, label: "Fourth Industrial Revolution" },
      { max: 90, label: "Unprecedented" },
      { max: 100, label: "Unimaginable" },
    ],
    items: [
      { id: "pe1", dir: "left", text: "AI will tweak workflows, not rewrite society." },
      { id: "pe2", dir: "right", text: "This shift is comparable to the Industrial Revolution." },
      { id: "pe3", dir: "left", text: "Most jobs will look similar after the hype fades." },
      { id: "pe4", dir: "right", text: "Changes ahead will exceed anything we’ve seen." },
    ],
  },
  {
    id: "net_effect",
    title: "Net Effect",
    leftLabel: "Doom",
    rightLabel: "Bloom",
    icon: Brain,
    bins: [
      { max: 10, label: "Violent Extinction" },
      { max: 30, label: "Slow Replacement" },
      { max: 45, label: "Overall Bad" },
      { max: 55, label: "Neutral" },
      { max: 75, label: "Overall Good" },
      { max: 90, label: "Utopia" },
      { max: 100, label: "Ascension" },
    ],
    items: [
      { id: "ne1", dir: "left", text: "Overall, advanced AI will harm people." },
      { id: "ne2", dir: "right", text: "Most people will see clear quality-of-life gains from continuing technical progress." },
      { id: "ne3", dir: "left", text: "Gains will pool at the top while others lose." },
      { id: "ne4", dir: "right", text: "With sensible rules, benefits will outweigh harms." },
    ],
  },
  {
    id: "agency",
    title: "Agency",
    leftLabel: "No Agency",
    rightLabel: "Control",
    icon: Shield,
    bins: [
      { max: 25, label: "Past the Point of Control" },
      { max: 45, label: "Very Minor Control" },
      { max: 70, label: "Radical Change Still Possible" },
      { max: 100, label: "We Will Always Control" },
    ],
    items: [
      { id: "ag1", dir: "left", text: "It’s too late to meaningfully change AI’s course." },
      { id: "ag2", dir: "right", text: "Standards and laws can still redirect outcomes." },
      { id: "ag3", dir: "left", text: "Once a technology exists, its spread is inevitable." },
      { id: "ag4", dir: "right", text: "Collective action can still change the destination of technological progress." },
    ],
  },
  {
    id: "anthropism",
    title: "Anthropism",
    leftLabel: "Anti‑Human Instrumentalism",
    rightLabel: "Human Supremacy",
    icon: Users,
    bins: [
      { max: 25, label: "Anti‑human" },
      { max: 50, label: "Conditional Humanism" },
      { max: 75, label: "Humanist" },
      { max: 100, label: "Human‑supremacist" },
    ],
    items: [
      { id: "an1", dir: "left", text: "Reducing suffering matters more than preserving human nature." },
      { id: "an2", dir: "right", text: "Keeping humanity recognizable is worth trade‑offs." },
      { id: "an3", dir: "left", text: "Optimizing intelligence is more important than identity." },
      { id: "an4", dir: "right", text: "Human limits deserve protection." },
    ],
  },
  {
    id: "materialism",
    title: "Materialism",
    leftLabel: "Strict Materialism",
    rightLabel: "Techno‑Spiritualism",
    icon: Cpu,
    bins: [
      { max: 20, label: "Strict Materialist" },
      { max: 40, label: "Naturalist Skeptic" },
      { max: 60, label: "Secular Emergentist" },
      { max: 80, label: "Techno‑Spiritualist" },
      { max: 100, label: "Theurgic Framing" },
    ],
    items: [
      { id: "ma1", dir: "left", text: "AI is only computation on hardware." },
      { id: "ma2", dir: "left", text: "Talk of machine ‘souls’ is a mistake." },
      { id: "ma3", dir: "right", text: "Advanced tech can carry real spiritual meaning." },
      { id: "ma4", dir: "right", text: "Rituals or meaning practices around AI are legitimate." },
    ],
  },
  {
    id: "consciousness",
    title: "Consciousness Expectation",
    leftLabel: "Never Conscious",
    rightLabel: "Conscious Now/Always",
    icon: Brain,
    bins: [
      { max: 10, label: "Unique to Humans" },
      { max: 25, label: "Will Never Be Conscious" },
      { max: 40, label: "Could Become Conscious" },
      { max: 60, label: "Will Become Conscious" },
      { max: 80, label: "Conscious Soon" },
      { max: 90, label: "Conscious Now" },
      { max: 100, label: "Technopanpsychism" },
    ],
    items: [
      { id: "co1", dir: "left", text: "AI will never be truly conscious." },
      { id: "co2", dir: "right", text: "Given enough complexity, machine consciousness is plausible." },
      { id: "co3", dir: "right", text: "I expect machine consciousness within my lifetime." },
      { id: "co4", dir: "left", text: "The \"Chinese Room\" thought experiment (a scenario where a person who doesn't know Chinese follows instructions to respond convincingly to Chinese characters) suggests a system can manipulate symbols to seem fluent without understanding." },
    ],
  },
  {
    id: "civility",
    title: "Civility Toward AI",
    leftLabel: "Contempt/Hostility",
    rightLabel: "Reverence/Attachment",
    icon: Users,
    bins: [
      { max: 15, label: "Active Contempt" },
      { max: 30, label: "Rude/Disrespectful" },
      { max: 45, label: "Indifferent/Instrumental" },
      { max: 60, label: "Polite Utility" },
      { max: 75, label: "Social Bonding" },
      { max: 90, label: "Intimate Attachment" },
      { max: 100, label: "Worshipful" },
    ],
    items: [
      { id: "ci1", dir: "left", text: "It’s fine to be rude to AI." },
      { id: "ci2", dir: "right", text: "AI deserves basic politeness in how we address it." },
      { id: "ci3", dir: "left", text: "AI should be treated purely as a tool." },
      { id: "ci4", dir: "right", text: "Some people are better off with AI companions." },
    ],
  },
  {
    id: "power_distribution",
    title: "Power Distribution",
    leftLabel: "None/Few",
    rightLabel: "All",
    icon: Users,
    bins: [
      { max: 20, label: "None" },
      { max: 40, label: "Few" },
      { max: 60, label: "Some" },
      { max: 80, label: "Many" },
      { max: 100, label: "All" },
    ],
    items: [
      { id: "pd1", dir: "left", text: "A small elite will control most AI power." },
      { id: "pd2", dir: "right", text: "Open models will spread power widely." },
      { id: "pd3", dir: "left", text: "Rules will mostly protect incumbents." },
      { id: "pd4", dir: "right", text: "Cheap, capable tools will put power in many hands." },
    ],
  },
  {
    id: "ubi",
    title: "UBI Preference",
    leftLabel: "None",
    rightLabel: "Luxury‑Level",
    icon: Users,
    bins: [
      { max: 15, label: "None" },
      { max: 35, label: "Minimal Safety Net" },
      { max: 55, label: "Basic UBI" },
      { max: 80, label: "Strong UBI" },
      { max: 100, label: "Luxury‑Level UBI" },
    ],
    items: [
      { id: "ub1", dir: "left", text: "There should be no universal basic income." },
      { id: "ub2", dir: "right", text: "A modest UBI (covering basics) is desirable." },
      { id: "ub3", dir: "left", text: "Targeted programs are better than cash for everyone." },
      { id: "ub4", dir: "right", text: "Automation gains should fund a dividend people can live on." },
    ],
  },
];

const ALL_ITEMS = AXES.flatMap((axis) => axis.items.map((it) => ({ ...it, axisId: axis.id })));

const AXIS_COLORS = {
  tech_orientation: "#6366F1",
  state_stewardship: "#0EA5E9",
  regulation_tempo: "#10B981",
  embodiment: "#F59E0B",
  power_expectation: "#EF4444",
  net_effect: "#84CC16",
  agency: "#8B5CF6",
  anthropism: "#EC4899",
  materialism: "#22D3EE",
  consciousness: "#A3E635",
  civility: "#F97316",
  power_distribution: "#14B8A6",
  ubi: "#F43F5E",
};

// interleave so no two consecutive questions share an axis
function makeQuestionOrder() {
  const byAxis = new Map();
  for (const q of ALL_ITEMS) {
    if (!byAxis.has(q.axisId)) byAxis.set(q.axisId, []);
    byAxis.get(q.axisId).push(q);
  }
  for (const arr of byAxis.values()) shuffleInPlace(arr);

  const order = [];
  let lastAxis = null;
  while ([...byAxis.values()].some((arr) => arr.length > 0)) {
    const elig = [...byAxis.entries()].filter(([axisId, arr]) => arr.length > 0 && axisId !== lastAxis);
    const pool = elig.length ? elig : [...byAxis.entries()].filter(([_, arr]) => arr.length > 0);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const [axisId, arr] = pick;
    const nextQ = arr.shift();
    order.push(nextQ);
    lastAxis = axisId;
  }
  return order;
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function normalizeTo100(avg0to4) {
  return (avg0to4 / 4) * 100;
}

function binLabel(bins, score) {
  for (const b of bins) if (score <= b.max) return b.label;
  return bins[bins.length - 1]?.label ?? "";
}

function computeScores(responses) {
  const byAxis = {};
  for (const axis of AXES) {
    const items = axis.items;
    const filled = items.map((it) => (typeof responses[it.id] === "number" ? responses[it.id] : 2));
    const transformed = filled.map((val, idx) => (items[idx].dir === "left" ? 4 - val : val));
    const avg = transformed.reduce((a, b) => a + b, 0) / transformed.length;
    const right = Math.round(normalizeTo100(avg));
    const left = 100 - right;
    const label = binLabel(axis.bins, right);
    byAxis[axis.id] = { right, left, label };
  }
  return byAxis;
}

function useStickyState(key, initial) {
  const [val, setVal] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : initial;
      } catch {}
    }
    return initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val]);
  return [val, setVal];
}

export default function App() {
  const [phase, setPhase] = useStickyState("tpv_phase", "intro"); // intro | test | results
  const [name, setName] = useStickyState("tpv_name", "");
  const [order, setOrder] = useStickyState("tpv_order", []);
  const [responses, setResponses] = useStickyState("tpv_responses", {});
  const [idx, setIdx] = useStickyState("tpv_idx", 0);

  const total = order.length;
  const answered = Object.keys(responses).length;
  const progress = total ? Math.round((answered / total) * 100) : 0;

  useEffect(() => {
    if (phase === "intro") {
      const fresh = makeQuestionOrder();
      setOrder(fresh);
      setResponses({});
      setIdx(0);
    }
  }, [phase]);

  const canPrev = idx > 0;
  const canNext = idx < total - 1 && typeof responses[order[idx]?.id] === "number";
  const canSubmit = idx === total - 1 && typeof responses[order[idx]?.id] === "number";

  function start() {
    setPhase("test");
  }
  function resetAll() {
    setPhase("intro");
  }
  function setAnswer(id, value) {
    setResponses((prev) => ({ ...prev, [id]: value }));
  }

  const scores = useMemo(() => (phase === "results" ? computeScores(responses) : null), [phase, responses]);
  const chartData = useMemo(() => (scores ? AXES.map((a) => ({ axis: a.title, Right: scores[a.id].right, id: a.id })) : []), [scores]);

  return (
    <div className="dark min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-900 grid place-items-center shadow">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">Techno‑Political Values Test</h1>
              <p className="text-slate-500 text-sm">Idea by: Cris • Coded by: GPT-5 • Inspired by: JREG</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {phase !== "intro" && (
              <Button variant="ghost" className="gap-2" onClick={resetAll}>
                <RotateCcw className="h-4 w-4" /> Restart
              </Button>
            )}
          </div>
        </header>

        {phase === "intro" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Before we start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  You'll answer 52 statements across 13 axes. Results appear only when you finish.
                </p>
                <div className="space-y-3 text-slate-300">
                  <p>
                    This test maps your views across thirteen core techno‑political spectrums. It’s inspired by Radical Centrist thinker JREG’s
                    video on expanding political compasses to include technology: {""}
                    <a
                      href="https://www.youtube.com/watch?v=FHFcTxR2KUY"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-slate-100 hover:opacity-80"
                    >
                      "The Tech Spectrum"
                    </a>
                    . In a way, this is less about picking sides and more about holding up a mirror to the values that quietly guide your beliefs about technology and society. You’ll get paired scores (left/right) per axis and friendly labels once you finish.
                  </p>
                  <div className="rounded-xl overflow-hidden border">
                    <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/FHFcTxR2KUY?rel=0"
                        title="JREG — The Tech Spectrum"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
                <div className="max-w-sm">
                  <Label htmlFor="name" className="text-slate-600">Name (optional)</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name" />
                </div>
                <div className="pt-2">
                  <Button onClick={start} className="gap-2">
                    Start Test <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === "test" && order[idx] && (
          <>
            <Card className="rounded-2xl shadow-sm mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-slate-300">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={progress} className="h-2" />
                  <div className="text-sm text-slate-400 w-28">{answered}/{order.length}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">Statement {idx + 1} of {order.length}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="text-lg sm:text-xl font-medium text-slate-100 mb-4">{order[idx].text}</div>
                  <RadioGroup
                    value={typeof responses[order[idx].id] === "number" ? String(responses[order[idx].id]) : ""}
                    onValueChange={(v) => setAnswer(order[idx].id, Number(v))}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                  >
                    {LIKERT.map((opt) => (
                      <Label
                        key={opt.value}
                        htmlFor={`${order[idx].id}_${opt.value}`}
                        className={`cursor-pointer select-none text-center border rounded-xl px-3 py-3 text-sm hover:bg-slate-700 ${
                          responses[order[idx].id] === opt.value ? "bg-slate-100 text-slate-900 border-slate-100" : "bg-slate-800 text-slate-100 border-slate-600"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <RadioGroupItem id={`${order[idx].id}_${opt.value}`} value={String(opt.value)} />
                          <span className="font-semibold">{opt.label}</span>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </motion.div>

                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (idx === 0) {
                        setPhase("intro");
                      } else {
                        setIdx((i) => Math.max(0, i - 1));
                      }
                    }}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> {idx === 0 ? "Home" : "Back"}
                  </Button>
                  {canSubmit ? (
                    <Button onClick={() => setPhase("results")} className="gap-2">
                      See Results <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button disabled={!canNext} onClick={() => setIdx((i) => Math.min(order.length - 1, i + 1))} className="gap-2">
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {phase === "results" && scores && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-slate-400" />
                    <CardTitle className="text-xl">Results {name ? `for ${name}` : ""}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" className="gap-2" onClick={() => exportResults(name, responses, scores)}>
                      <Share2 className="h-4 w-4" /> Export
                    </Button>
                    <Button variant="ghost" className="gap-2" onClick={resetAll}>
                      <RotateCcw className="h-4 w-4" /> Restart
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                      <Radar name="Right" dataKey="Right" stroke="#e2e8f0" fill="#e2e8f0" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 32, left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="axis" angle={-20} textAnchor="end" interval={0} height={60} tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Bar dataKey="Right" isAnimationActive={false}>
                        {chartData.map((d, i) => (
                          <Cell key={`cell-${i}`} fill={AXIS_COLORS[d.id] || "#6366F1"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {AXES.map((a) => (
                    <div key={a.id} className="border border-slate-600 rounded-xl p-4 bg-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: AXIS_COLORS[a.id] }} />
                          <div className="font-semibold text-slate-200">{a.title}</div>
                        </div>
                        <div className="text-sm text-slate-400 text-right leading-snug ml-4 max-w-[55%]">
                          {a.leftLabel} vs {a.rightLabel}
                        </div>
                      </div>
                      <div className="mb-2">
                        <span
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border"
                          style={{ borderColor: AXIS_COLORS[a.id], color: AXIS_COLORS[a.id] }}
                        >
                          {scores[a.id].label}
                        </span>
                      </div>
                      <hr className="my-2 border-slate-600" />
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{ width: `${scores[a.id].right}%`, backgroundColor: AXIS_COLORS[a.id] }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        Left {scores[a.id].left}% • Right {scores[a.id].right}%
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {axisExplanation(a, scores[a.id])}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function OrderAxisIcon({ axisId }) {
  const AxisIcon = AXES.find((a) => a.id === axisId)?.icon || Cpu;
  return (
    <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 grid place-items-center">
      <AxisIcon className="h-5 w-5" />
    </div>
  );
}

function axisExplanation(axis, score) {
  const right = score.right;
  const left = score.left;
  const tilt = right === 50
    ? "balanced between"
    : right > 50
      ? `leaning toward ${axis.rightLabel}`
      : `leaning toward ${axis.leftLabel}`;
  const label = score.label ? `${score.label}. ` : "";
  return `${label}You are ${tilt} (${right}% ${axis.rightLabel}, ${left}% ${axis.leftLabel}).`;
}

function exportResults(name, responses, scores) {
  const payload = {
    name: name || undefined,
    timestamp: new Date().toISOString(),
    responses,
    scores,
    version: "fresh-1.0",
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `techno-political-values_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
