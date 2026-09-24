// NeoLung AI — Gradio API helpers
// Requires config.js loaded first (provides GRADIO_URL)

/**
 * Upload an image file to the Gradio server.
 * Returns the server-side file path string needed for predict calls.
 */
async function uploadImage(file) {
  const form = new FormData();
  form.append("files", file);
  const res = await fetch(`${GRADIO_URL}/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const json = await res.json();
  // Gradio returns an array of file paths
  return json[0];
}

/**
 * Phase 1 — Binary triage (Normal / Abnormal).
 * @param {string} serverPath  path returned by uploadImage()
 * @returns {{ label: string, confidences: {label:string, confidence:number}[] }}
 */
async function predictPhase1(serverPath) {
  const body = {
    fn_index: 0,
    data: [{ name: serverPath, is_file: true }],
    session_hash: Math.random().toString(36).slice(2)
  };
  const res = await fetch(`${GRADIO_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Predict failed: ${res.status}`);
  const json = await res.json();
  return json.data[0]; // { label, confidences: [{label, confidence}] }
}

/**
 * Phase 2 — Multimodal triage (Normal / Moderate RDS / High RDS).
 * @param {string} serverPath  path returned by uploadImage()
 * @param {number[]} sliders   [ga, bw, spo2, fio2, rr, hr, cpap, temp]
 * @returns {{ label: string, confidences: {label:string, confidence:number}[] }}
 */
async function predictPhase2(serverPath, sliders) {
  const [ga, bw, spo2, fio2, rr, hr, cpap, temp] = sliders;
  const body = {
    fn_index: 1,
    data: [
      { name: serverPath, is_file: true },
      ga, bw, spo2, fio2, rr, hr, cpap, temp
    ],
    session_hash: Math.random().toString(36).slice(2)
  };
  const res = await fetch(`${GRADIO_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Predict failed: ${res.status}`);
  const json = await res.json();
  return json.data[0];
}
