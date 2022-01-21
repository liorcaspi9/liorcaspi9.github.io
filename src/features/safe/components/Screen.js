import './Screen.scss';

export default function Screen({ numberOfDigits = 4, digits = '' }) {
    const digitScreens = [];

    for (let index = 0; index < numberOfDigits; index++) {
        const element = digits[index];
        digitScreens.push(
            <div className="digit-wrapper" key={index}>
                <span className="digit">{element || "-"}</span>
                <span className="placeholder">8</span>
            </div>
        );
    }
    return <div className="screen-wrapper">{digitScreens}</div>;
}
