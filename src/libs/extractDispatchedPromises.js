import isArray from 'lodash.isarray';

/**
 * Extract dispatched promises
 *
 * @param  {Array|Object|Function} dispatchedActions - dispatched actions
 * @return {Array} - extracted promises
 */
function extractDispatchedPromises(dispatchedActions) {
  const arrrayOfdispatchedActions = isArray(dispatchedActions) ? dispatchedActions : [dispatchedActions];

  return arrrayOfdispatchedActions.reduce((result, action) => {
    if (!action) {
      return result;
    } else if (typeof action.then === 'function') {
      result.push(action);
    } else if (action.payload) {
      if (typeof action.payload.then === 'function') {
        result.push(action.payload);
      } else if (action.payload.promise && typeof action.payload.promise.then === 'function') {
        result.push(action.payload.promise);
      }
    }
    return result;
  }, []);
}

export default extractDispatchedPromises;
