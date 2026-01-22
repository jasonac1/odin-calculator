let number1 = 0;
let operator = ""; 
let number2 = null;
let result = null;

let stringNumber1 = "0"; // string representations of numbers 1 and 2
let stringNumber2 = null;
 
let decimalFlag = false;
let displayIsWellFormedDecimal = false; // e.g. "2."

const display = document.querySelector(".box-display p");
const defaultDisplayFontSize = "3rem";
const buttonContainer = document.querySelector(".container-buttons");
const clearButton = document.querySelector(".clear");

const MAX_DISPLAY_LENGTH = 15; // characters

const DIVSION_BY_ZERO_FLAG = "/0;"

const ERROR_TIMEOUT = 1000; // ms

const keyClassMap = {
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    "=": "equals",
    "enter": "equals",
    "c": "clear",
    "q": "sign",
    "backspace": "delete",
    ".": "decimal",
}  

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

function getNewNumber(text, num, strNum, localDecimalFlag, localDisplayIsWellFormedDecimal) {
    let numberRep = 0;
    let stringRep = "";  

	let newDigit = +text;
    if(localDecimalFlag === false) { // integer
        stringRep = num !== 0 ? strNum + String(newDigit) : String(newDigit);   
    }

	else { // decimal
        if(localDisplayIsWellFormedDecimal === false) displayIsWellFormedDecimal = true; // (e.g 2.)
        stringRep = strNum + String(newDigit);
    } 

    numberRep = Number(stringRep);
        
    return [numberRep, stringRep];
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
        case "*":
            return symbol;
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

function IsWellFormedDecimal(string) {
    return string.split(".")[1] !== ""; // if decimal part is not empty
}

function flipSignInString(string) {
    return !string.includes("-") ?
    "-" + string : string.replace("-", "");
}

function strPop(string) {
    return string.slice(0, string.length - 1);   
}

function handleCalc(e) {
    let buttonPressed = e.target;

    if(operator === "") { // pre op (number1 inputted)

        if(isDigitButton(buttonPressed)) {

            if(stringNumber1.length >= MAX_DISPLAY_LENGTH) return; // prevent overflow

            if(result !== null) {
                result = null; 
                number1 = 0;
            } // display reset after finishing a calculation with =

            [number1, stringNumber1] = getNewNumber(buttonPressed.textContent, number1, stringNumber1, 
            decimalFlag, displayIsWellFormedDecimal);
            updateDisplay(stringNumber1);
            
        }
        
        else if(isOperatorOrEqualsButton(buttonPressed)) {

            if(decimalFlag && !displayIsWellFormedDecimal) return;

            resetDecimalFlags();

            // so calculation doesnt make it to the reset display block above
            if(result !== null) result = null; 
            
            operator = convertToOperator(buttonPressed.textContent);
            
        }

        else if(buttonPressed.classList.contains("sign")) {
            
            if(number1 !== 0) {
                number1 = -number1;
                stringNumber1 = flipSignInString(stringNumber1);
                updateDisplay(stringNumber1);
            }
            
        }

        else if(buttonPressed.classList.contains("decimal")) {

            // can't do 14 int + 1 decimal
            // (because the decimal point makes it 16 length, greater than max)
            if(display.textContent.length >= MAX_DISPLAY_LENGTH - 1) return;

	        if(decimalFlag === false) {
                decimalFlag = true;
                displayIsWellFormedDecimal = false;
                stringNumber1 += ".";
                updateDisplay(stringNumber1);
            }

        }

        else if(buttonPressed.classList.contains("delete")) {

        [number1, stringNumber1] = backspace(number1, stringNumber1);
        updateDisplay(stringNumber1);   

        }

    }

    else { // post op (number2 inputted)
        
        if(isDigitButton(buttonPressed)) {
            
            if (number2 === null) {
                number2 = 0;
                resetDecimalFlags();
                stringNumber2 = "0"; // define first so can read length  
            }
            
            if(stringNumber2.length >= MAX_DISPLAY_LENGTH) return; // prevent overflow

            [number2, stringNumber2] = getNewNumber(buttonPressed.textContent, number2, stringNumber2,
            decimalFlag, displayIsWellFormedDecimal);
            updateDisplay(stringNumber2); 

        }

        else if(isOperatorOrEqualsButton(buttonPressed)) {

            if(decimalFlag && !displayIsWellFormedDecimal) return;

            resetDecimalFlags();

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
                    let decimalPointMarker = decimalFlag ? 1 : 0

                    result = round(result, MAX_DISPLAY_LENGTH - getIntegerLength(result) - decimalPointMarker)
                }

                number1 = result;
                stringNumber1 = String(number1);
                number2 = null;
                stringNumber2 = null;
                operator = convertToOperator(buttonPressed.textContent);

                // checks if decimal every time you get result
                if(!Number.isInteger(result)) {
                    decimalFlag = true;
                    displayIsWellFormedDecimal = true;   
                }

                updateDisplay(result);
            }

        }

        else if(buttonPressed.classList.contains("sign")) {
            
            if(number2 !== 0 && number2 !== null) {
                number2 = -number2;
                stringNumber2 = flipSignInString(stringNumber2);
                updateDisplay(stringNumber2);
            }
            
        }

        else if(buttonPressed.classList.contains("decimal")) {

            if(number2 === null) return; // prevent pressing . without integer part

            // can't do 14 int + 1 decimal
            // (because the decimal point makes it 16 length, greater than max)
            if(display.textContent.length >= MAX_DISPLAY_LENGTH - 1) return;

	        if(decimalFlag === false) {
                decimalFlag = true;
                displayIsWellFormedDecimal = false;
                stringNumber2 += ".";
                updateDisplay(stringNumber2);
            }

        }

        else if(buttonPressed.classList.contains("delete")) {

            if(number2 === null) return; // prevent pressing backspace before entering number2 

            [number2, stringNumber2] = backspace(number2, stringNumber2);
            updateDisplay(stringNumber2);   

        }

    }
}

