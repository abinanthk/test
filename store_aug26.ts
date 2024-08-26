import { BehaviorSubject } from "rxjs";
import { useState, useEffect } from "react";

type TStore = {
  subjects: any;
  prevState: any;
  reset: () => void;
};

const createSubjectsForStore = (state: any) => {
  const _subjects: any = {
    $: new BehaviorSubject({ state, prevState: state }),
  };

  Object.entries(state).forEach(([key, value]) => {
    if (typeof state[key] === "function") {
      return;
    }

    _subjects[key] = new BehaviorSubject(value);
  });

  return _subjects;
};

const createProxiedStore = (state: any, prevState: any, subjects: any) => {
  Reflect.defineProperty(state, "__x__", {
    value: {
      prevState,
      subjects,
      reset: () => {
        Object.entries(state).forEach(([key, value]) => {
          state[key] = value;
        });
      },
    },
  });

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

      subjects.$.next({ state, prevState });

      return true;
    },
  });

  return _proxy;
};

export const createStore = <TState extends {}>(initState: TState) => {
  const _state: any = { ...initState };
  const _prevState: any = { ...initState };
  const _subjects: any = createSubjectsForStore(initState);

  return createProxiedStore(_state, _prevState, _subjects);
};

export const useForceUpdate = () => {
  const [, update] = useState({});

  const forceUpdate = () => {
    update({});
  };

  return forceUpdate;
};

type TStoreCallback = (state: any, prevState: any, label: string) => void;

export const useStoreEffect = (
  callback: TStoreCallback,
  stores: any[],
  labels: string[]
) => {
  useEffect(() => {
    stores?.forEach((store, index) => {
      store.__x__.subjects.$?.subscribe((state: any) => {
        callback?.(state, store.prevState, labels?.[index]);
      });
    });
  }, []);
};

export const useStore = (store: any, subscribeTo: string[]) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    subscribeTo?.forEach((sub) => {
      store.__x__.subjects?.[sub]?.subscribe((value: any) => {
        if (store.__x__.prevState[sub] !== value) {
          forceUpdate();
        }
      });
    });
  }, []);

  return store;
};
