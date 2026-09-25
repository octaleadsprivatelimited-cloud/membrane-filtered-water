export async function readApiResponse(response) {
  const raw = await response.text();
  let body;
  try { body = raw ? JSON.parse(raw) : null; } catch {
    const message = response.status === 401 ? 'Your session has expired. Please sign in again.'
      : response.status === 404 ? 'The store API could not be found. Please contact support.'
      : 'The store server is unavailable. Please try again shortly.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  if (!response.ok) {
    const error = new Error(typeof body?.error === 'string' ? body.error : 'Request failed. Please try again.');
    error.status = response.status;
    error.code = body?.code;
    throw error;
  }
  if (body === null || typeof body !== 'object') throw new Error('The store server returned an invalid response. Please retry.');
  return body;
}
