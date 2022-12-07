const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
}

const formula = {}
const updateDisplay = () => {
  const display = document.querySelector('.calculator-screen');
  display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  // Access the clicked element
  const { target } = event;
  const { value } = target;
  
  if (!target.matches('button')) {
    return;
  }

  switch (value) {
    case '+':
    case '-':
    case '*':
    case '/':
      handleOperator(value);
      break;
    case '=':
      handleOperator(value, true);
      break;
    case '.':
      inputDecimal(value);
      break;
    case 'all-clear':
      resetCalculator();
      break;
    default:
      // check if the key is an integer
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
  }

  updateDisplay();
});

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
  
  console.log(calculator);
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = '0.'
    calculator.waitingForSecondOperand = false;
    return
  }
  
  // If the `displayValue` property does not contain a decimal point
  if (!calculator.displayValue.includes(dot)) {
    // Append the decimal point
    calculator.displayValue += dot;
  }
  
}

function handleOperator(nextOperator, final = false) {
  console.log({final});
  // Destructure the properties on the calculator object
  const { firstOperand, displayValue, operator } = calculator
  console.log(firstOperand, displayValue, operator);
  // `parseFloat` converts the string contents of `displayValue`
  // to a floating-point number
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    console.log(calculator);
    return;
  }

  // verify that `firstOperand` is null and that the `inputValue`
  // is not a `NaN` value
  if (firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  }


  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;

  if (final) {
    console.log(`${firstOperand}${operator}${inputValue}`);
    console.log(`${calculator.displayValue}`);
    insertRecord({
      question: `${firstOperand}${operator}${inputValue}`,
      answer: calculator.displayValue
    }).then(response => {
      if (response.statusText == 'OK') {
        loadRecords()
      }
    })
  }
}

function calculate(firstOperand, secondOperand, operator) {
  if (operator === '+') {
    return firstOperand + secondOperand;
  } else if (operator === '-') {
    return firstOperand - secondOperand;
  } else if (operator === '*') {
    return firstOperand * secondOperand;
  } else if (operator === '/') {
    return firstOperand / secondOperand;
  }


  return secondOperand;
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  console.log(calculator);
}

async function getRecords () {
  const response = await fetch('http://localhost:3000/api/posts');

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

  return await response.json();
}


async function insertRecord( record = {} ) {
  const response = await fetch('http://localhost:3000/api/post', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record)
  }).catch(error => {
    window.alert(error);
    return;
  })
  return response;
} 

function loadRecords () {
  const list = document.getElementById('results');
  list.innertHtml = '';
  getRecords()
    .then((response) => {

      response.map((item) => {
        let li = document.createElement('li');
        li.innerHTML = `${item.question} = ${item.answer}`;
        list.appendChild(li);
      })
    })
}

loadRecords();
