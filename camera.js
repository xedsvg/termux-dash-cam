const { exec } = require('child_process');

class Camera {
  static record(filename) {
    return new Promise((resolve, reject) => {
      exec(`termux-camera-record ${filename}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        }
        console.log('Recording started');
        resolve();
      });
    });
  }

  static stop() {
    return new Promise((resolve, reject) => {
      exec('termux-camera-stop', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        }
        console.log('Recording stopped');
        resolve();
      });
    });
  }

  static takePhoto(filename) {
    return new Promise((resolve, reject) => {
      exec(`termux-camera-photo ${filename}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        }
        console.log('Photo taken');
        resolve();
      });
    });
  }
}

module.exports = {
  Camera,
};
