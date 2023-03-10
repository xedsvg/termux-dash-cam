const { BatteryStatus } = require('termux');
const sensor = require('node-sensor').Sensor;

class Actions {
  constructor() {
    this.subscriptions = new Map();
    this.accelerometer = new sensor('accelerometer');
  }

  subscribe(event, callback) {
    this.subscriptions.set(event, callback);
  }

  handleAccelerometerData(data) {
    // Calculate the magnitude of the acceleration vector
    const acceleration = Math.sqrt(Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2));
    
    // Check if there was a bump (i.e. acceleration exceeded a certain threshold)
    if (acceleration > 10) {
        const callback = this.subscriptions.get('bump');
        if (callback) {
          callback();
        }
    }
  }

  start() {
    // Listen for bump events
    this.accelerometer.start();
    this.accelerometer.on('data', data => this.handleAccelerometerData(data));

    // Listen for battery events
    const batteryStatus = new BatteryStatus({ refreshInterval: 10000 });
    batteryStatus.addListener(({ level }) => {
      const callback = this.subscriptions.get('battery');
      if (callback) {
        callback(level);
      }
    });
  }
}

module.exports = Actions;
