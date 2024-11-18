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

// 默认汇率
let exchangeRate = parseFloat(exchangeRateInput.value);

// 计算利润和售价
function calculateProfitAndPrice() {
  const costRMB = parseFloat(costRMBInput.value) || 0;
  const profitMargin = parseFloat(profitMarginInput.value) / 100 || 0;

  const sellingPriceRMB = costRMB / (1 - profitMargin);
  const profit = sellingPriceRMB - costRMB;
  const sellingPriceUSD = sellingPriceRMB / exchangeRate;

  profitDisplay.textContent = `${profit.toFixed(2)} RMB`;
  sellingPriceRMBDisplay.textContent = `${sellingPriceRMB.toFixed(2)} RMB`;
  sellingPriceUSDDisplay.textContent = `${sellingPriceUSD.toFixed(2)} USD`;
}

// 计算利润点
function calculateProfitMargin() {
  const costRMB = parseFloat(costRMBForMarginInput.value) || 0;
  const sellingPriceRMB = parseFloat(sellingPriceRMBForMarginInput.value) || 0;

  const profit = sellingPriceRMB - costRMB;
  const profitMargin = (profit / sellingPriceRMB) * 100;

  profitMarginResultDisplay.textContent = `${profitMargin.toFixed(2)}%`;
}

// 更新汇率
function updateExchangeRate() {
  exchangeRate = parseFloat(exchangeRateInput.value) || 7.0;
  calculateProfitAndPrice();  // 更新结果
}

// 事件监听
costRMBInput.addEventListener('input', calculateProfitAndPrice);
profitMarginInput.addEventListener('input', calculateProfitAndPrice);
costRMBForMarginInput.addEventListener('input', calculateProfitMargin);
sellingPriceRMBForMarginInput.addEventListener('input', calculateProfitMargin);
exchangeRateInput.addEventListener('input', updateExchangeRate);