import 'babel-polyfill';
import prefetchWrapper from './prefetch';

/**
 * Creates a list of decorators
 *
 * @return {Object} - connect wrappers
 */
export default prefetchWrapper;

export serverPreload from './prefetch/serverPrefetch';
