import React, { useEffect, useState } from "react";
import { Plus, LogOut, Trash2, Filter } from "lucide-react";
import Auth from "./Auth";
import { GraficoTorta, GraficoLinea } from "./GraficoSpese";
import "./App.css";

const CATEGORY_STYLES = {
  "Cibo": { borderLeft: "4px solid #f97316", background: "#fff7ed" },      // Arancione sbiadito
  "Trasporti": { borderLeft: "4px solid #3b82f6", background: "#eff6ff" }, // Blu sbiadito
  "Casa": { borderLeft: "4px solid #10b981", background: "#f0fdf4" },      // Verde sbiadito
  "Svago": { borderLeft: "4px solid #8b5cf6", background: "#f5f3ff" },     // Viola sbiadito
  "Altro": { borderLeft: "4px solid #64748b", background: "#f8fafc" }      // Grigio sbiadito
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [spese, setSpese] = useState([]);

  // Helper per data locale formato datetime-local
  const getNowString = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Stati per il form
  const [descrizione, setDescrizione] = useState("");
  const [importo, setImporto] = useState("");
  const [dataSpesa, setDataSpesa] = useState(getNowString()); // Default OGGI
  const [categoria, setCategoria] = useState("Altro");

  const [timeFilter, setTimeFilter] = useState("30"); // "1" (Oggi), "7", "30", "all"

  const API_URL = "http://127.0.0.1:8090/api/collections/spese/records";

  // Controllo se c'è un utente salvato
  useEffect(() => {
    const savedToken = localStorage.getItem("pb_token");
    const savedUser = localStorage.getItem("pb_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Scorico le spese
  useEffect(() => {
    if (!token) return;
    async function getSpese() {
      try {
        const r = await fetch(`${API_URL}?sort=-created`, {
          headers: { Authorization: token }
        });
        if (!r.ok) {
          console.error("Errore risposta DB:", r.status);
          return;
        }
        const data = await r.json();
        setSpese(data.items || []);
      } catch (error) { console.error("Errore fetch:", error); }
    }
    getSpese();
  }, [token]);

  function handleLogin(token, record) {
    localStorage.setItem("pb_token", token);
    localStorage.setItem("pb_user", JSON.stringify(record));
    setToken(token);
    setUser(record);
  }

  function handleLogout() {
    localStorage.removeItem("pb_token");
    localStorage.removeItem("pb_user");
    setToken(null);
    setUser(null);
    setSpese([]);
  }

  async function aggiungiSpesa(e) {
    e.preventDefault();
    if (!descrizione || !importo || !dataSpesa) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          descrizione,
          importo: parseFloat(importo),
          // Converto la data locale in formato ISO standard per il DB (es. 2023-12-10T14:30:00.000Z)
          data: new Date(dataSpesa).toISOString(),
          categoria: categoria
        }),
      });

      if (res.ok) {
        const nuova = await res.json();
        setSpese([nuova, ...spese]);
        setDescrizione("");
        setImporto("");
        // NON resettiamo la data a Oggi, così se l'utente sta inserendo spese passate rimane lì
        // setDataSpesa(getNowString()); 
        setCategoria("Altro");
      }
    } catch (err) { console.error(err); }
  }

  async function eliminaSpesa(id) {
    if (!confirm("Sicuro di eliminare?")) return;
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });
      setSpese(spese.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  }

  const totale = spese.reduce((acc, curr) => acc + curr.importo, 0);

  // Filtro
  const speseFiltrate = spese.filter(spesa => {
    if (timeFilter === "all") return true;
    const d = new Date(spesa.data || spesa.created);
    const now = new Date();

    if (timeFilter === "1") { // OGGI
      return d.toDateString() === now.toDateString();
    }

    // Per giorni (7 o 30)
    const limit = new Date();
    limit.setDate(limit.getDate() - parseInt(timeFilter));
    return d >= limit;
  });

  if (!token) return <Auth onLogin={handleLogin} />;

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="user-profile">
          <div className="avatar">{user.username?.[0] || "U"}</div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Bentornato,</span>
            <h3 style={{ margin: 0 }}>{user.username || user.email}</h3>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-icon">
          <LogOut size={20} /> Esci
        </button>
      </header>

      <main className="dashboard-grid">

        {/* Sinistra */}
        <div className="stats-column">
          <div className="card balance-card">
            <div className="balance-label">Totale</div>
            <h1>€ {totale.toFixed(2)}</h1>
            <div style={{ opacity: 0.8 }}>Gestione spese</div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: '#64748b', fontSize: '1rem' }}>Per Categoria</h3>
            <GraficoTorta data={speseFiltrate} />
          </div>
        </div>

        {/* Destra */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3>Transazioni</h3>

            <div className="filter-group">
              <button className={`filter-btn ${timeFilter === "1" ? "active" : ""}`} onClick={() => setTimeFilter("1")}>Oggi</button>
              <button className={`filter-btn ${timeFilter === "7" ? "active" : ""}`} onClick={() => setTimeFilter("7")}>7gg</button>
              <button className={`filter-btn ${timeFilter === "30" ? "active" : ""}`} onClick={() => setTimeFilter("30")}>30gg</button>
              <button className={`filter-btn ${timeFilter === "all" ? "active" : ""}`} onClick={() => setTimeFilter("all")}>Tutte</button>
            </div>
          </div>

          <form onSubmit={aggiungiSpesa} className="add-form">
            {/* RIGA 1: Descrizione */}
            <div className="form-row full-width">
              <input
                value={descrizione}
                onChange={e => setDescrizione(e.target.value)}
                placeholder="Descrizione (es. Spesa)"
                className="input-desc"
              />
            </div>

            {/* RIGA 2: Dettagli */}
            <div className="form-row details-row">
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="input-select"
                style={{ flex: '1.5' }}
              >
                <option value="Altro">Altro</option>
                <option value="Cibo">Cibo</option>
                <option value="Trasporti">Trasporti</option>
                <option value="Casa">Casa</option>
                <option value="Svago">Svago</option>
              </select>

              <input
                type="datetime-local"
                value={dataSpesa}
                onChange={e => setDataSpesa(e.target.value)}
                style={{ flex: '2' }}
              />

              <input
                type="number"
                value={importo}
                onChange={e => setImporto(e.target.value)}
                placeholder="€"
                style={{ flex: '1' }}
              />

              <button type="submit" className="btn-primary" style={{ flex: '0 0 auto' }}>
                <Plus size={24} />
              </button>
            </div>
          </form>

          <div className="transactions-list">
            {speseFiltrate.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: 20 }}>Nessuna spesa nel periodo</p>}

            {speseFiltrate.map(spesa => (
              <div
                key={spesa.id}
                className="transaction-item"
                style={CATEGORY_STYLES[spesa.categoria] || CATEGORY_STYLES["Altro"]}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="t-icon" style={{ fontSize: '1rem', background: 'rgba(255,255,255,0.7)' }}>
                    {spesa.categoria === "Cibo" ? "🍔" :
                      spesa.categoria === "Trasporti" ? "🚗" :
                        spesa.categoria === "Casa" ? "🏠" :
                          spesa.categoria === "Svago" ? "🎉" : "💸"}
                  </div>
                  <div className="t-details">
                    <span className="t-desc">{spesa.descrizione}</span>
                    <span className="t-date" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {new Date(spesa.data || spesa.created).toLocaleString('it-IT', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                      <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.8)', color: '#6366f1', padding: '2px 6px', borderRadius: 6 }}>
                        {spesa.categoria || "Altro"}
                      </span>
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="t-amount">- € {spesa.importo.toFixed(2)}</div>
                  <button onClick={() => eliminaSpesa(spesa.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <GraficoLinea data={speseFiltrate} filterType={timeFilter} />

      </main>
    </div>
  );
}

export default App;