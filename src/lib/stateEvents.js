/**
 *
 *
 * @export
 * @class StateEvents
 */
export class StateEvents {
    _enter;
    _leave;

    /**
     * Creates an instance of StateEvents.
     * @param {function} [enter=() => { }]
     * @param {function} [leave=() => { }]
     * @memberof StateEvents
     */
    constructor(enter = () => { }, leave = () => { }) {
        this._enter = enter;
        this._leave = leave;
    }
    get enter() {
        return this._enter;
    }
    get leave() {
        return this._leave;
    }
}