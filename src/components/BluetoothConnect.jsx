import { useState, useEffect } from "react";

const BluetoothConnect = () => {
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState("Disconnected");
  const [lastKey, setLastKey] = useState(null);

  const requestBluetoothDevice = async () => {
    try {
      setStatus("Scanning...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // Acepta cualquier dispositivo
        optionalServices: ["battery_service"] // Servicio opcional
      });
      setDevice(device);
      setStatus(`Connected to: ${device.name || "Unknown Device"}`);
    } catch (error) {
      console.error("Bluetooth Error:", error);
      setStatus("Failed to connect");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log("Key pressed:", event.key);
      setLastKey(event.key);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-sm">
      <h2 className="text-lg font-bold mb-2">Bluetooth Connection</h2>
      <button 
        onClick={requestBluetoothDevice} 
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Scan & Connect
      </button>
      <p className="mt-2 text-gray-700">Status: {status}</p>
      {device && <p className="mt-2">Connected to: {device.name}</p>}
      {lastKey && <p className="mt-2 text-green-600">Last Key Pressed: {lastKey}</p>}
    </div>
  );
};

export default BluetoothConnect;
