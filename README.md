# Prefetch

## Description
Module is using to dispatch some actions (usually async data fetching) immediately after the rendering occurs. Works both on client and server sides.

*__See also:__*
simple implementation of prefetch [on client ](https://github.com/blueberryapps/4finance-template/blob/c302dd8360aec97cd28edbf7298c536fac0dfc13/src/common/components/fetch.js) and [on server](https://github.com/blueberryapps/4finance-template/blob/80570f209e01bb46225defa91318747d393261a5/src/server/frontend/render.js#L84-L98).

## Usage on client
``` javascript
import { connectPrefetch } from '../connect.js'

@connectPrefetch([
  // You can just pass a single action creator, or array of them
  ({ someProp }) => ({ type: 'FETCH', payload: someProp })
])
class Container extends Component {
  render() {
    return <div />;
  }
}
```

## Usage on server
On server to get all goodness of _**isomorphic-deeply-nested-component-data-prefetch**_ you need to call `serverPrefetch(routerContext)` with router context.

And also send prefetched data back to client using `window.__INITIAL_STATE__ = ${serialize(store.getState())};`

`serverPrefetch` is a promise - when promise resolves data is already fetched (store is polluted with data) and now you can render your DOM

Here is pseudo code that demonstrate that on server in `render.js`

``` javascript

import { serverPrefetch } from '@blueberry/4finance-connect';

const getRouterContext = function(store, renderProps) {
  return (
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  );
}

const renderHtml = (store, renderProps) => {
  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    <html lang="en">
      <body>
        <div dangerouslySetInnerHTML={{__html: ReactDOMServer.renderToString(
          getRouterContext(store, renderProps)
        )}} id="app"></div>
        <script dangerouslySetInnerHTML={{__html:`
            window.__INITIAL_STATE__ = ${serialize(store.getState())};
        `}}></script>
      </body>
    </html>
  );
};

export default function render(req, res, next) {
  const store = createStore(...);
  ...
  match({routes, location}, async (error, redirectLocation, renderProps) => {
    ...
    try {
      await serverPrefetch(getRouterContext(store, renderProps));

      const html = renderHtml(store, renderProps, req);
      res.status(200).send(html);
    } catch (exception) {
      next(exception);
    }
  });
}
```

#### Restore state sent from server

On client you need to revive state with data sent from server.

You can do it in `main.js`

``` javascript
const store = createStore({
  initialState: window.__INITIAL_STATE__
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {createRoutes(store.getState)}
    </Router>
  </Provider>,
  document.getElementById('app')
);
```
