import Promise from 'bluebird';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import extractDispatchedPromises from '../libs/extractDispatchedPromises';
import ServerPrefetchProvider from './ServerPrefetchProvider.react';

/**
 * Resets last prefetch cursor and invoke prefetch
 *
 * @param  {Object} routerContext — component
 * @return {Promise} promise
 */
export default async function serverPrefetch(routerContext) {
  const prefetchCursor = {
    last: -1,
  };

  return await prefetch(routerContext, prefetchCursor);
}

/**
 * Recursively tries to render components on server and when gets to component with prefetching
 * get an exception with dispatched prefetch actions. Then gets all async actions and waits for
 * its resolving
 *
 * @param  {Object} routerContext — component
 * @param  {Object} prefetchCursor — counter, which ensures to invoke prefetch actions only once
 * @return {Promise} promise
 */
async function prefetch(routerContext, prefetchCursor) {
  prefetchCursor.current = -1; // eslint-disable-line no-param-reassign

  try {
    ReactDOMServer.renderToStaticMarkup(
      <ServerPrefetchProvider prefetchCursor={prefetchCursor}>
        {routerContext}
      </ServerPrefetchProvider>
    );
  } catch (exception) {
    if (exception.type === 'prefetch') {
      const dispatchedPromisses = extractDispatchedPromises(exception.dispatchedActions);

      if (dispatchedPromisses.length)
        await Promise.all(dispatchedPromisses);

      return await prefetch(routerContext, prefetchCursor);
    }

    throw exception;
  }

  return null;
}
