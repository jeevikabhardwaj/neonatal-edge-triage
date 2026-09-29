const API_BASE_URL = '\u0068\u0074\u0074\u0070\u0073\u003A\u002F\u002Fneonatal-edge-triage\u002Eonrender\u002Ecom';

export async function predictPhase1(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`API prediction request failed with status: ${response.status}`);
  }

  return await response.json();
}
