import { createStore, useStore, useStoreState } from "../stores/store";

type TUserStore = {
  name: string;
};

const userStore = createStore<TUserStore>(
  {
    name: "",
  },
  {
    // name: true,
  }
);

type TCountStore = {
  value: string;
  count: number;
  incTen: () => void;
  print: () => void;
  user: TUserStore;
  // name: string;
  refreshState: () => void;
};

const countStore = createStore<TCountStore>(
  {
    value: "",
    count: 0,
    user: userStore.state,
    // name: userStore.state.name,
    incTen() {
      this.count += 10;
    },
    print: () => {
      console.log("hello");
    },
    refreshState() {
      this.value = "empty";
      this.count = -1;
      this.user.name = "new name";
    },
  },
  {
    // value: true,
    // count: false,
    // user: false,
  }
);

console.log("userStore", userStore);
console.log("countStore", countStore);

function View() {
  const store = useStore<TCountStore>(countStore, "value");

  return (
    <div>
      <p>{store.value}</p>
    </div>
  );
}

function View2() {
  const store = useStore<TCountStore>(countStore, "count");

  return (
    <div>
      <p>{store.count}</p>
    </div>
  );
}

function ViewUser() {
  const store = useStore<TUserStore>(userStore, "name");

  console.log("------>>> user", store.name);

  return (
    <div>
      <p>{store.name}</p>
    </div>
  );
}

function Control() {
  const countStoreState = useStoreState<TCountStore>(countStore);

  const handleChange = (e: any) => {
    countStoreState.value = e.target.value;
  };

  const handleChangeName = (e: any) => {
    countStoreState.user.name = e.target.value;
  };

  const handleClick = () => {
    countStoreState.count++;
  };

  const handleClick2 = () => {
    countStoreState.incTen();
  };
  const handleReset = () => {
    // countStore.reset();
    // countStore.reset();
    countStoreState.refreshState();
  };
  return (
    <div>
      <input onChange={handleChange} />
      <input onChange={handleChangeName} />
      <button onClick={handleClick}>click</button>
      <button onClick={handleClick2}>inc 10</button>
      <button onClick={handleReset}>reset</button>
    </div>
  );
}

export default function Sample1() {
  return (
    <div>
      <View />
      <View2 />
      <ViewUser />
      <Control />
    </div>
  );
}
