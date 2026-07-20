import ListGroup from "./components/ListGroup";
import Alert from "./components/Alert";
import Button from "./components/Button";
import TextForm from "./components/TextForm";
import { useState } from "react";

function App() {
  //  let items = [
  //         'New York',
  //         'San Francisco',
  //         'Tokyo',
  //         'London',
  //         'Paris'
  //     ];

  // const handleSelectItem = (item: string) => {
  //   console.log(item);
  // }

  // return (
  //   <div><ListGroup items={items} heading="Cities" onSelectItem={handleSelectItem} /></div>
  // ); 

  const [alertVisible, setAlertVisibility] = useState(false);

  return (
    // <div>
    //     <Alert>
    //       Hello <span>World</span>
    //     </Alert>
    // </div>

    // <div>
    //   { alertVisible && <Alert onClose={() => setAlertVisibility(false)}>Anton is MICHAEL!</Alert>}
    //   <Button color="primary" onClick={() => setAlertVisibility(true)}>Date me</Button>
    // </div>

    <div>
      <TextForm></TextForm>
    </div>
  );
}

export default App;