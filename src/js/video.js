export default class VideoRecorder {
  constructor(onSave) {
    this.onSave = onSave;
    this.recorder = null;
    this.chunks = [];
    this.stream = null;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream);

    this.recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });

    this.recorder.addEventListener('stop', () => {
      const blob = new Blob(this.chunks, {
        type: this.recorder.mimeType,
      });

      const videoUrl = URL.createObjectURL(blob);

      this.onSave(videoUrl);

      this.stream.getTracks().forEach((track) => track.stop());
    });

    this.recorder.start();
  }

  stop() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }
}