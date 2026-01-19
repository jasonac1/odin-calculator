let number1 = 0;
let operator = ""; 
let number2 = null; 
let result = null;

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

function getNewNumber(text) {
	let newDigit = +text; 
	return number1 * 10 + newDigit;    
} 

function updateDisplay(num)  {
    display.textContent = num;
}

function isOperatorButton(button) {
    return  button.classList.contains("add") ||
            button.classList.contains("subtract") ||
            button.classList.contains("multiply") ||
            button.classList.contains("divide");
}

function isDigitButton(button) {
    return "0123456789".includes(button.textContent);
}

function convertToOperator(symbol) {
    switch(symbol) {
        case "+":
        case "-":
        case "/":
            return symbol;
            break;
        
        case "×":
            return "*";
            break;
    
        default:
            break;
    }
}

function handleCalc(e) {
    let buttonPressed = e.target;

    if(operator === "") {

        if(isDigitButton(buttonPressed)) {

            if(result !== null) {
                result = null;
                number1 = 0;
            } // display reset after finishing a calculation with =

            number1 = getNewNumber(buttonPressed.textContent);
            updateDisplay(number1);
            
        } else {
            
        }
    }

    else {
        
    }
}

buttonContainer.addEventListener("click", handleCalc);