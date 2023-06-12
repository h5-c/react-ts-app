import { useState } from "react";
import { Cascader, Button } from "antd";
import "./App.css";

function App() {
  const [show, setShow] = useState(true);

  return (
    <>
      <Button onClick={() => setShow(!show)}>open</Button>
      {show && <Cascader multiple />}
    </>
  );
}

export default App;
