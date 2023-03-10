const Actions = require('./actions');
const Recorder = require('./recorder');
const CheckTermuxApi = require('/checkTermuxApi');

const api = require('./api');
const PORT = 3000;

new CheckTermuxApi();

if(CheckTermuxApi.check()) {
// Create an instance of the Actions class
const actions = new Actions();

// Subscribe to the 'bump' event
actions.subscribe('bump', () => {
  // Start recording for 5 minutes
  const recorder = new Recorder();
  recorder.continuousRecording(5);
});

// Subscribe to the 'battery' event
actions.subscribe('battery', (level) => {
  // Take a timelapse if the battery level is at or above 50%
  if (level >= 50) {
    const recorder = new Recorder();
    recorder.recordTimelapse(2,2);
  }
});

// Start listening for events
actions.start();

api.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}
