import React, { useRef, useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
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
  const navigate = useNavigate();
  const prevIrStatus = useRef(0);

  const [sensorData, setSensorData] = useState({
    temperature: null,
    heatStatus: null,
    humidity: null,
    irStatus: null,
    gateStatus: null,
  });

  const [histories, setHistories] = useState({
    temperature: [],
    heatStatus: [],
    humidity: [],
    irStatus: [],
    gateStatus: [],
  });

  const [lockdown, setLockdown] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: "",
    description: "",
    chartData: [],
    color: "#ffffff",
  });

  const now = () => new Date().toLocaleTimeString();

  // Listener sensor
  useEffect(() => {
    const sensorRef = ref(database, "Sensors");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setSensorData({
        temperature: data.temperature ?? null,
        heatStatus: data.heat_status ?? null,
        humidity: data.humidity ?? null,
        irStatus: data.ir_status ?? null,
        gateStatus: data.gate_status ?? null,
      });

      setHistories((prev) => ({
        temperature: data.temperature !== undefined
          ? [...prev.temperature.slice(-19), { time: now(), value: data.temperature }]
          : prev.temperature,

        heatStatus: data.heat_status !== undefined
          ? [...prev.heatStatus.slice(-19), { time: now(), value: data.heat_status }]
          : prev.heatStatus,

        humidity: data.humidity !== undefined
          ? [...prev.humidity.slice(-19), { time: now(), value: data.humidity }]
          : prev.humidity,

        irStatus: data.ir_status !== undefined
          ? (() => {
              const irValue = data.ir_status === "ON" || data.ir_status === true ? 1 : 0;
              if (irValue === 1 && prevIrStatus.current !== 1) {
                prevIrStatus.current = irValue;
                return [...prev.irStatus.slice(-19), { time: now(), value: 1 }];
              }
              prevIrStatus.current = irValue;
              return prev.irStatus;
            })()
          : prev.irStatus,

        gateStatus: data.gate_status !== undefined
          ? [...prev.gateStatus.slice(-19), { time: now(), value: data.gate_status }]
          : prev.gateStatus,
      }));
    });

    return () => unsubscribe();
  }, []);

  // Listener lockdown
  useEffect(() => {
    const lockdownRef = ref(database, "Control/Lockdown");
    const unsubscribe = onValue(lockdownRef, (snapshot) => {
      setLockdown(!!snapshot.val());
    });
    return () => unsubscribe();
  }, []);

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

  const handleLockdownToggle = () => {
    const newValue = !lockdown;
    set(ref(database, "Control/Lockdown"), newValue)
      .then(() => console.log("Lockdown updated"))
      .catch((err) => console.error("Failed to update lockdown state:", err));
  };

  const handleServoCommand = (command) => {
    set(ref(database, "Control/Servo"), command)
      .then(() => console.log(`Servo command set to ${command}`))
      .catch((err) => console.error("Failed to update servo command:", err));
  };

  // ✅ Reset servo dengan nilai kosong ("")
  const handleServoReset = () => {
    set(ref(database, "Control/Servo"), "")
      .then(() => console.log("Servo command has been reset"))
      .catch((err) => console.error("Failed to reset servo command:", err));
  };

  const renderCard = (id, label, value, historyKey, color, unit = "", descriptionFn) => (
    <div
      id={id}
      className={`card ${id}`}
      onClick={() => openModal(
        label,
        descriptionFn(value, histories[historyKey]),
        histories[historyKey],
        color
      )}
    >
      <h2>{label}</h2>
      <p>{value !== null ? `${value}${unit}` : "Loading..."}</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content" style={{ textAlign: "center" }}>
          <h1>Sistem Monitoring Suhu-Kelembapan dan Kontrol Arah Servo Berbasis MQTT-HTTP</h1>
        </div>
      </header>

      <main className="cards-grid">
        {renderCard("temperature", "Temperature", sensorData.temperature, "temperature", "#ff7300", " °C",
          (val) => `Current temperature is ${val} °C.`)}

        {renderCard("heat-status", "Heat Status", sensorData.heatStatus, "heatStatus", "#ff0000", " °C",
          (val) => `Heat index is ${val} °C.`)}

        {renderCard("humidity", "Humidity", sensorData.humidity, "humidity", "#0077ff", " %",
          (val) => `Humidity level is ${val}%.`)}

        <div
          id="ir-status"
          className="card ir-status"
          onClick={() => {
            const entries = histories.irStatus.filter((e) => e.value === 1);
            const desc = entries.length
              ? `Detection timestamps:\n${entries.map((e) => `${e.time} - Detected`).join("\n")}`
              : "No detection has been logged yet.";
            openModal("Infrared Detection Log", desc, [], "#00cc00");
          }}
        >
          <h2>Infrared State</h2>
          <p>{sensorData.irStatus ?? "Loading..."}</p>
        </div>

        <div
          id="gate-status"
          className="card gate-status"
          onClick={() => {
            const desc = histories.gateStatus.length
              ? `Gate status log:\n${histories.gateStatus.map((e) => `${e.time} - ${e.value}`).join("\n")}`
              : "No gate status logs yet.";
            openModal("Gate Status Log", desc, [], "#000000");
          }}
        >
          <h2>Gate Status</h2>
          <p>{sensorData.gateStatus ?? "Loading..."}</p>
        </div>
      </main>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <button
          className="lockdown-button"
          onClick={handleLockdownToggle}
          style={{
            backgroundColor: lockdown ? "#ff0000" : "#00cc00",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {lockdown ? "Lockdown: ON" : "Lockdown: OFF"}
        </button>
      </div>

      {/* 🔘 Tombol Servo Control */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: 20 }}>
        <button onClick={() => handleServoCommand("OPEN")} className="servo-button open">
          Buka Servo
        </button>
        <button onClick={() => handleServoCommand("CLOSE")} className="servo-button close">
          Tutup Servo
        </button>
        <button onClick={handleServoReset} className="servo-button reset">
          Reset Servo
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
              <pre style={{
                whiteSpace: "pre-wrap",
                maxHeight: "200px",
                overflowY: "auto",
                backgroundColor: "#f0f0f0",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "20px",
              }}>
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
