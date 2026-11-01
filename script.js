let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

function updateDisplay() {
  display.textContent = displayValue;
}

function formatResult(value) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = Number(value.toFixed(10));
  return String(rounded);
}

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    displayValue = digit;
    waitingForSecondOperand = false;
  } else {
    displayValue = displayValue === '0' ? digit : displayValue + digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    displayValue = '0.';
    waitingForSecondOperand = false;
  } else if (!displayValue.includes('.')) {
    displayValue += '.';
  }

  updateDisplay();
}

function calculate(a, b, selectedOperator) {
  switch (selectedOperator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? 'Error' : a / b;
    default:
      return b;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(displayValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    displayValue = formatResult(result);
    firstOperand = Number(displayValue);
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
  updateDisplay();
}

function handleEquals() {
  if (operator === null || waitingForSecondOperand) {
    return;
  }

  const inputValue = Number(displayValue);
  const result = calculate(firstOperand, inputValue, operator);
  displayValue = formatResult(result);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function clearDisplay() {
  displayValue = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function deleteLastDigit() {
  if (waitingForSecondOperand) {
    return;
  }

  displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { action, value } = button.dataset;

    if (button.classList.contains('number')) {
      inputDigit(value);
      return;
    }

    if (button.classList.contains('decimal')) {
      inputDecimal();
      return;
    }

    if (button.classList.contains('operator')) {
      handleOperator(value);
      return;
    }

    if (action === 'clear') {
      clearDisplay();
      return;
    }

    if (action === 'delete') {
      deleteLastDigit();
      return;
    }

    if (action === 'equals') {
      handleEquals();
    }
  });
});

updateDisplay();
