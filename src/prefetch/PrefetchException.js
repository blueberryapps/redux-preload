/**
 * @constructor
 *
 * @param {Array} dispatchedActions — array of dispatched actions
 */
export default function PrefetchException(dispatchedActions) {
  this.type = 'prefetch';
  this.dispatchedActions = dispatchedActions;
}
