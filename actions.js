// const { BatteryStatus } = require("termux");
const { exec } = require("child_process");

class Actions {
  constructor() {
    this.subscriptions = new Map();
    this.lastX = 0;
    this.lastY = 0;
    this.lastZ = 0;

  }

  subscribe(event, callback) {
    this.subscriptions.set(event, callback);
  }

  handleAccelerometerData() {
    
    exec("termux-sensor -s accelerometer -n 1", (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing command: ${err}`);
        return;
      }
      const values = stdout.split("\n")[0].split(":")[1].trim().split(",");
      const x = parseFloat(values[0]);
      const y = parseFloat(values[1]);
      const z = parseFloat(values[2]);
      if (lastX && lastY && lastZ) {
        const deltaX = Math.abs(this.lastX - x);
        const deltaY = Math.abs(this.lastY - y);
        const deltaZ = Math.abs(this.lastZ - z);
        if (deltaX > 10 || deltaY > 10 || deltaZ > 10) {
          const callback = this.subscriptions.get("bump");
          if (callback) {
            callback();
          }
        }
      }
      this.lastX = x;
      this.lastY = y;
      this.lastZ = z;
      console.log(this.lastX, this.lastY, this.lastZ);
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
