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

export const createStore = <TState extends {}>(initState: TState) => {
  const _state: any = { ...initState };
  let _prevState: any = { ...initState };
  let _subjects: any = {};

  Object.keys(_state).forEach((key) => {
    _subjects[key] = new BehaviorSubject(_state[key]);
  });

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

        _subjects[prop].next(value);

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

export const useStoreState = (store: TStore) => {
  return store.state;
};

export const useStore = (store: TStore, sub: string) => {
  const forceUpdate = useForceUpdate();

  console.log("-----------", store);

  useEffect(() => {
    store.subjects[sub].subscribe((value) => {
      console.log("key : ", sub);
      console.log("value : ", value);
      console.log("store.prevState[sub] : ", store.prevState[sub]);
      if (store.prevState[sub] !== value) {
        console.log("update----------");
        forceUpdate();
      }
    });
  }, []);

  return useStoreState(store);
};
