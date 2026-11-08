/**
 * Money helpers. All amounts are integer centavos; never do float math on money.
 */

/**
 * Format integer centavos as Philippine pesos, e.g. ₱1,234,567.89.
 * @param {number} centavos integer amount in centavos
 * @returns {string}
 */
export function formatPeso(centavos) {
  const sign = centavos < 0 ? "-" : ""
  const absolute = Math.abs(centavos)
  const pesos = Math.floor(absolute / 100)
  const cents = String(absolute % 100).padStart(2, "0")
  return `${sign}₱${pesos.toLocaleString("en-PH")}.${cents}`
}

/**
 * Short Philippine peso label for chart axes, e.g. ₱18.5M or ₱850k.
 * Display only; the underlying amounts stay integer centavos.
 * @param {number} centavos integer amount in centavos
 * @returns {string}
 */
export function formatPesoCompact(centavos) {
  const sign = centavos < 0 ? "-" : ""
  const pesos = Math.round(Math.abs(centavos) / 100)
  if (pesos >= 1000000) {
    const tenths = Math.round(pesos / 100000)
    return `${sign}₱${Math.floor(tenths / 10)}.${tenths % 10}M`
  }
  if (pesos >= 1000) {
    const thousands = Math.round(pesos / 1000)
    return `${sign}₱${thousands.toLocaleString("en-PH")}k`
  }
  return `${sign}₱${pesos.toLocaleString("en-PH")}`
}

/**
 * Sum a list of centavo values.
 * @param {number[]} values
 * @returns {number}
 */
export function sumCentavos(values) {
  return values.reduce((total, value) => total + value, 0)
}

/**
 * Percentage of a whole, safe when the whole is zero.
 * @param {number} part
 * @param {number} whole
 * @returns {number}
 */
export function percentOf(part, whole) {
  if (!whole) return 0
  return (part / whole) * 100
}
