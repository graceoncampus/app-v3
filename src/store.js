const assign = (obj, props) => {
  for (const i in props) obj[i] = props[i];
  return obj;
};

const createStore = (state) => {
  let listeners = [];
  state = state || {};

  const unsubscribe = (listener) => {
    const out = [];
    for (let i = 0; i < listeners.length; i += 1) {
      if (listeners[i] === listener) {
        listener = null;
      } else {
        out.push(listeners[i]);
      }
    }
    listeners = out;
  };

  const setState = (update, overwrite, action) => {
    state = overwrite ? update : assign(assign({}, state), update);
    const currentListeners = listeners;
    for (let i = 0; i < currentListeners.length; i += 1) currentListeners[i](state, action);
  };

  return {
    action: (action) => {
      const apply = result => setState(result, false, action);
      return () => {
        const args = [state];
        for (let i = 0; i < arguments.length; i += 1) args.push(arguments[i]);
        const ret = action.apply(this, args);
        if (ret != null) {
          if (ret.then) return ret.then(apply);
          return apply(ret);
        }
      };
    },
    setState,
    subscribe(listener) {
      listeners.push(listener);
      return () => { unsubscribe(listener); };
    },
    unsubscribe,
    getState() {
      return state;
    },
  };
};

const store = createStore({
  title: undefined,
  artist: undefined,
  playbackState: undefined,
  id: undefined,
});

export default store;
