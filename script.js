let display = document.getElementById('display');
let history = document.getElementById('history');
let calculator = document.querySelector('.calculator');
let historyVisible = false;
let isScientific = false;
let isDeg = true;
let isSecond = false;

function appendToDisplay(value) {
  if (display.textContent === '0' && value !== '.') {
    display.textContent = value;
  } else {
    display.textContent += value;
  }
}

function clearDisplay() {
  display.textContent = '0';
}

function backspace() {
  display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

function calculate() {
  try {
    let expression = display.textContent
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/1\/x/g, `1/(${display.textContent})`);

    if (expression.includes('factorial(')) {
      let num = parseInt(expression.match(/factorial\((\d+)\)/)[1]);
      expression = expression.replace(/factorial\((\d+)\)/, factorial(num));
    }

    if (expression.includes('Math.sin(') || expression.includes('Math.cos(') || expression.includes('Math.tan(')) {
      if (isDeg) {
        expression = expression
          .replace(/Math.sin\(([^)]+)\)/g, 'Math.sin($1 * Math.PI / 180)')
          .replace(/Math.cos\(([^)]+)\)/g, 'Math.cos($1 * Math.PI / 180)')
          .replace(/Math.tan\(([^)]+)\)/g, 'Math.tan($1 * Math.PI / 180)');
      }
    }

    let result = eval(expression);
    result = Math.round(result * 100000000) / 100000000;
    display.textContent = isNaN(result) || !isFinite(result) ? 'Error' : result;
    if (display.textContent !== 'Error') {
      addToHistory(`${expression} = ${result}`);
    } else {
      setTimeout(clearDisplay, 1000);
    }
  } catch (error) {
    display.textContent = 'Error';
    setTimeout(clearDisplay, 1000);
  }
}

function addToHistory(entry) {
  let p = document.createElement('p');
  p.textContent = entry;
  history.prepend(p);
}

function toggleMode() {
  isScientific = !isScientific;
  calculator.classList.toggle('scientific-mode');
  document.querySelector('.mode-toggle').textContent = isScientific ? 'Scientific' : 'Basic';
  if (isScientific) {
    document.querySelector('.buttons').innerHTML = `
      <button onclick="appendToDisplay('factorial(')">x!</button>
      <button onclick="appendToDisplay('7')">7</button>
      <button onclick="appendToDisplay('8')">8</button>
      <button onclick="appendToDisplay('9')">9</button>
      <button class="operator" onclick="appendToDisplay('*')">×</button>
      <button onclick="appendToDisplay('1/x')">1/x</button>
      <button onclick="appendToDisplay('4')">4</button>
      <button onclick="appendToDisplay('5')">5</button>
      <button onclick="appendToDisplay('6')">6</button>
      <button class="operator" onclick="appendToDisplay('-')">−</button>
      <button onclick="appendToDisplay('Math.PI')">π</button>
      <button onclick="appendToDisplay('1')">1</button>
      <button onclick="appendToDisplay('2')">2</button>
      <button onclick="appendToDisplay('3')">3</button>
      <button class="operator" onclick="appendToDisplay('+')">+</button>
      <button onclick="appendToDisplay('Math.E')">e</button>
      <button onclick="appendToDisplay('0')">0</button>
      <button onclick="appendToDisplay('0')">0</button>
      <button onclick="appendToDisplay('.')">.</button>
      <button class="equals" onclick="calculate()">=</button>
      <button onclick="toggleHistory()">History</button>
    `;
  } else {
    document.querySelector('.buttons').innerHTML = `
      <button onclick="appendToDisplay('7')">7</button>
      <button onclick="appendToDisplay('8')">8</button>
      <button onclick="appendToDisplay('9')">9</button>
      <button class="operator" onclick="appendToDisplay('*')">×</button>
      <button onclick="appendToDisplay('4')">4</button>
      <button onclick="appendToDisplay('5')">5</button>
      <button onclick="appendToDisplay('6')">6</button>
      <button class="operator" onclick="appendToDisplay('-')">−</button>
      <button onclick="appendToDisplay('1')">1</button>
      <button onclick="appendToDisplay('2')">2</button>
      <button onclick="appendToDisplay('3')">3</button>
      <button class="operator" onclick="appendToDisplay('+')">+</button>
      <button onclick="appendToDisplay('0')">0</button>
      <button onclick="appendToDisplay('0')">0</button>
      <button onclick="appendToDisplay('.')">.</button>
      <button class="equals" onclick="calculate()">=</button>
      <button onclick="toggleHistory()">History</button>
    `;
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  document.querySelector('.theme-toggle').textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
}

function toggleHistory() {
  historyVisible = !historyVisible;
  history.classList.toggle('show');
}

function toggleSecond() {
  isSecond = !isSecond;
  document.querySelector('button[onclick="toggleSecond()"]').textContent = isSecond ? '1st' : '2nd';
}

function toggleDegRad() {
  isDeg = !isDeg;
  document.querySelector('button[onclick="toggleDegRad()"]').textContent = isDeg ? 'deg' : 'rad';
}

// Keyboard support
document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/') {
    appendToDisplay(key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Escape') {
    clearDisplay();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === '(' || key === ')') {
    appendToDisplay(key);
  }
});