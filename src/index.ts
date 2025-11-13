import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { RPCHandler } from '@orpc/server/fetch';
import { onError } from '@orpc/server';
import { appRouter } from './api';
import { OpenAPIGenerator } from '@orpc/openapi';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { CORSPlugin } from '@orpc/server/plugins';
import {  ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod';
import {
  experimental_SmartCoercionPlugin as SmartCoercionPlugin
} from '@orpc/json-schema';

const handler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
 plugins: [
    new ZodSmartCoercionPlugin(),
    new SmartCoercionPlugin({
      schemaConverters: [
        new ZodToJsonSchemaConverter(),
      ],
    })
  ]
});

const openAPIHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new ZodSmartCoercionPlugin(),
  ],
});

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [
    new ZodToJsonSchemaConverter(),
  ],
})

const app = new Elysia()
  .use(cors())
  .options('*', ({ set }) => {
    set.headers['Access-Control-Allow-Origin'] = '*';
    set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With';
    set.headers['Access-Control-Max-Age'] = '86400';
    return new Response(null, { status: 200 });
  })

  
  .all('/rpc/*', async ({ request }: { request: Request }) => {
    try {
      const { response } = await handler.handle(request, {
        prefix: '/rpc',
      });
      return response ?? new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('RPC Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }, {
    parse: 'none'
  })
  .all('/api/*', async ({ request }: { request: Request }) => {
    const { response } = await openAPIHandler.handle(request, {
      prefix: '/api',
    });
    return response ?? new Response('Not Found', { status: 404 });
  })
  .get('/spec.json', async () => {
    try {
      const spec = await openAPIGenerator.generate(appRouter, {
        info: {
          title: 'HelloCRM Admin API',
          version: '1.0.0',
          description: 'Complete API documentation for HelloCRM Admin with oRPC, Drizzle ORM & PostgreSQL. All endpoints use POST method with JSON body.',
        },
        servers: [
          { url: '/api', description: 'Development Server' },
        ],
      });
      console.log('Generated OpenAPI spec:', JSON.stringify(spec, null, 2));
      return new Response(JSON.stringify(spec, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error generating OpenAPI spec:', error);
      return new Response(JSON.stringify({ error: 'Failed to generate spec' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  })
  .get('/manual-spec.json', async () => {
    try {
      const specFile = Bun.file('./complete-openapi-spec.json');
      const spec = await specFile.text();
      return new Response(spec, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'OpenAPI spec file not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  })
  .get('/docs', () => {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>HelloCRM Admin API</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
          SwaggerUIBundle({
            url: '/manual-spec.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            tryItOutEnabled: true
          });
        </script>
      </body>
    </html>
  `;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  })
  .get('/docs-auto', () => {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>HelloCRM Admin API</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
          SwaggerUIBundle({
            url: '/spec.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            tryItOutEnabled: true
          });
        </script>
      </body>
    </html>
  `;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  })
  .listen(4000);

console.log(`🦊 Admin API is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📄 API documentation is available at http://${app.server?.hostname}:${app.server?.port}/docs`);
