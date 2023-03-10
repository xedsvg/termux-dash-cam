const { exec } = require('child_process');

class Converter {
  static convertToMp4(inputFilename, outputFilename) {
    return new Promise((resolve, reject) => {
      exec(`ffmpeg -framerate 30 -pattern_type glob -i '${inputFilename}/*.jpg' -c:v libx264 -pix_fmt yuv420p ${outputFilename}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        }
        console.log('Conversion to mp4 completed');
        resolve();
      });
    });
  }
}

module.exports = {
  Converter,
};
