import { BehaviorSubject } from "rxjs";
import { useState, useEffect } from "react";

type TListener = (state: any) => void;
type TStore = {
  subjects: any;
  prevState: any;
  state: any;
  onUpdate: (listener: TListener) => any;
  reset: () => void;
};

const createSubjects = (state: any, subscription: any) => {
  const _subjects: any = {};

  Object.entries(state).forEach(([key, value]) => {
    if (typeof state[key] === "function") {
      return;
    }

    if (subscription[key] === false) {
      return;
    }

    _subjects[key] = new BehaviorSubject(value);
  });

  return _subjects;
};

const createProxy = (state: any, prevState: any, subjects: any) => {
  const _proxy = new Proxy(state, {
    get(target, prop) {
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      prevState[prop] = state[prop];

      if (!Reflect.set(target, prop, value)) {
        return false;
      }

      subjects[prop]?.next(value);

      return true;
    },
  });

  return _proxy;
};

export const createStore = <TState extends {}>(
  initState: TState,
  subscription?: any
) => {
  const _state: any = { ...initState };
  const _prevState: any = { ...initState };
  const _subjects: any = createSubjects(initState, subscription);

  const _store: TStore = {
    state: createProxy(_state, _prevState, _subjects),
    prevState: _prevState,
    subjects: _subjects,
    onUpdate() {},
    reset() {
      Object.entries(initState).forEach(([key, value]) => {
        this.state[key] = value;
      });
    },
  };

  return _store;
};

export const useForceUpdate = () => {
  const [, update] = useState({});

  const forceUpdate = () => {
    update({});
  };

  return forceUpdate;
};

export const useStoreState = <T>(store: TStore): T => {
  return store.state;
};

export const useStore = <T>(store: TStore, sub: string) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    store.subjects[sub]?.subscribe((value: any) => {
      if (store.prevState[sub] !== value) {
        forceUpdate();
      }
    });
  }, []);

  return useStoreState<T>(store);
};
