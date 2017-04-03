/* eslint-disable react/no-multi-comp */
import connectPreload, { serverPreload } from '../../src';
import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import { assert } from 'chai';
import { createStore } from 'redux';
import { jsdom } from 'jsdom';
import { Provider } from 'react-redux';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

describe('prefetch', () => {
  let store;

  const reducer = (prev = 0, action) => // eslint-disable-line no-confusing-arrow
    action.type === 'INCREMENT' ? ++prev : prev; // eslint-disable-line no-param-reassign

  beforeEach(() => {
    store = createStore(reducer);
  });

  describe('on client side', () => {
    describe('prefetch actions defenitions', () => {
      it('should dispatch an actions provided as function', () => { // eslint-disable-line padded-blocks
        @connectPreload(({ action }) => ({ type: action }))
        class Container extends Component {
          static propTypes = {
            action: React.PropTypes.string
          }

          render() {
            return <div />;
          }
        }

        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <Container action="INCREMENT" />
          </Provider>
        );

        assert.equal(store.getState(), 1);
      });

      it('should dispatch an actions provided as list of functions', () => { // eslint-disable-line padded-blocks
        @connectPreload([
          ({ action }) => ({ type: action }),
          ({ action }) => ({ type: action })
        ])
        class Container extends Component {
          static propTypes = {
            action: React.PropTypes.string
          }

          render() {
            return <div />;
          }
        }

        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <Container action="INCREMENT" />
          </Provider>
        );

        assert.equal(store.getState(), 2);
      });

      it('should dispatch nested prefetch actions', () => { // eslint-disable-line padded-blocks
        @connectPreload([
          () => ({ type: 'INCREMENT' })
        ])
        class Container extends Component {
          render() {
            return <Nested {...this.props} />;
          }
        }

        @connectPreload([
          () => ({ type: 'INCREMENT' })
        ])
        class Nested extends Component {
          render() {
            return <div />;
          }
        }

        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <Container />
          </Provider>
        );

        assert.equal(store.getState(), 2);
      });
    });
  });

  describe('on server side', () => {
    const reducer = (prev = 0, action) => // eslint-disable-line no-confusing-arrow
      action.type === 'INCREMENT' ? ++prev : prev; // eslint-disable-line no-param-reassign
    const store = createStore(reducer);

    @connectPreload([
      () => ({ type: 'INCREMENT' })
    ])
    class Container extends Component {
      render() {
        return <Nested {...this.props} />;
      }
    }

    @connectPreload([
      () => ({ type: 'INCREMENT' })
    ])
    class Nested extends Component {
      render() {
        return <div />;
      }
    }

    it('should dispatch prefetch actions', () => {
      serverPreload(
        <Provider store={store}>
          <Container />
        </Provider>
      );
      assert.equal(store.getState(), 2);
    });
  });
});
