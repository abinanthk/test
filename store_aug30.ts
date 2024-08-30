import { BehaviorSubject } from "rxjs";
import { useState, useEffect } from "react";

const createSubjectsForStore = (state: any) => {
  const _subjects: any = {
    $: new BehaviorSubject(state),
  };

  Object.entries(state).forEach(([key, value]) => {
    if (typeof state[key] === "function") {
      return;
    }

    _subjects[key] = new BehaviorSubject(value);
  });

  return _subjects;
};

const createPrototypeForStore = (
  initState: any,
  state: any,
  prevState: any,
  subjects: any
) => {
  state.__proto__ = {
    initState,
    prevState,
    subjects,
    reset() {
      Object.entries(this.initState).forEach(([key, value]) => {
        this[key] = value;
      });
    },
  };
};

const createProxyForStore = (state: any, prevState: any, subjects: any) => {
  const _proxy = new Proxy(state, {
    get(target, prop) {
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      if (state[prop] === value) {
        return true;
      }

      prevState[prop] = state[prop];

      if (!Reflect.set(target, prop, value)) {
        return false;
      }

      subjects[prop]?.next(value);

      subjects.$.next(state);

      return true;
    },
  });

  return _proxy;
};

export const createStore = <TState extends {}>(initState: TState) => {
  const _state: any = { ...initState };
  const _prevState: any = { ...initState };
  const _subjects: any = createSubjectsForStore(initState);

  createPrototypeForStore(initState, _state, _prevState, _subjects);

  return createProxyForStore(_state, _prevState, _subjects);
};

export const useForceUpdate = () => {
  const [, update] = useState({});

  const forceUpdate = () => {
    update({});
  };

  return forceUpdate;
};

export const useStoreEffect = (
  callback: (state: any, label: string) => void,
  stores: any[],
  labels: string[]
) => {
  useEffect(() => {
    stores?.forEach((store, index) => {
      store.__proto__.subjects.$?.subscribe((state: any) => {
        callback?.(state, labels?.[index]);
      });
    });
  }, []);
};

export const useStore = (store: any, subscribeTo: string[]) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    subscribeTo?.forEach((sub) => {
      store.__proto__.subjects?.[sub]?.subscribe(() => {
        forceUpdate();
      });
    });
  }, []);

  return store;
};
