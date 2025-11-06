import PropTypes from "prop-types";
import "./CintaChip.css";

export default function CintaChip({ nombreCinta }) {
  if (!nombreCinta) {
    return (
      <span className="cinta-chip cinta-sin-cinta">
        Sin cinta
      </span>
    );
  }

  // Normalizar el nombre de la cinta (quitar acentos, convertir a minúsculas)
  const nombreNormalizado = nombreCinta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Determinar la clase CSS según el nombre de la cinta
  let claseCSS = "cinta-chip";

  if (nombreNormalizado.includes("blanca avanzada") || nombreNormalizado.includes("blanca-amarilla")) {
    claseCSS += " cinta-blanca-avanzada";
  } else if (nombreNormalizado.includes("amarilla avanzada") || nombreNormalizado.includes("amarilla-verde")) {
    claseCSS += " cinta-amarilla-avanzada";
  } else if (nombreNormalizado.includes("verde avanzada") || nombreNormalizado.includes("verde-azul")) {
    claseCSS += " cinta-verde-avanzada";
  } else if (nombreNormalizado.includes("azul avanzada") || nombreNormalizado.includes("azul-roja") || nombreNormalizado.includes("azul-rojo")) {
    claseCSS += " cinta-azul-avanzada";
  } else if (nombreNormalizado.includes("roja avanzada") || nombreNormalizado.includes("roja-negra") || nombreNormalizado.includes("roja-negro")) {
    claseCSS += " cinta-roja-avanzada";
  } else if (nombreNormalizado.includes("poom")) {
    claseCSS += " cinta-poom-1";
  } else if (nombreNormalizado.includes("blanca")) {
    claseCSS += " cinta-blanca";
  } else if (nombreNormalizado.includes("amarilla")) {
    claseCSS += " cinta-amarilla";
  } else if (nombreNormalizado.includes("verde")) {
    claseCSS += " cinta-verde";
  } else if (nombreNormalizado.includes("azul")) {
    claseCSS += " cinta-azul";
  } else if (nombreNormalizado.includes("roja") || nombreNormalizado.includes("rojo")) {
    claseCSS += " cinta-roja";
  } else if (nombreNormalizado.includes("negra") || nombreNormalizado.includes("negro")) {
    claseCSS += " cinta-negra";
  } else {
    claseCSS += " cinta-sin-cinta";
  }

  return (
    <span className={claseCSS}>
      {nombreCinta}
    </span>
  );
}

CintaChip.propTypes = {
  nombreCinta: PropTypes.string,
};
