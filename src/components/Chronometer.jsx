import { Paper, Text } from "@mantine/core";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

const Chronometer = forwardRef((_, ref) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useImperativeHandle(ref, () => ({
    start: () => setIsRunning(true),
    stop: () => setIsRunning(false),
    reset: () => {
      setIsRunning(false);
      setTime(0);
    }
  }));

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Paper>
      <Text size="xl" fw={700}>{formatTime(time)}</Text>
    </Paper>
  );
});

Chronometer.displayName = "Chronometer"; // ✅ Fix for ESLint warning

export default Chronometer;