import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import database from "./firebase";
import "./Dashboard.css";

// Import Recharts untuk grafik
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  // State data sensor terkini
  const [temperature, setTemperature] = useState(null);
  const [heatStatus, setHeatStatus] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [irStatus, setIrStatus] = useState(null);

  // State histori data untuk grafik (array objek {time, value})
  const [tempHistory, setTempHistory] = useState([]);
  const [heatHistory, setHeatHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [irHistory, setIrHistory] = useState([]);

  // State modal
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: "",
    description: "",
    chartData: [],
    color: "#ffffff",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const sensorRef = ref(database, "Sensors");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();

      // Update nilai sensor sekarang
      setTemperature(data?.temperature);
      setHeatStatus(data?.heat_status);
      setHumidity(data?.humidity);
      setIrStatus(data?.ir_status);

      const now = new Date().toLocaleTimeString();

      // Update histori data, simpan max 20 poin terakhir
      if (data?.temperature !== undefined) {
        setTempHistory((prev) => [
          ...prev.slice(-19),
          { time: now, value: data.temperature },
        ]);
      }
      if (data?.heat_status !== undefined) {
        setHeatHistory((prev) => [
          ...prev.slice(-19),
          { time: now, value: data.heat_status },
        ]);
      }
      if (data?.humidity !== undefined) {
        setHumidityHistory((prev) => [
          ...prev.slice(-19),
          { time: now, value: data.humidity },
        ]);
      }
      if (data?.ir_status !== undefined) {
        // Untuk IR status yang kemungkinan string, kita bisa simpan 1 untuk ON, 0 untuk OFF
        const irValue = data.ir_status === "ON" || data.ir_status === true ? 1 : 0;
        setIrHistory((prev) => [...prev.slice(-19), { time: now, value: irValue }]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fungsi buka modal + kirim data grafik dan warna garis
  const openModal = (title, description, chartData = [], color = "#ffffff") => {
    setModalInfo({ show: true, title, description, chartData, color });
  };

  const closeModal = () => {
    setModalInfo({ show: false, title: "", description: "", chartData: [], color: "#ffffff" });
  };

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content" style={{ textAlign: "center" }}>
          <h1>Antartica Bunker Control</h1>
        </div>
      </header>

      {/* Main Content */}
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
          onClick={() =>
            openModal(
              "Infrared State",
              `Infrared sensor status: ${irStatus}.`,
              irHistory,
              "#00cc00"
            )
          }
        >
          <h2>Infrared State</h2>
          <p>{irStatus || "Loading..."}</p>
        </div>
      </main>

      {/* Logout Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 Rafina Industries. All rights reserved.</p>
      </footer>

      {/* Modal */}
      {modalInfo.show && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalInfo.title}</h2>
            <p>{modalInfo.description}</p>

            <div style={{ width: "100%", height: 250, marginTop: 20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={modalInfo.chartData}>
                  <XAxis dataKey="time" />
                  <YAxis />
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
