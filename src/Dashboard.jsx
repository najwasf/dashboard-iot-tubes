import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom"; // 🔹 Tambahkan ini
import database from "./firebase";
import "./Dashboard.css"; // CSS eksternal

function Dashboard() {
  const [temperature, setTemperature] = useState(null);
  const [heatStatus, setHeatStatus] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [irStatus, setIrStatus] = useState(null);
  const [modalInfo, setModalInfo] = useState({ show: false, title: "", description: "" });

  const navigate = useNavigate(); // 🔹 Inisialisasi navigate

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

  const openModal = (title, description) => {
    setModalInfo({ show: true, title, description });
  };

  const closeModal = () => {
    setModalInfo({ show: false, title: "", description: "" });
  };

  const handleLogout = () => {
    // Tambahkan logika logout jika pakai auth, misal signOut
    alert("Logged out!");
    navigate("/login"); // 🔹 Arahkan ke halaman login
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Antartica Bunker Control</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
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
              `Current temperature is ${temperature} °C.`
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
            openModal("Heat Status", `Heat index is ${heatStatus} °C.`)
          }
        >
          <h2>Heat Status</h2>
          <p>{heatStatus !== null ? `${heatStatus} °C` : "Loading..."}</p>
        </div>

        <div
          id="humidity"
          className="card humidity"
          onClick={() =>
            openModal("Humidity", `Humidity level is ${humidity}%. `)
          }
        >
          <h2>Humidity</h2>
          <p>{humidity !== null ? `${humidity} %` : "Loading..."}</p>
        </div>

        <div
          id="ir-status"
          className="card ir-status"
          onClick={() =>
            openModal("Infrared State", `Infrared sensor status: ${irStatus}. `)
          }
        >
          <h2>Infrared State</h2>
          <p>{irStatus || "Loading..."}</p>
        </div>
      </main>

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
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
