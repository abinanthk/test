import { createStore, useStore, useStoreEffect } from "../stores/store";

type TUserStore = {
  name: string;
};

const userStore = createStore<TUserStore>({
  name: "",
});

type TCountStore = {
  value: string;
  count: number;
  incTen: () => void;
  print: () => void;
  user: TUserStore;
  refreshState: () => void;
};

const countStore = createStore<TCountStore>({
  value: "",
  count: 0,
  user: userStore,
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
});

console.log("userStore", userStore);
console.log("countStore", countStore);

function View() {
  const store = useStore(countStore, ["value"]);

  return (
    <div>
      <p>{store.value}</p>
    </div>
  );
}

function View2() {
  const store = useStore(countStore, ["count"]);

  return (
    <div>
      <p>{store.count}</p>
    </div>
  );
}

function ViewUser() {
  const store = useStore(countStore, ["user"]);

  return (
    <div>
      {" "}
      <p>{store.user.name}</p>{" "}
    </div>
  );
}

function ViewUser2() {
  const store = useStore(userStore, ["name"]);

  return (
    <div>
      <p>{store?.name}</p>
    </div>
  );
}

function Control() {
  const handleChange = (e: any) => {
    countStore.value = e.target.value;
  };

  const handleChangeName = (e: any) => {
    countStore.user.name = e.target.value;
  };

  const handleClick = () => {
    countStore.count++;
  };

  const handleClick2 = () => {
    countStore.incTen();
  };
  const handleReset = () => {
    // countStore.refreshState();
    countStore.reset();
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

function Control2() {
  const handleChangeName2 = (e: any) => {
    userStore.name = e.target.value;
  };

  return (
    <div>
      <input onChange={handleChangeName2} />
    </div>
  );
}

export default function Sample1() {
  useStoreEffect(
    (state, label) => {
      console.log("effect", label, state);
    },
    [countStore, userStore],
    ["count", "user"]
  );

  console.log("render sample1");
  return (
    <div>
      <View />
      <View2 />
      <ViewUser />
      <ViewUser2 />
      <Control />
      <Control2 />
    </div>
  );
}
