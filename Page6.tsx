import { Switch } from "../components/Switch";
import { useSwitch, useSwitchStore } from "../components/Switch/Switch.hooks";

type Props = {};

const Page6 = (props: Props) => {
  const store = useSwitch();

  console.log("store", store);

  const toggle = useSwitchStore(store, (state) => state.toggle);
  const isOn = useSwitchStore(store, (state) => state.isOn);
  // const { isOn } = store.getState();

  console.log("ss", isOn);

  return (
    <div className="m-5">
      <button onClick={() => toggle()}>external button</button>
      <br />
      <Switch store={store}>
        <Switch.On className="inline-flex bg-green-400 px-1">on</Switch.On>
        <Switch.Off className="inline-flex bg-red-400 px-1">off</Switch.Off>
        <Switch.Trigger>
          <button>change</button>
        </Switch.Trigger>
      </Switch>
      <Switch>
        <Switch.On className="inline-flex bg-green-400 px-1">on2</Switch.On>
        <Switch.Off className="inline-flex bg-red-400 px-1">off2</Switch.Off>
        <Switch.Trigger>
          <button>change2</button>
        </Switch.Trigger>
      </Switch>
    </div>
  );
};

export default Page6;
