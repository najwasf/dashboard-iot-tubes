import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import database from "./firebase";
import "./Dashboard.css";  // import file CSS eksternal

function Dashboard() {
  const [temperature, setTemperature] = useState(null);
  const [heatStatus, setHeatStatus] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [irStatus, setIrStatus] = useState(null);

  useEffect(() => {
    const sensorRef = ref(database, "Sensors");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      setTemperature(data?.temperature);
      setHeatStatus(data?.heat_status);
      setHumidity(data?.humidity);
      setIrStatus(data?.ir_status);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Antartica Bunker Control</h1>
        {/* <nav>
          <ul>
            <li><a href="#temperature">Temperature</a></li>
            <li><a href="#heat-status">Heat Status</a></li>
            <li><a href="#humidity">Humidity</a></li>
            <li><a href="#ir-status">Infrared State</a></li>
          </ul>
        </nav> */}
      </header>

      {/* Main Content */}
      <main className="cards-grid">
        <div id="temperature" className="card temperature">
          <h2>Temperature</h2>
          <p>{temperature !== null ? `${temperature} °C` : "Loading..."}</p>
        </div>
        <div id="heat-status" className="card heat-status">
          <h2>Heat Status</h2>
          <p>{heatStatus !== null ? `${heatStatus} °C`: "Loading..."} </p>
        </div>
        <div id="humidity" className="card humidity">
          <h2>Humidity</h2>
          <p>{humidity !== null ? `${humidity} %` : "Loading..."}</p>
        </div>
        <div id="ir-status" className="card ir-status">
          <h2>Infrared State</h2>
          <p>{irStatus || "Loading..."}</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 Antarctica Bunker Control. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
