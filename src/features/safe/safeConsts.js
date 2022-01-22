export const BACKSPACE_CHARACTER = "C";
export const OPEN_CHARACTER = "#";
export const BUTTON_VALUES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", OPEN_CHARACTER, 0, BACKSPACE_CHARACTER];
export const BUTTONS_SOUND_PATH = "sounds/beep-07a.wav";
export const ERROR_SOUND_PATH = "sounds/beep-03.mp3";
export const UNLOCK_SOUND_PATH = "sounds/rotary-phone-2-nr0.mp3";
export const OPEN_SOUND_PATH = "sounds/open.mp3";
export const ERROR_TEXT = 'err1';
export const SOUNDS = {
    ERROR_SOUND: new Audio(ERROR_SOUND_PATH),
    UNLOCK_SOUND: new Audio(UNLOCK_SOUND_PATH),
    OPEN_SOUND: new Audio(OPEN_SOUND_PATH),
    BUTTONS_SOUND: new Audio(BUTTONS_SOUND_PATH)
}