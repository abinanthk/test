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

const makeSubjects = (state: any, subscription: any) => {
  const _subjects: any = {};

  Object.entries(state).forEach(([key, value]) => {
    console.log("---", key, subscription[key]);

    if (typeof state[key] === "function") {
      console.log("--- not subscribed function", key);
      return;
    }

    if (subscription[key] === false) {
      console.log("--- not subscribed false", key);
      return;
    }

    console.log("--- subscribed", key);
    _subjects[key] = new BehaviorSubject(value);
  });

  return _subjects;
};

export const createStore = <TState extends {}>(
  initState: TState,
  subscription?: any
) => {
  const _state: any = { ...initState };
  const _prevState: any = { ...initState };
  const _subjects: any = makeSubjects(initState, subscription);

  console.log("_subjects", _subjects);

  const _store: TStore = {
    subjects: _subjects,
    prevState: _prevState,
    state: new Proxy(_state, {
      get(target, prop) {
        return Reflect.get(target, prop);
      },
      set(target, prop, value) {
        _prevState[prop] = _state[prop];

        if (!Reflect.set(target, prop, value)) {
          return false;
        }

        _subjects[prop]?.next(value);

        return true;
      },
    }),
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

  console.log("-----------", store);

  useEffect(() => {
    store.subjects[sub]?.subscribe((value: any) => {
      console.log("key : ", sub);
      console.log("value : ", value);
      console.log("store.prevState[sub] : ", store.prevState[sub]);
      if (store.prevState[sub] !== value) {
        console.log("update----------");
        forceUpdate();
      }
    });
  }, []);

  return useStoreState<T>(store);
};
