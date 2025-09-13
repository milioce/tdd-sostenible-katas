import { VideoRecorder, VideoSurveillance, MotionSensor } from './video-surveillance';

describe('VideoSurveillance', () => {
  let sensor: MotionSensor;
  let recorder: VideoRecorder;
  let controller: VideoSurveillance;

  beforeEach(() => {
    sensor = new FakeSensor();
    recorder = new FakeRecorder();
    controller = new VideoSurveillance(sensor, recorder);
  });

  it('Indica al grabador que detenga la grabación cuando el sensor no detecta movimiento', () => {
    const spyRecorder = jest.spyOn(recorder, 'stopRecording');
    controller.run();

    expect(spyRecorder).toHaveBeenCalled();
  });

  it('Indica al grabador que comience la grabación cuando el sensor detecta movimiento', () => {
    const stubSensor = jest.spyOn(sensor, 'isDetectingMotion');
    stubSensor.mockImplementation(() => true);
    const spyRecorder = jest.spyOn(recorder, 'startRecording');

    controller.run();

    expect(spyRecorder).toHaveBeenCalled();
  });

  it('Indica al grabador que detenga la grabación cuando el sensor arroja un error inesperado', () => {
    const stubSensor = jest.spyOn(sensor, 'isDetectingMotion');
    stubSensor.mockImplementation(() => {
      throw new Error();
    });
    const spyRecorder = jest.spyOn(recorder, 'stopRecording');
    controller.run();

    expect(spyRecorder).toHaveBeenCalled();
  });

  it('Comprueba el estado del sensor de movimiento una vez por segundo', () => {
    const spySensor = jest.spyOn(sensor, 'isDetectingMotion');
    const numberOfSeconds = 3;

    controller.run(numberOfSeconds);

    expect(spySensor).toHaveBeenCalledTimes(numberOfSeconds);
  });
});

class FakeRecorder implements VideoRecorder {
  startCalled = false;
  stopCalled = false;

  startRecording(): void {
    this.startCalled = true;
  }
  stopRecording(): void {
    this.stopCalled = true;
  }
}

class FakeSensor implements MotionSensor {
  isDetectingMotion(): boolean {
    return false;
  }
}
