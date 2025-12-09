import React from "react"; // Fix per l'errore ReferenceError
import { useState } from "react";

function FormSpesa({ onNuovaSpesa }) {
  const [descrizione, setDescrizione] = useState("");
  const [importo, setImporto] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Validazione semplice
    if (!descrizione || !importo) return;

    const nuovaSpesa = {
      descrizione: descrizione,
      importo: parseFloat(importo)
    };

    // Passiamo i dati al genitore
    onNuovaSpesa(nuovaSpesa);

    // Reset del form
    setDescrizione("");
    setImporto("");
  }

  return (
    <div className="form-card">
      <h3>Aggiungi Spesa</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Descrizione (es. Pizza)"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="number"
            placeholder="Importo (€)"
            value={importo}
            onChange={(e) => setImporto(e.target.value)}
          />
        </div>
        <button type="submit">Aggiungi</button>
      </form>
    </div>
  );
}

export default FormSpesa;