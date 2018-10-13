import { Map } from 'immutable';
import { isNull } from 'lodash';

class ReducerRegistry {
  constructor() {
    this._emitChange = null;
    this._reducers = Map();
  }

  getReducers() {
    return this._reducers;
  }

  register(name, reducer) {
    this._reducers = this._reducers.set(name, reducer);
    if(!isNull(this._emitChange)) {
      this._emitChange(this.getReducers());
    }
  }

  setChangeListener(listener) {
    this._emitChange = listener;
  }

}

export default new ReducerRegistry();
