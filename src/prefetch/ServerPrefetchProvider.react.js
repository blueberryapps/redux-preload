import React, { Component } from 'react';

export default class ServerPrefetchProvider extends Component {

  static childContextTypes = {
    prefetchCursor: React.PropTypes.object
  }

  static propTypes = {
    children: React.PropTypes.object,
    prefetchCursor: React.PropTypes.object
  }

  static defaultProps = {
    children: null,
    prefetchCursor: null
  }

  getChildContext() {
    return {
      prefetchCursor: this.props.prefetchCursor,
    };
  }

  render() {
    return this.props.children;
  }
}
