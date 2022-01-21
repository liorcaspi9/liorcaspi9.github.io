import { State } from './state';

/**
 *
 *
 * @export
 * @class Transition
 */
export class Transition {
    _targetDecider;

    /**
     * Creates an instance of Transition.
     * @param {function(State,*):State} targetDecider
     * @memberof Transition
     */
    constructor(targetDecider) {
        this._targetDecider = targetDecider;
    }

    /**
     *
     *
     * @readonly
     * @memberof Transition
     */
    get targetDecider() {
        return this._targetDecider;
    }
}