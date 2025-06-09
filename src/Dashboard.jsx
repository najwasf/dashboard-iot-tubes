import React, { useRef, useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { database } from "./firebase";

import "./Dashboard.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [temperature, setTemperature] = useState(null);
  const [heatStatus, setHeatStatus] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [irStatus, setIrStatus] = useState(null);
  const [gateStatus, setGateStatus] = useState(null);

  const [tempHistory, setTempHistory] = useState([]);
  const [heatHistory, setHeatHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [irHistory, setIrHistory] = useState([]);
  const [gateHistory, setGateHistory] = useState([]);

  const prevIrStatus = useRef(null);
  const navigate = useNavigate();

  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: "",
    description: "",
    chartData: [],
    color: "#ffffff",
  });

  useEffect(() => {
    const sensorRef = ref(database, "Sensors");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      const now = new Date().toLocaleTimeString();

      setTemperature(data?.temperature ?? null);
      setHeatStatus(data?.heat_status ?? null);
      setHumidity(data?.humidity ?? null);
      setIrStatus(data?.ir_status ?? null);
      setGateStatus(data?.gate_status ?? null);

      if (data?.temperature !== undefined) {
        setTempHistory((prev) => [...prev.slice(-19), { time: now, value: data.temperature }]);
      }
      if (data?.heat_status !== undefined) {
        setHeatHistory((prev) => [...prev.slice(-19), { time: now, value: data.heat_status }]);
      }
      if (data?.humidity !== undefined) {
        setHumidityHistory((prev) => [...prev.slice(-19), { time: now, value: data.humidity }]);
      }
      if (data?.ir_status !== undefined) {
        const irValue = data.ir_status === "ON" || data.ir_status === true ? 1 : 0;
        if (irValue === 1 && prevIrStatus.current !== 1) {
          setIrHistory((prev) => [...prev.slice(-19), { time: now, value: 1 }]);
        }
        prevIrStatus.current = irValue;
      }
      if (data?.gate_status !== undefined) {
        setGateHistory((prev) => [
          ...prev.slice(-19),
          { time: now, value: data.gate_status },
        ]);
      }
    });

    return () => unsubscribe();
  }, []);

  const openModal = (title, description, chartData = [], color = "#ffffff") => {
    setModalInfo({ show: true, title, description, chartData, color });
  };

  const closeModal = () => {
    setModalInfo({
      show: false,
      title: "",
      description: "",
      chartData: [],
      color: "#ffffff",
    });
  };

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content" style={{ textAlign: "center" }}>
          <h1>Antartica Bunker Control</h1>
        </div>
      </header>

      <main className="cards-grid">
        <div
          id="temperature"
          className="card temperature"
          onClick={() =>
            openModal(
              "Temperature",
              `Current temperature is ${temperature} °C.`,
              tempHistory,
              "#ff7300"
            )
          }
        >
          <h2>Temperature</h2>
          <p>{temperature !== null ? `${temperature} °C` : "Loading..."}</p>
        </div>

        <div
          id="heat-status"
          className="card heat-status"
          onClick={() =>
            openModal(
              "Heat Status",
              `Heat index is ${heatStatus} °C.`,
              heatHistory,
              "#ff0000"
            )
          }
        >
          <h2>Heat Status</h2>
          <p>{heatStatus !== null ? `${heatStatus} °C` : "Loading..."}</p>
        </div>

        <div
          id="humidity"
          className="card humidity"
          onClick={() =>
            openModal(
              "Humidity",
              `Humidity level is ${humidity}%.`,
              humidityHistory,
              "#0077ff"
            )
          }
        >
          <h2>Humidity</h2>
          <p>{humidity !== null ? `${humidity} %` : "Loading..."}</p>
        </div>

        <div
          id="ir-status"
          className="card ir-status"
          onClick={() => {
            const detectedEntries = irHistory.filter((entry) => entry.value === 1);
            const detectedStrings = detectedEntries.map(
              (entry) => `${entry.time} - Detected`
            );

            const description =
              detectedStrings.length > 0
                ? `Detection timestamps:\n${detectedStrings.join("\n")}`
                : `No detection has been logged yet.`;

            openModal("Infrared Detection Log", description, [], "#00cc00");
          }}
        >
          <h2>Infrared State</h2>
          <p>{irStatus || "Loading..."}</p>
        </div>

        <div
          id="gate-status"
          className="card gate-status"
          onClick={() => {
            const statusEntries = gateHistory.map(
              (entry) => `${entry.time} - ${entry.value}`
            );
            const description =
              statusEntries.length > 0
                ? `Gate status log:\n${statusEntries.join("\n")}`
                : `No gate status logs yet.`;

            openModal("Gate Status Log", description, [], "#9900cc");
          }}
        >
          <h2>Gate Status</h2>
          <p>{gateStatus || "Loading..."}</p>
        </div>
      </main>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <footer className="dashboard-footer">
        <p>© 2025 Rafina Industries. All rights reserved.</p>
      </footer>

      {modalInfo.show && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalInfo.title}</h2>

            {modalInfo.chartData.length === 0 ? (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  maxHeight: "200px",
                  overflowY: "auto",
                  backgroundColor: "#f0f0f0",
                  padding: "10px",
                  borderRadius: "5px",
                  marginTop: "20px",
                }}
              >
                {modalInfo.description}
              </pre>
            ) : (
              <>
                <p>{modalInfo.description}</p>
                <div style={{ width: "100%", height: 250, marginTop: 20 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={modalInfo.chartData}>
                      <XAxis dataKey="time" />
                      <YAxis domain={[-20, 80]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={modalInfo.color}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            <button onClick={closeModal} style={{ marginTop: 20 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
