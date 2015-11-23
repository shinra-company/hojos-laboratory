'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Input;
inherits(Input, EventEmitter);

function Input() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseLeft = false;
    this.mouseRight = false;
    this.mouseOut = false;
    this.keys = {};
    document.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('keyup', this.keyup.bind(this));
}

Input.prototype.bindCanvas = function(canvas) {
    this.canvas = canvas.canvas.canvas; // Canvas element
    this.mouseScale = canvas.scale;
    this.canvas.addEventListener('mousemove', this.mousemove.bind(this));
    this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseup.bind(this));
    document.addEventListener('mouseout', this.mouseout.bind(this));
    document.addEventListener('mouseover', this.mouseover.bind(this));
    var wheelSupport = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    this.canvas.addEventListener(wheelSupport, this.mousewheel.bind(this))
};

Input.prototype.mousemove = function(e) {
    if(this.mouseOut) return;
    var button = buttons[e.button-1];
    this.mouseX = Math.floor(e.pageX / this.mouseScale);
    this.mouseY = Math.floor(e.pageY / this.mouseScale);
    this.emit('mousemove', { x: this.mouseX, y: this.mouseY, button: button });
};

var buttons = ['left','middle','right'];

Input.prototype.mousedown = function(e) {
    var button = buttons[e.button-1];
    switch(button) {
        case 'left': self.mouseLeft = true; break;
        case 'right': self.mouseRight = true; break;
    }
    this.emit('mousedown', { button: button, x: this.mouseX, y: this.mouseY });
};

Input.prototype.mouseup = function(e) {
    var button = buttons[e.button-1];
    switch(button) {
        case 'left': this.mouseLeft = false; break;
        case 'right': this.mouseRight = false; break;
    }
    this.emit('mouseup', { button: button, x: this.mouseX, y: this.mouseY });
};

Input.prototype.mouseout = function(e) {
    var button = buttons[e.button-1];
    this.mouseOut = true;
    this.mouseX = Math.floor(e.pageX / this.mouseScale);
    this.mouseY = Math.floor(e.pageY / this.mouseScale);
    this.emit('mouseout', { x: this.mouseX, y: this.mouseY, button: button });
};

Input.prototype.mouseover = function(e) {
    var button = buttons[e.button-1];
    this.mouseOut = false;
    this.mouseX = Math.floor(e.pageX / this.mouseScale);
    this.mouseY = Math.floor(e.pageY / this.mouseScale);
    this.emit('mouseover', { x: this.mouseX, y: this.mouseY, button: button });
};

Input.prototype.mousewheel = function(e) {
    if(!e.deltaY) return;
    var direction = e.deltaY > 0 ? 'down' : 'up';
    this.emit('mousewheel', { direction: direction, x: this.mouseX, y: this.mouseY });
};

// TODO: Replace use of deprecated 'which' property
Input.prototype.keydown = function(e) {
    var key = e.which >= 48 && e.which <= 90 ? 
        String.fromCharCode(parseInt(e.which)).toLowerCase() : keyCodes[e.which];
    if(this.keys[key]) return; // Ignore if key already held
    this.keys[key] = true;
    this.emit('keydown', { key: key });
};

Input.prototype.keyup = function(e) {
    var key = e.which >= 48 && e.which <= 90 ?
        String.fromCharCode(parseInt(e.which)).toLowerCase() : keyCodes[e.which];
    if(!this.keys[key]) return; // Ignore if key already up
    this.keys[key] = false;
    this.emit('keyup', { key: key });
};

var keyCodes = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    45: "insert",
    46: "delete",
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "capslock",
    27: "escape",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    144: "numlock",
    145: "scrolllock",
    186: "semicolon",
    187: "equal",
    188: "comma",
    189: "dash",
    190: "period",
    191: "slash",
    192: "graveaccent",
    219: "openbracket",
    220: "backslash",
    221: "closebraket",
    222: "singlequote"
};