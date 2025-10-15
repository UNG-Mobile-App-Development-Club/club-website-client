//Styling for button
const buttonStyle = {
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    backgroundColor: 'blue'
}

//buttton component
function Button() {
    return <button style={buttonStyle}>Click me</button>;
}

export default Button;