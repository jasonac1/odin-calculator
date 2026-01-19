let number1 = 0;
let operator = ""; 
let number2 = 0; 

const display = document.querySelector(".box-display p");
const buttonContainer = document.querySelector(".container-buttons");

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, operator, b) {
    let result = 0;

    switch (operator) {
        case "+":
            result = add(a, b);
            break;
    
        case "-":
            result = subtract(a, b);
            break;
    
        case "*":
            result = multiply(a, b);
            break;
    
        case "/":
            result = divide(a, b);
            break;
    }

    return result;
}

function updateNumber(e) {
	let newDigit = +(e.target.textContent); 
	if (number1 == null) number1 = newDigit; // starting point      
	else {
        number1 *= 10 
        number1 += newDigit; // display / number already has one digit or more
    }
} 

function updateDisplay(e)  {
    display.textContent = number1;
}

buttonContainer.addEventListener("click", (e) => {
    updateNumber(e);
    updateDisplay(e);
})
	