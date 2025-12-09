import React from "react"; // Fix per l'errore ReferenceError

function ItemSpesa({ datiSpesa, onDelete }) {
  return (
    <div className="spesa-item">
      <div className="spesa-info">
        <span className="descrizione">{datiSpesa.descrizione}</span>
        <span className="importo">€ {datiSpesa.importo}</span>
      </div>
      
      <button 
        className="btn-delete" 
        onClick={() => onDelete(datiSpesa.id)}
      >
        Elimina
      </button>
    </div>
  );
}

export default ItemSpesa;