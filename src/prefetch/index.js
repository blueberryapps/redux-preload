import React, { PropTypes, Component, PureComponent } from 'react';
import getDisplayName from '../libs/getDisplayName';
import PrefetchException from './PrefetchException';

const ReactComponent = PureComponent || Component;
/**
 * Makes decorator for wrapping component into Prefetch component
 *
 * @param  {Array} prefetchActions — returns actions creators by specified paths
 * @return {Function} — decorator for wrapping component into Prefetch
 */
export default function prefetchWrapper(prefetchActions) {
  const actions = typeof prefetchActions === 'function'
    ? [prefetchActions]
    : prefetchActions;
  return (Wrapped) =>
    class PrefetchWrapper extends ReactComponent {

      static displayName = `Prefetch(${getDisplayName(Wrapped)})`

      static contextTypes = {
        store: PropTypes.object.isRequired,
        prefetchCursor: PropTypes.object,
      }

      static propTypes = {
        location: PropTypes.object,
        params: PropTypes.object,
      }

      /**
       * Dispatch prefetch actions
       *
       * @return {Array.<Object>} — list of dispatched actions
       */
      dispatchPrefetchActions() {
        const { store: { dispatch } } = this.context;

        return actions
          .map(action => action(this.props))
          .map(action => dispatch(action));
      }

      componentWillMount() {
        const { prefetchCursor } = this.context;

        // Is server side prefetch render
        if (prefetchCursor) {
          // Count prefetch Wrappers
          prefetchCursor.current += 1;
          // Was this wrapper previously prefetched
          if (prefetchCursor.current > prefetchCursor.last) {
            // Remember that we have prefetched this wrapper
            prefetchCursor.last += 1;

            // Tell prefetcher to wait for all dispatched actions
            // then run again with prefetched data
            throw new PrefetchException(this.dispatchPrefetchActions());
          }
        }
      }

      componentDidMount() {
        this.dispatchPrefetchActions();
      }

      render() {
        return (
          <Wrapped {...this.props} />
        );
      }
    };
}
