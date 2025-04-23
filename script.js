// 获取页面元素
const costRMBInput = document.getElementById('costRMB');
const profitMarginInput = document.getElementById('profitMargin');
const profitDisplay = document.getElementById('profit');
const sellingPriceRMBDisplay = document.getElementById('sellingPriceRMB');
const sellingPriceUSDDisplay = document.getElementById('sellingPriceUSD');

const costRMBForMarginInput = document.getElementById('costRMBForMargin');
const sellingPriceRMBForMarginInput = document.getElementById('sellingPriceRMBForMargin');
const profitMarginResultDisplay = document.getElementById('profitMarginResult');

const exchangeRateInput = document.getElementById('exchangeRate');
const clearProfitBtn = document.getElementById('clearProfitSection');
const clearMarginBtn = document.getElementById('clearMarginSection');
const profitHistoryList = document.getElementById('profitHistoryList');
const marginHistoryList = document.getElementById('marginHistoryList');

// 历史记录数组
let profitHistory = [];
let marginHistory = [];
let profitTimer = null;
let marginTimer = null;

// 默认汇率
let exchangeRate = parseFloat(exchangeRateInput.value);

// 格式化数字，三位小数进一
function formatNumber(num) {
  const rounded = Math.ceil(num * 1000) / 1000;
  return rounded.toFixed(2);
}

// 提取纯数字
function extractNumber(text) {
  return text.match(/[\d.]+/)[0];
}

// 计算利润和售价
function calculateProfitAndPrice() {
  const costRMB = parseFloat(costRMBInput.value) || 0;
  const profitMargin = parseFloat(profitMarginInput.value) / 100 || 0;

  const sellingPriceRMB = costRMB / (1 - profitMargin);
  const profit = sellingPriceRMB - costRMB;
  const sellingPriceUSD = sellingPriceRMB / exchangeRate;

  profitDisplay.textContent = `${formatNumber(profit)} RMB`;
  sellingPriceRMBDisplay.textContent = `${formatNumber(sellingPriceRMB)} RMB`;
  sellingPriceUSDDisplay.textContent = `${formatNumber(sellingPriceUSD)} USD`;

  // 清除之前的定时器
  if (profitTimer) {
    clearTimeout(profitTimer);
  }

  // 添加到历史记录（延迟2秒）
  if (costRMB && profitMargin) {
    profitTimer = setTimeout(() => {
      addToProfitHistory({
        costRMB: formatNumber(costRMB),
        profitMargin: profitMargin * 100,
        profit: formatNumber(profit),
        sellingPriceRMB: formatNumber(sellingPriceRMB),
        sellingPriceUSD: formatNumber(sellingPriceUSD)
      });
    }, 2000);
  }
}

// 计算利润点
function calculateProfitMargin() {
  const costRMB = parseFloat(costRMBForMarginInput.value) || 0;
  const sellingPriceRMB = parseFloat(sellingPriceRMBForMarginInput.value) || 0;

  const profit = sellingPriceRMB - costRMB;
  const profitMargin = (profit / sellingPriceRMB) * 100;

  profitMarginResultDisplay.textContent = `${formatNumber(profitMargin)}%`;

  // 清除之前的定时器
  if (marginTimer) {
    clearTimeout(marginTimer);
  }

  // 添加到历史记录（延迟2秒）
  if (costRMB && sellingPriceRMB) {
    marginTimer = setTimeout(() => {
      addToMarginHistory({
        costRMB: formatNumber(costRMB),
        sellingPriceRMB: formatNumber(sellingPriceRMB),
        profitMargin: formatNumber(profitMargin)
      });
    }, 2000);
  }
}

// 更新汇率
function updateExchangeRate() {
  exchangeRate = parseFloat(exchangeRateInput.value) || 7.0;
  calculateProfitAndPrice();
}

// 清空N点售价模块
function clearProfitSection() {
  costRMBInput.value = '';
  profitMarginInput.value = '';
  calculateProfitAndPrice();
}

// 清空赚几个点模块
function clearMarginSection() {
  costRMBForMarginInput.value = '';
  sellingPriceRMBForMarginInput.value = '';
  calculateProfitMargin();
}

// 添加N点售价历史记录
function addToProfitHistory(calculation) {
  profitHistory.unshift(calculation);
  if (profitHistory.length > 5) {
    profitHistory.pop();
  }
  updateProfitHistoryDisplay();
}

// 添加利润点历史记录
function addToMarginHistory(calculation) {
  marginHistory.unshift(calculation);
  if (marginHistory.length > 5) {
    marginHistory.pop();
  }
  updateMarginHistoryDisplay();
}

// 更新N点售价历史记录显示
function updateProfitHistoryDisplay() {
  profitHistoryList.innerHTML = '';
  profitHistory.forEach((calc, index) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `#${index + 1} 成本:${calc.costRMB} 利润点:${calc.profitMargin}% 利润:${calc.profit} 售价:${calc.sellingPriceRMB} 美金:${calc.sellingPriceUSD}`;
    profitHistoryList.appendChild(historyItem);
  });
}

// 更新利润点历史记录显示
function updateMarginHistoryDisplay() {
  marginHistoryList.innerHTML = '';
  marginHistory.forEach((calc, index) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `#${index + 1} 成本:${calc.costRMB} 售价:${calc.sellingPriceRMB} 利润点:${calc.profitMargin}%`;
    marginHistoryList.appendChild(historyItem);
  });
}

// 复制功能
function copyToClipboard(text) {
  const number = extractNumber(text);
  navigator.clipboard.writeText(number).then(() => {
    // 可以添加复制成功的提示
  }).catch(err => {
    console.error('复制失败:', err);
  });
}

// 事件监听
costRMBInput.addEventListener('input', calculateProfitAndPrice);
profitMarginInput.addEventListener('input', calculateProfitAndPrice);
costRMBForMarginInput.addEventListener('input', calculateProfitMargin);
sellingPriceRMBForMarginInput.addEventListener('input', calculateProfitMargin);
exchangeRateInput.addEventListener('input', updateExchangeRate);
clearProfitBtn.addEventListener('click', clearProfitSection);
clearMarginBtn.addEventListener('click', clearMarginSection);

// 复制按钮事件监听
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetId = e.currentTarget.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    copyToClipboard(targetElement.textContent);
  });
});