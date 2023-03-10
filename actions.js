// const { BatteryStatus } = require("termux");
const { exec } = require("child_process");

class Actions {
  constructor() {
    this.subscriptions = new Map();
  }

  subscribe(event, callback) {
    this.subscriptions.set(event, callback);
  }

  handleAccelerometerData() {
    let lastX, lastY, lastZ;
    exec("termux-sensor -d accelerometer", (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing command: ${err}`);
        return;
      }
      const values = stdout.split("\n")[0].split(":")[1].trim().split(",");
      const x = parseFloat(values[0]);
      const y = parseFloat(values[1]);
      const z = parseFloat(values[2]);
      if (lastX && lastY && lastZ) {
        const deltaX = Math.abs(lastX - x);
        const deltaY = Math.abs(lastY - y);
        const deltaZ = Math.abs(lastZ - z);
        if (deltaX > 10 || deltaY > 10 || deltaZ > 10) {
          const callback = this.subscriptions.get("bump");
          if (callback) {
            callback();
          }
        }
      }
      lastX = x;
      lastY = y;
      lastZ = z;
      this.handleAccelerometerData();
    });
  }

  start() {
    // Listen for bump events
    this.handleAccelerometerData();

    // Listen for battery events
    // const batteryStatus = new BatteryStatus({ refreshInterval: 10000 });
    // batteryStatus.addListener(({ level }) => {
    //   const callback = this.subscriptions.get("battery");
    //   if (callback) {
    //     callback(level);
    //   }
    // });
  }
}

module.exports = Actions;
