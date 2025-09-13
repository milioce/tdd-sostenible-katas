export interface MotionSensor {
  isDetectingMotion(): boolean;
}

export interface VideoRecorder {
  startRecording(): void;
  stopRecording(): void;
}

export class VideoSurveillance {
  constructor(
    private sensor: MotionSensor,
    private recorder: VideoRecorder
  ) {}

  public run(numberOfSeconds = 1) {
    this.range(numberOfSeconds).forEach(() => {
      this.checkMotionSensor();
      this.waitOneSecond();
    });
  }

  private range(numberOfSeconds: number) {
    return Array.from({ length: numberOfSeconds }).map((_, i) => i);
  }

  private waitOneSecond() {
    const aSecond = 1000;
    let startTime = new Date().getTime();
    const endTime = startTime + aSecond;
    while (startTime < endTime) {
      startTime = new Date().getTime();
    }
  }

  private checkMotionSensor() {
    try {
      const hasMotion = this.sensor.isDetectingMotion();
      if (hasMotion) {
        this.recorder.startRecording();
      } else {
        this.recorder.stopRecording();
      }
    } catch (e) {
      this.recorder.stopRecording();
    }
  }
}
