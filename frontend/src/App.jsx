// import { useEffect, useState } from "react";
// import axios from "axios";
import Home from "./components/Home";
function App() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   axios.get("http://localhost:3000/") // Call backend
  //     .then(response => setMessage(response.data))
  //     .catch(error => console.error("Error:", error));
  // }, []);

  return (
    <div> 
      <h1>Book Keeper📚</h1>
      
      {/* <p>{message}</p> */}
      <Home></Home>

    </div>
  );
}

export default App;
