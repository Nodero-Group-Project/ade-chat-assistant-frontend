import Button from "./components/Button";
import ChatInput from "./components/ChatInput";
import Table from "./components/Table";
import { useState } from "react";

function App() {

  return (
    <>
    <h1>ADE Conversational Interface</h1>
    <div>
      <ChatInput></ChatInput>
      <Table></Table>
    </div>
    </>
  );
}

export default App;