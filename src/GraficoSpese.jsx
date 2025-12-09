import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const CATEGORY_COLORS = {
  "Cibo": "#f97316",
  "Trasporti": "#3b82f6",
  "Casa": "#10b981",
  "Svago": "#8b5cf6",
  "Altro": "#64748b"
};
const DEFAULT_COLOR = "#cbd5e1";

export function GraficoTorta({ data }) {
  if (data.length === 0) return <p className="no-data">Nessun dato</p>;

  // Aggrega per categoria
  const catData = {};
  data.forEach(item => {
    const c = item.categoria || "Altro";
    catData[c] = (catData[c] || 0) + item.importo;
  });

  const pieData = Object.keys(catData).map(k => ({
    name: k,
    value: catData[k]
  }));

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((e, i) => (
              <Cell key={`c-${i}`} fill={CATEGORY_COLORS[e.name] || DEFAULT_COLOR} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoLinea({ data, filterType }) {
  if (data.length === 0) return null;

  const ord = [...data].sort((a, b) => new Date(a.data || a.created) - new Date(b.data || b.created));

  let chartData;

  // Se filtro è "1" (Oggi), mostriamo per Orario (HH:mm)
  if (filterType === "1") {
    // Non raggruppo per somma, mostro i singoli punti (o raggruppo per ora se vuoi)
    // Facciamo raggruppamento per ora per pulizia? O punti esatti?
    // Punti esatti è meglio.
    chartData = ord.map(item => ({
      data: new Date(item.data || item.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      importo: item.importo,
      fullDate: item.data || item.created // Per ordinamento interno se servisse
    }));
  } else {
    // Altrimenti per Giorno
    const daily = {};
    ord.forEach(i => {
      const d = new Date(i.data || i.created).toLocaleDateString();
      daily[d] = (daily[d] || 0) + i.importo;
    });
    chartData = Object.keys(daily).map(k => ({ data: k, importo: daily[k] }));
  }

  return (
    <div className="card full-width-chart">
      <h3>Andamento Spese {filterType === "1" ? "(Oggi)" : ""}</h3>
      <div style={{ width: '100%', height: 300, marginTop: 20 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="data" stroke="#94a3b8" fontSize={12} tickMargin={10} padding={{ left: 30, right: 30 }} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="importo"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoTorta;