import './Keypad.scss';

export default function Keypad({
    onButtonClick = (value) => { },
    buttonValues = [],
    audio = null, disabled = false }) {

    const buttonClicked = (e) => {
        audio?.play();
        onButtonClick(e.target.innerText);
    };

    const buttons = buttonValues.map((value) => {
        return (
            <button disabled={disabled} key={value} onClick={buttonClicked}>
                {value}
            </button>
        );
    });

    return <div className="keypad-wrapper">{buttons}</div>;
}
