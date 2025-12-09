import React, { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Autenticazione standard PocketBase
      const res = await fetch("http://127.0.0.1:8090/api/collections/users/auth-with-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: email, password }),
      });

      if (!res.ok) throw new Error("Credenziali non valide");

      const data = await res.json();
      // Passiamo token e dati utente al genitore
      onLogin(data.token, data.record);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-placeholder">Expense</div>
          <h2>Bentornato</h2>
          <p>Inserisci le tue credenziali per accedere.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Accesso..." : <>Accedi <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}