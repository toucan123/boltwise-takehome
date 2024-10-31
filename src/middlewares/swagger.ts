import fastifySwagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPlugin from 'fastify-plugin';

const OPENAPI_CONFIG: FastifyDynamicSwaggerOptions['openapi'] = {
  info: {
    title: 'Boltwise Products Service',
    version: '1.0.0',
    description: 'API for Products Service',
  },
  tags: [], // FIXME
};

const REF_RESOLVER: FastifyDynamicSwaggerOptions['refResolver'] = {
  buildLocalReference(json, baseUri, fragment, i) {
    const id = json.$id;

    // Fastify throws if you try to add a schema without an `$id` so there's no
    // need to test the else statement.
    /* istanbul ignore else */
    if (id && typeof id === 'string') {
      return id;
    } else {
      return `def-${i}`;
    }
  },
};

export const swaggerPlugin = fastifyPlugin(async (instance) => {
  await instance.register(fastifySwagger, {
    refResolver: REF_RESOLVER,
    openapi: OPENAPI_CONFIG,
  });
  await instance.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
    },
  });
});