import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/health"
        );

        setMessage(response.data.message);
      } catch (error) {
        setMessage("Backend connection failed ❌");
      }
    };

    checkServer();
  }, []);

  return (
    <div>
      <h1>CyberXInfinity</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;