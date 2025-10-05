import os from "os";
import { exec } from "child_process";

const CHECK_INTERVAL = 5000; 
const CPU_THRESHOLD = 70; 

function getCpuUsage() {
  const cpus = os.cpus();
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;

  for (let cpu of cpus) {
    user += cpu.times.user;
    nice += cpu.times.nice;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  }

  const total = user + nice + sys + idle + irq;
  return ((total - idle) / total) * 100;
}

function monitorCpu() {
  const usage = getCpuUsage();
  console.log(`CPU Usage: ${usage.toFixed(2)}%`);

  if (usage > CPU_THRESHOLD) {
    console.log("CPU usage exceeded 70%! Restarting server...");
    
    
    exec("pm2 restart policy-api", (err, stdout, stderr) => {
      if (err) {
        console.error("Error restarting server:", err);
        return;
      }
      console.log(" Server restarted successfully!");
    });
  }
}

setInterval(monitorCpu, CHECK_INTERVAL);
