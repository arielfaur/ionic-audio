
export interface IAudioProvider {
  current: number;
  tracks: IAudioTrack[];
  
  create(track: ITrackConstraint): IAudioTrack;
  add(track: IAudioTrack);
  play(index: number);
  pause(index?: number);
  stop(index?: number);
} 

export interface ITrackConstraint {
  id?:number;
  src: string;
  title?: string;
  artist?: string;
  art?: string;  
  preload?: string;
}

export interface IAudioTrack extends ITrackConstraint {
  src: string;
  id: number;
  isPlaying: boolean; 
  isLoading: boolean;
  isFinished: boolean;
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
}


