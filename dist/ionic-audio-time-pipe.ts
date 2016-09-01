import {Pipe, PipeTransform} from '@angular/core';

/**
 * A pipe to convert milliseconds to a string representation
 * 
 * @export
 * @class AudioTimePipe
 * @implements {PipeTransform}
 */
@Pipe({name: 'audioTime'})
export class AudioTimePipe implements PipeTransform {
  
  /**
   * Transforms milliseconds to hh:mm:ss
   * 
   * @method transform
   * @param {number} [value] The milliseconds
   * @return {string} hh:mm:ss
   */
  transform(value?:number) : string {    
    if (value===undefined || Number.isNaN(value)) return '';
    let s = Math.trunc(value % 60);
    let m = Math.trunc((value / 60) % 60);
    let h = Math.trunc(((value / 60) / 60) % 60);  
    return h > 0 ? `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}` : `${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
  }
}