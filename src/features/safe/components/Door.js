import './Door.scss';

function Door({ closed = true }) {
    return (
        <div className={`door-Wrapper  ${!closed ? "open" : ""}`}>
            <div className="face front">
                <div className="door-handle">
                </div>
            </div>
            <div className="face back">
            </div>
            <div className="face right">
                <div className="lock-bar"></div>
                <div className="lock-bar"></div>
            </div>
        </div>
    );
}

export default Door;
