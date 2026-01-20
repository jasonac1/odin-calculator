let number1 = 0;
let operator = ""; 
let number2 = null; 
let result = null;

const display = document.querySelector(".box-display p");
const defaultDisplayFontSize = "3rem";
const buttonContainer = document.querySelector(".container-buttons");
const clearButton = document.querySelector(".clear");

const MAX_DISPLAY_LENGTH = 15; // characters

const DIVSION_BY_ZERO_FLAG = "/0;"

const ERROR_TIMEOUT = 1000; // ms  

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
            result = b === 0 ? DIVSION_BY_ZERO_FLAG : divide(a, b);
            break;
    }

    return result;
}

function getNewNumber(text, num) {
	let newDigit = +text; 
	return num * 10 + newDigit;    
} 

function updateDisplay(num) {
    display.textContent = num;
}

function isOperatorOrEqualsButton(button) {
    return  button.classList.contains("add") ||
            button.classList.contains("subtract") ||
            button.classList.contains("multiply") ||
            button.classList.contains("divide") ||
            button.classList.contains("equals");
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
    
        case "=":
            return "";

        default:
            break;
    }
}

function round(num, maxPlaces) {
    return +(num.toFixed(maxPlaces)); // no parseFloat because num is Number, not String
}

function getIntegerLength(num) {
    const numAsString = String(num);
    const integerPartOfString = numAsString.split(".")[0]; 
    const integerLength = integerPartOfString
    .split("")
    .reduce((total, char) => {
        return "0123456789".includes(char) ? total + 1 : total; // ignores minus sign
    }, 0);

    return integerLength;
}

function handleCalc(e) {
    let buttonPressed = e.target;

    if(operator === "") { // pre op (number1 inputted)

        if(isDigitButton(buttonPressed)) {

            if(getIntegerLength(number1) >= MAX_DISPLAY_LENGTH) return; // prevent overflow

            if(result !== null) {
                result = null; 
                number1 = 0;
            } // display reset after finishing a calculation with =

            number1 = getNewNumber(buttonPressed.textContent, number1);
            updateDisplay(number1);
            
        }
        
        else if(isOperatorOrEqualsButton(buttonPressed)) {
            // so calculation doesnt make it to the reset display block above
            if(result !== null) result = null; 
            
            operator = convertToOperator(buttonPressed.textContent);
            
        }

    }

    else { // post op (number2 inputted)
        
        if(isDigitButton(buttonPressed)) {

            if(getIntegerLength(number2) >= MAX_DISPLAY_LENGTH) return; // prevent overflow

            if (number2 === null) number2 = 0; 
            number2 = getNewNumber(buttonPressed.textContent, number2);
            updateDisplay(number2); 

        }

        else if(isOperatorOrEqualsButton(buttonPressed)) {
            // so calculation doesnt make it to the reset display block above
            if(result !== null) result = null; 

            if(number2 === null) operator = convertToOperator(buttonPressed.textContent);
            else {
                result = operate(number1, operator, number2);

                if(result === DIVSION_BY_ZERO_FLAG) { // handle division by zero

                    disableCalculator();
                    
                    display.style.fontSize = "2.5rem";
                    displayDivisionByZeroError();

                    setTimeout(() => {
                        clearCalculatorState();
                        display.style.fontSize = defaultDisplayFontSize;
                        enableCalculator();
                    }, ERROR_TIMEOUT);
                    

                    return;

                } 

                if(String(result).length > MAX_DISPLAY_LENGTH) { // prevent overflow
                    // -1 accounts for decimal point .
                    result = round(result, MAX_DISPLAY_LENGTH - getIntegerLength(result) - 1)
                }

                number1 = result;
                number2 = null;
                operator = convertToOperator(buttonPressed.textContent);

                updateDisplay(result);
            }

        }

    }
}

function displayDivisionByZeroError() {
    updateDisplay("Oops! Can't do that :(");   
}

function resetDisplay() {
    updateDisplay(0);
}

function clearData() {
    number1 = 0;
    operator = ""; 
    number2 = null; 
    result = null;
}

function clearCalculatorState() {
    clearData();
    resetDisplay(); 
}

function handleClearCalculatorState(e) {
    let buttonPressed = e.target;
    if(buttonPressed.classList.contains("clear")) clearCalculatorState();
}

function enableCalculator() {
    buttonContainer.addEventListener("click", handleCalc);
    buttonContainer.addEventListener("click", handleClearCalculatorState);
}

function disableCalculator() {
    buttonContainer.removeEventListener("click", handleCalc);
    buttonContainer.removeEventListener("click", handleClearCalculatorState);
}

enableCalculator();