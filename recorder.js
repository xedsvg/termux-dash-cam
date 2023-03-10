const { Camera } = require('./camera');

class Recorder {
  constructor() {
    this.isRecording = false;
    this.timelapseDir = '';
    this.continuousFilename = '';
  }

  recordTimelapse(minutes, interval) {
    return new Promise((resolve, reject) => {
      const dirName = `timelapse_${new Date().toISOString().replace(/:/g, '-')}`;
      const dirPath = `./${dirName}`;

      fs.mkdir(dirPath, (err) => {
        if (err && err.code !== 'EEXIST') {
          console.error('Error creating timelapse directory');
          reject(err);
        }

        this.timelapseDir = dirPath;
        this.isRecording = true;

        const intervalId = setInterval(() => {
          const filename = `${dirPath}/${new Date().toISOString().replace(/:/g, '-')}.jpg`;
          Camera.takePhoto(filename);
        }, interval * 1000);

        setTimeout(() => {
          clearInterval(intervalId);
          this.isRecording = false;
          resolve();
        }, minutes * 1000);
      });
    });
  }

  continuousRecording(minutes) {
    return new Promise((resolve, reject) => {
      const filename = `continuous_${new Date().toISOString().replace(/:/g, '-')}.mp4`;
      const filePath = `./${filename}`;

      Camera.record(filePath).then(() => {
        this.isRecording = true;
        this.continuousFilename = filePath;
        setTimeout(() => {
          Camera.stop().then(() => {
            this.isRecording = false;
            resolve();
          });
        }, minutes * 1000);
      }).catch((error) => {
        console.error('Error recording video', error);
        reject(error);
      });
    });
  }
}

module.exports = {
  Recorder,
};
