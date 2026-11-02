export default class AudioRecorder {
  constructor(onSave) {
    this.onSave = onSave;
    this.recorder = null;
    this.chunks = [];
  }

  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    this.chunks = [];
    this.recorder = new MediaRecorder(stream);

    this.recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });

    this.recorder.addEventListener('stop', () => {
      const blob = new Blob(this.chunks, {
        type: this.recorder.mimeType,
      });

      this.onSave(URL.createObjectURL(blob));

      stream.getTracks().forEach((track) => track.stop());
    });

    this.recorder.start();
  }

  stop() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }
}