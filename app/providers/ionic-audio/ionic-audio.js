"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var ionic_angular_1 = require('ionic-angular');
var drag_gesture_1 = require('ionic-angular/gestures/drag-gesture');
var WebAudioProvider = (function () {
    function WebAudioProvider() {
    }
    WebAudioProvider.createAudio = function (track) {
        var audioTrack = new AudioTrack(track.src, track.preload);
        Object.assign(audioTrack, track);
        var trackId = WebAudioProvider.tracks.push(audioTrack);
        audioTrack.id = trackId - 1;
        return audioTrack;
    };
    WebAudioProvider.prototype.add = function (audioTrack) {
        WebAudioProvider.tracks.push(audioTrack);
    };
    ;
    WebAudioProvider.prototype.play = function (index) {
        if (index === undefined || index > WebAudioProvider.tracks.length - 1)
            return;
        this._current = index;
        WebAudioProvider.tracks[index].play();
    };
    ;
    WebAudioProvider.prototype.pause = function (index) {
        if (this._current === undefined || index > WebAudioProvider.tracks.length - 1)
            return;
        index = index || this._current;
        WebAudioProvider.tracks[index].pause();
    };
    ;
    WebAudioProvider.prototype.stop = function (index) {
        if (this._current === undefined || index > WebAudioProvider.tracks.length - 1)
            return;
        index = index || this._current;
        WebAudioProvider.tracks[index].stop();
        this._current = undefined;
    };
    ;
    Object.defineProperty(WebAudioProvider.prototype, "tracks", {
        get: function () {
            return WebAudioProvider.tracks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebAudioProvider.prototype, "current", {
        get: function () {
            return this._current;
        },
        set: function (v) {
            this._current = v;
        },
        enumerable: true,
        configurable: true
    });
    WebAudioProvider.tracks = [];
    WebAudioProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], WebAudioProvider);
    return WebAudioProvider;
}());
exports.WebAudioProvider = WebAudioProvider;
var AudioTrack = (function () {
    function AudioTrack(src, preload, ctx) {
        var _this = this;
        if (preload === void 0) { preload = 'none'; }
        if (ctx === void 0) { ctx = new (AudioContext || webkitAudioContext)(); }
        this.src = src;
        this.preload = preload;
        this.ctx = ctx;
        this.isPlaying = false;
        this.isFinished = false;
        this.createAudio();
        this.audio.addEventListener("timeupdate", function (e) { _this.onTimeUpdate(e); }, false);
        this.audio.addEventListener("error", function (err) {
            console.log("Audio error => track " + src, err);
        }, false);
        this.audio.addEventListener("canplay", function () {
            console.log("Track " + _this.src + " has finished loading");
            _this._isLoading = false;
            _this._hasLoaded = true;
        }, false);
        this.audio.addEventListener("playing", function () {
            console.log("Playing track " + _this.src);
            _this.isFinished = false;
            _this.isPlaying = true;
        }, false);
        this.audio.addEventListener("ended", function () {
            _this.isPlaying = false;
            _this.isFinished = true;
            console.log('Finished playback');
        }, false);
        this.audio.addEventListener("durationchange", function (e) {
            _this._duration = e.target.duration;
        }, false);
    }
    AudioTrack.prototype.createAudio = function () {
        this.audio = new Audio();
        this.audio.src = this.src;
        this.audio.preload = this.preload;
        //this.audio.controls = true;
        //this.audio.autoplay = false;  
    };
    AudioTrack.prototype.onTimeUpdate = function (e) {
        if (this.isPlaying && this.audio.currentTime > 0) {
            this._progress = this.audio.currentTime;
            this._completed = this.audio.duration > 0 ? this.audio.currentTime / this.audio.duration : 0;
        }
    };
    AudioTrack.formatTime = function (value) {
        var s = Math.trunc(value % 60);
        var m = Math.trunc((value / 60) % 60);
        var h = Math.trunc(((value / 60) / 60) % 60);
        return h > 0 ? (h < 10 ? '0' + h : h) + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s) : (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
    };
    Object.defineProperty(AudioTrack.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (v) {
            this._id = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrack.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrack.prototype, "progress", {
        get: function () {
            return this._progress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrack.prototype, "completed", {
        get: function () {
            return this._completed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrack.prototype, "error", {
        get: function () {
            return this.audio.error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrack.prototype, "canPlay", {
        get: function () {
            var format = "audio/" + this.audio.src.substr(this.audio.src.lastIndexOf('.') + 1);
            return this.audio && this.audio.canPlayType(format) != '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrack.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrack.prototype, "hasLoaded", {
        get: function () {
            return this._hasLoaded;
        },
        enumerable: true,
        configurable: true
    });
    AudioTrack.prototype.play = function () {
        if (!this.audio) {
            this.createAudio();
        }
        if (!this._hasLoaded) {
            console.log("Loading track " + this.src);
            this._isLoading = true;
        }
        //var source = this.ctx.createMediaElementSource(this.audio);  
        //source.connect(this.ctx.destination);
        this.audio.play();
    };
    AudioTrack.prototype.pause = function () {
        if (!this.isPlaying)
            return;
        console.log("Pausing track " + this.src);
        this.audio.pause();
        this.isPlaying = false;
    };
    AudioTrack.prototype.stop = function () {
        var _this = this;
        if (!this.audio)
            return;
        this.pause();
        this.audio.removeEventListener("timeupdate", function (e) { _this.onTimeUpdate(e); });
        this.isFinished = true;
        this.destroy();
    };
    AudioTrack.prototype.seekTo = function (time) {
        this.audio.currentTime = time;
    };
    AudioTrack.prototype.destroy = function () {
        this.audio = undefined;
        console.log("Released track " + this.src);
    };
    AudioTrack = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Optional()),
        __param(2, core_1.Optional()), 
        __metadata('design:paramtypes', [String, String, AudioContext])
    ], AudioTrack);
    return AudioTrack;
}());
exports.AudioTrack = AudioTrack;
var AudioTrackComponent = (function () {
    function AudioTrackComponent(_audioProvider) {
        this._audioProvider = _audioProvider;
        this.onFinish = new core_1.EventEmitter();
        this._isFinished = false;
    }
    AudioTrackComponent.prototype.ngOnInit = function () {
        if (!(this.track instanceof AudioTrack)) {
            this._audioTrack = WebAudioProvider.createAudio(this.track); //new AudioTrack(this.track.src) 
        }
        else {
            Object.assign(this._audioTrack, this.track);
            this._audioProvider.add(this._audioTrack);
        }
        // update input track parameter with track is so we pass it to WebAudioProvider if needed
        this.track.id = this._audioTrack.id;
    };
    AudioTrackComponent.prototype.play = function () {
        this._audioTrack.play();
        this._audioProvider.current = this._audioTrack.id;
    };
    AudioTrackComponent.prototype.pause = function () {
        this._audioTrack.pause();
        this._audioProvider.current = undefined;
    };
    AudioTrackComponent.prototype.toggle = function () {
        if (this._audioTrack.isPlaying) {
            this.pause();
        }
        else {
            this.play();
        }
    };
    AudioTrackComponent.prototype.seekTo = function (time) {
        this._audioTrack.seekTo(time);
    };
    Object.defineProperty(AudioTrackComponent.prototype, "id", {
        get: function () {
            return this._audioTrack.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "art", {
        get: function () {
            return this.track.art;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "artist", {
        get: function () {
            return this.track.artist;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "title", {
        get: function () {
            return this.track.title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "progress", {
        get: function () {
            return this._audioTrack.progress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "isPlaying", {
        get: function () {
            return this._audioTrack.isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "duration", {
        get: function () {
            return this._audioTrack.duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "completed", {
        get: function () {
            return this._audioTrack.completed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "canPlay", {
        get: function () {
            return this._audioTrack.canPlay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "error", {
        get: function () {
            return this._audioTrack.error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "isLoading", {
        get: function () {
            return this._audioTrack.isLoading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackComponent.prototype, "hasLoaded", {
        get: function () {
            return this.hasLoaded;
        },
        enumerable: true,
        configurable: true
    });
    AudioTrackComponent.prototype.ngDoCheck = function () {
        if (!Object.is(this._audioTrack.isFinished, this._isFinished)) {
            // some logic here to react to the change
            this._isFinished = this._audioTrack.isFinished;
            // track has stopped, trigger finish event
            if (this._isFinished) {
                this.onFinish.emit(this.track);
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AudioTrackComponent.prototype, "track", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AudioTrackComponent.prototype, "onFinish", void 0);
    AudioTrackComponent = __decorate([
        core_1.Component({
            selector: 'audio-track',
            template: '<ng-content></ng-content>',
            providers: []
        }), 
        __metadata('design:paramtypes', [WebAudioProvider])
    ], AudioTrackComponent);
    return AudioTrackComponent;
}());
exports.AudioTrackComponent = AudioTrackComponent;
var AudioTrackPlayComponent = (function () {
    function AudioTrackPlayComponent(el) {
        this.el = el;
        this._isPlaying = false;
        this._isLoading = false;
    }
    Object.defineProperty(AudioTrackPlayComponent.prototype, "light", {
        set: function (val) {
            this.el.nativeElement.firstElementChild.classList.add('light');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackPlayComponent.prototype, "dark", {
        set: function (val) {
            this.el.nativeElement.firstElementChild.classList.add('dark');
        },
        enumerable: true,
        configurable: true
    });
    AudioTrackPlayComponent.prototype.toggle = function () {
        if (this.audioTrack.isPlaying) {
            this.audioTrack.pause();
        }
        else {
            this.audioTrack.play();
        }
    };
    AudioTrackPlayComponent.prototype.ngDoCheck = function () {
        if (!Object.is(this.audioTrack.isLoading, this._isLoading)) {
            // some logic here to react to the change
            this._isLoading = this.audioTrack.isLoading;
        }
        if (!Object.is(this.audioTrack.isPlaying, this._isPlaying)) {
            // some logic here to react to the change
            this._isPlaying = this.audioTrack.isPlaying;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AudioTrackPlayComponent.prototype, "audioTrack", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], AudioTrackPlayComponent.prototype, "light", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], AudioTrackPlayComponent.prototype, "dark", null);
    AudioTrackPlayComponent = __decorate([
        core_1.Component({
            selector: 'audio-track-play',
            template: "\n    <button clear (click)=\"toggle($event)\" [disabled]=\"audioTrack.error || _isLoading\">\n      <ion-icon name=\"pause\" *ngIf=\"_isPlaying && !_isLoading\"></ion-icon>\n      <ion-icon name=\"play\" *ngIf=\"!_isPlaying && !_isLoading\"></ion-icon>\n      <ng-content *ngIf=\"_isLoading\"></ng-content>\n    </button>\n    ",
            directives: [ionic_angular_1.Icon]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AudioTrackPlayComponent);
    return AudioTrackPlayComponent;
}());
exports.AudioTrackPlayComponent = AudioTrackPlayComponent;
var AudioTimePipe = (function () {
    function AudioTimePipe() {
    }
    AudioTimePipe.prototype.transform = function (value) {
        if (!value)
            return '';
        var s = Math.trunc(value % 60);
        var m = Math.trunc((value / 60) % 60);
        var h = Math.trunc(((value / 60) / 60) % 60);
        return h > 0 ? (h < 10 ? '0' + h : h) + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s) : (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
    };
    AudioTimePipe = __decorate([
        core_1.Pipe({ name: 'audioTime' }), 
        __metadata('design:paramtypes', [])
    ], AudioTimePipe);
    return AudioTimePipe;
}());
exports.AudioTimePipe = AudioTimePipe;
var AudioTrackProgressComponent = (function () {
    function AudioTrackProgressComponent() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AudioTrackProgressComponent.prototype, "audioTrack", void 0);
    AudioTrackProgressComponent = __decorate([
        core_1.Component({
            selector: 'audio-track-progress',
            template: '<em *ngIf="audioTrack.completed > 0">{{audioTrack.progress | audioTime}} / </em><em>{{audioTrack.duration | audioTime}}</em>',
            pipes: [AudioTimePipe]
        }), 
        __metadata('design:paramtypes', [])
    ], AudioTrackProgressComponent);
    return AudioTrackProgressComponent;
}());
exports.AudioTrackProgressComponent = AudioTrackProgressComponent;
var AudioTrackProgressSliderComponent = (function (_super) {
    __extends(AudioTrackProgressSliderComponent, _super);
    function AudioTrackProgressSliderComponent(el) {
        _super.call(this, el.nativeElement);
        this.el = el;
        this.onSeek = new core_1.EventEmitter();
        this._completed = 0;
    }
    AudioTrackProgressSliderComponent.prototype.ngOnInit = function () {
        _super.prototype.listen.call(this);
    };
    AudioTrackProgressSliderComponent.prototype.ngDoCheck = function () {
        if (this.audioTrack.completed > 0 && !Object.is(this.audioTrack.completed, this._completed)) {
        }
    };
    AudioTrackProgressSliderComponent.prototype.onDrag = function (ev) {
        // console.log(ev)
        return _super.prototype.onDrag.call(this, ev);
    };
    ;
    AudioTrackProgressSliderComponent.prototype.onDragStart = function (ev) {
        // console.log(ev);
        return _super.prototype.onDragStart.call(this, ev);
    };
    ;
    AudioTrackProgressSliderComponent.prototype.onDragEnd = function (ev) {
        this.onSeek.emit(ev);
        return _super.prototype.onDragEnd.call(this, ev);
    };
    ;
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AudioTrackProgressSliderComponent.prototype, "audioTrack", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AudioTrackProgressSliderComponent.prototype, "onSeek", void 0);
    AudioTrackProgressSliderComponent = __decorate([
        core_1.Component({
            selector: 'audio-track-progress-slider',
            template: "",
            directives: [common_1.NgStyle]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AudioTrackProgressSliderComponent);
    return AudioTrackProgressSliderComponent;
}(drag_gesture_1.DragGesture));
exports.AudioTrackProgressSliderComponent = AudioTrackProgressSliderComponent;
var AudioTrackProgressBarComponent = (function () {
    function AudioTrackProgressBarComponent(el) {
        this.el = el;
        this._completed = 0;
        this._range = 0;
    }
    Object.defineProperty(AudioTrackProgressBarComponent.prototype, "progress", {
        set: function (v) {
            this._showProgress = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackProgressBarComponent.prototype, "duration", {
        set: function (v) {
            this._showDuration = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackProgressBarComponent.prototype, "light", {
        set: function (val) {
            this.el.nativeElement.querySelector("input").classList.add('light');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioTrackProgressBarComponent.prototype, "dark", {
        set: function (val) {
            this.el.nativeElement.querySelector("input").classList.add('dark');
        },
        enumerable: true,
        configurable: true
    });
    AudioTrackProgressBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.el.nativeElement.querySelector("input").addEventListener("input", function (e) {
            _this.seekTo();
        }, false);
    };
    AudioTrackProgressBarComponent.prototype.ngDoCheck = function () {
        if (this.audioTrack.completed > 0 && !Object.is(this.audioTrack.completed, this._completed)) {
            this._completed = this.audioTrack.completed;
            this._range = Math.round(this._completed * 100 * 100) / 100;
        }
    };
    AudioTrackProgressBarComponent.prototype.seekTo = function () {
        var seekTo = Math.round(this.audioTrack.duration * this._range) / 100;
        this.audioTrack.seekTo(seekTo);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AudioTrackProgressBarComponent.prototype, "audioTrack", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], AudioTrackProgressBarComponent.prototype, "progress", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], AudioTrackProgressBarComponent.prototype, "duration", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], AudioTrackProgressBarComponent.prototype, "light", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], AudioTrackProgressBarComponent.prototype, "dark", null);
    AudioTrackProgressBarComponent = __decorate([
        core_1.Component({
            selector: 'audio-track-progress-bar',
            template: "<time *ngIf=\"_showProgress\">{{audioTrack.progress | audioTime}}</time>\n    <input type=\"range\" min=\"0\" max=\"100\" step=\"1\" [(ngModel)]=\"_range\" [ngStyle]=\"{'visibility': _completed > 0 ? 'visible' : 'hidden'}\">\n    <time *ngIf=\"_showDuration\">{{audioTrack.duration | audioTime}}</time>\n    ",
            pipes: [AudioTimePipe],
            directives: [common_1.NgStyle, AudioTrackProgressSliderComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AudioTrackProgressBarComponent);
    return AudioTrackProgressBarComponent;
}());
exports.AudioTrackProgressBarComponent = AudioTrackProgressBarComponent;
