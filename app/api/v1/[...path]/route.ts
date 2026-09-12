const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://prompthon-api.onrender.com/api/v1';
const upstreamBase = new URL(configuredApiUrl);

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const incoming = new URL(request.url);
  const target = new URL(`${upstreamBase.pathname.replace(/\/$/, '')}/${path.map(encodeURIComponent).join('/')}`, upstreamBase.origin);
  target.search = incoming.search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('access-control-allow-origin');
  responseHeaders.delete('access-control-allow-credentials');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
