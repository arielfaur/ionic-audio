import { EventEmitter } from '@angular/core';

/**
 * Defines the audio provider contract
 *
 * @export
 * @interface IAudioProvider
 */
export interface IAudioProvider {
  current: number;
  tracks: IAudioTrack[];

  create(track: ITrackConstraint): IAudioTrack;
  add(track: IAudioTrack);
  play(index: number);
  pause(index?: number);
  stop(index?: number);
}

/**
 * Defines the properties for JSON objects representing tracks to be played
 *
 * @export
 * @interface ITrackConstraint
 */
export interface ITrackConstraint {
  id?:number;
  src: string;
  title?: string;
  artist?: string;
  art?: string;
  preload?: string;
}

/**
 * Defines the audio track contract
 *
 * @export
 * @interface IAudioTrack
 * @extends {ITrackConstraint}
 */
export interface IAudioTrack extends ITrackConstraint {
  src: string;
  id: number;
  isPlaying: boolean;
  isLoading: boolean;
  isFinished: boolean;
  isLoaded: boolean;
  duration: number;
  progress: number;
  completed: number;
  canPlay:  boolean;
  error: MediaError;

  play();
  pause();
  stop();
  seekTo(time: number);
  destroy();

  onLoaded: EventEmitter<IAudioTrack>;
  onPlaying: EventEmitter<IAudioTrack>;
  onStop: EventEmitter<IAudioTrack>;
  onFinished: EventEmitter<IAudioTrack>;
  onProgressChange: EventEmitter<IAudioTrack>;
  onError: EventEmitter<IAudioTrackError>;
}

/**
 * Defines the audio track error contract
 *
 * @export
 * @interface IAudioTrackError
 */
export interface IAudioTrackError {
  track: IAudioTrack,
  error: ErrorEvent,
}
