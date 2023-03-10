// const { BatteryStatus } = require("termux");
const { spawn } = require("child_process");

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

  handleAccelerometerData(data, sensivity) {
    let values;
      try {
        values = JSON.parse(data.toString());
        const [x, y, z] = values[Object.keys(values)[0]].values;
        if (this.lastX && this.lastY && this.lastZ) {
          const deltaX = Math.abs(this.lastX - x);
          const deltaY = Math.abs(this.lastY - y);
          const deltaZ = Math.abs(this.lastZ - z);
          if (deltaX > sensivity || deltaY > sensivity || deltaZ > sensivity) {
            const callback = this.subscriptions.get("bump");
            if (callback) {
              callback();
            }
          }
          console.log(deltaX, deltaY, deltaZ);
        }
        this.lastX = x;
        this.lastY = y;
        this.lastZ = z;
      } catch(e) {
        console.error(e);
      }
  }

  start() {
    // Listen for bump events
    (async () => {
      await this.startAccelerometer(50, 0.5);
    })();

    // Listen for battery events
    // const batteryStatus = new BatteryStatus({ refreshInterval: 10000 });
    // batteryStatus.addListener(({ level }) => {
    //   const callback = this.subscriptions.get("battery");
    //   if (callback) {
    //     callback(level);
    //   }
    // });
  }

  async startAccelerometer(interval, sensivity) {
    const sensorProcess = await spawn("termux-sensor", [
      "-d",
      interval,
      "-s",
      "accelerometer",
    ]);

    sensorProcess.stdout.on("data", (rawData) => {
      this.handleAccelerometerData(rawData, sensivity);
    });

    sensorProcess.stderr.on("data", (data) => {
      console.error(`sensorProcess error: ${data}`);
    });

    sensorProcess.on("close", (code) => {
      console.log(`sensorProcess closed with code ${code}`);
    });

    return sensorProcess;
  }

  stopAccelerometer(sensorProcess) {
    if (sensorProcess) {
      sensorProcess.kill();
    }
  }
}

module.exports = Actions;
