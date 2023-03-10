const { BatteryStatus, accelerometer } = require('termux');

class Actions {
  constructor() {
    this.subscriptions = new Map();
  }

  subscribe(event, callback) {
    this.subscriptions.set(event, callback);
  }

  start() {
    // Listen for bump events
    accelerometer.addListener(({ x, y, z }) => {
      // Calculate the magnitude of the acceleration vector
      const acceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      // Check if there was a bump (i.e. acceleration exceeded a certain threshold)
      if (acceleration > 10) {
        const callback = this.subscriptions.get('bump');
        if (callback) {
          callback();
        }
      }
    });

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
