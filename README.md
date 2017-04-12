# Preload

## Description
Module is using to dispatch some actions (usually async data fetching) immediately after the rendering occurs. Works both on client and server sides.

## Usage on client
``` javascript
import preload from 'redux-preload';

@preload([
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
On server to get all goodness of _**isomorphic-deeply-nested-component-data-prefetch**_ you need to call `serverPreload(routerContext)` with router context.

And also send preloaded data back to client using `window.__INITIAL_STATE__ = ${serialize(store.getState())};`

`serverPreload` is a promise - when promise resolves data is already fetched (store is polluted with data) and now you can render your DOM

Here is pseudo code that demonstrate that on server in `render.js`

``` javascript

import { serverPreload } from 'redux-preload';

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
      await serverPreload(getRouterContext(store, renderProps));

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

## Made with love by
[![](https://camo.githubusercontent.com/d88ee6842f3ff2be96d11488aa0d878793aa67cd/68747470733a2f2f7777772e676f6f676c652e636f6d2f612f626c75656265727279617070732e636f6d2f696d616765732f6c6f676f2e676966)](https://www.blueberry.io)