function displayDivisionByZeroError() {
    updateDisplay("Oops! Can't do that :(");   
}

function resetDisplay() {
    updateDisplay(0);
}

function resetDecimalFlags() {
    displayIsWellFormedDecimal = false;
    decimalFlag = false;
}

function clearData() {
    number1 = 0;
    operator = ""; 
    number2 = null; 
    result = null;
    stringNumber1 = "0"; 
    stringNumber2 = null;
    resetDecimalFlags();
}

function clearCalculatorState() {
    clearData();
    resetDisplay(); 
}

function handleClearCalculatorState(e) {
    let buttonPressed = e.target;
    if(buttonPressed.classList.contains("clear")) clearCalculatorState();
}

function backspace(num, strNum) {
    let numberRep = 0;
    let stringRep = "0";
    const decimalPartOfString = strNum.split(".")[1];

    if(strNum === "0");

    // e.g. "3"
    else if(decimalFlag === false && strNum.length === 1) {
        stringRep = "0";
        numberRep = Number(stringRep);
    }

    // e.g. "314"
    else if(decimalFlag === false && strNum.length > 1) {
        stringRep = strPop(strNum);
        numberRep = Number(stringRep);
    }

    // e.g. "3."
    else if(decimalFlag === true && displayIsWellFormedDecimal === false) {
        stringRep = strPop(strNum);
        numberRep = Number(stringRep);
        decimalFlag = false;
    }

    // e.g. "3.1"
    else if(decimalFlag === true
        && displayIsWellFormedDecimal === true
        && decimalPartOfString.length === 1) {
        stringRep = strPop(strNum);
        numberRep = Number(stringRep);
        displayIsWellFormedDecimal = false;
    }

    // e.g. "3.14"
    else if(decimalFlag === true
        && displayIsWellFormedDecimal === true
        && decimalPartOfString.length > 1) {
        stringRep = strPop(strNum);
        numberRep = Number(stringRep);
    }

    return [numberRep, stringRep];
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

document.addEventListener("keydown", (e) => {
    const buttonToBePressed = document.querySelector(`.${keyClassMap[e.key.toLowerCase()]}`);
    if(buttonToBePressed !== null) {
        const click = new Event("click", {bubbles: true});
        buttonToBePressed.dispatchEvent(click, (e) => {
            handleCalc(e);
            handleClearCalculatorState(e);
        });
    }
});