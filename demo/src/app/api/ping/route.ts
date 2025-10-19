// Ultra-simple ping endpoint with no imports
export async function GET() {
  return new Response('pong', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  })
}

