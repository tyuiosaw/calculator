const rates = { USD: 92.5, EUR: 101.2, GBP: 115.0, CNY: 12.8, TRY: 2.8 };
const budgetData = [];

const updateRates = async () => {
    try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await response.json();
        
        for (let key in rates) {
            if (data.Valute[key]) {
                rates[key] = data.Valute[key].Value;
            }
        }
        document.getElementById('lastUpdate').innerText = "Курсы обновлены ✅";
        renderBudget();
    } catch (e) {
        document.getElementById('lastUpdate').innerText = "Ошибка обновления ❌";
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
};

updateRates();

const getNumber = (id) => {
    return parseFloat(document.getElementById(id).value);
};

const doCurrency = () => {
    const summ = getNumber('moneyValue');
    const from = document.getElementById('fromCur').value;
    const to = document.getElementById('toCur').value;

    if (isNaN(summ)) return alert("Введите число");

    const inRub = (from === "RUB") ? summ : summ * rates[from];
    const final = (to === "RUB") ? inRub : inRub / rates[to];

    document.getElementById('moneyRes').innerText = final.toFixed(2) + " " + to;
};

const doDistance = () => {
    const val = getNumber('distVal');
    const type = document.getElementById('distType').value;
    const resBlock = document.getElementById('distRes');

    if (isNaN(val) || val < 0) return resBlock.innerText = "--"; 
    
    const res = (type === "m-k") ? val * 1.61 : val / 1.61;
    resBlock.innerText = res.toFixed(2) + (type === "m-k" ? " км" : " миль");
};

const doWeight = () => {
    const val = getNumber('weightVal');
    const type = document.getElementById('weightType').value;
    const resBlock = document.getElementById('weightRes');

    if (isNaN(val) || val < 0) return resBlock.innerText = "--";
    
    const res = (type === "f-kg") ? val * 0.45 : val / 0.45;
    resBlock.innerText = res.toFixed(2) + (type === "f-kg" ? " кг" : " фунтов");
};

const renderBudget = () => {
    const list = document.getElementById('budgetList');
    const displayCur = document.getElementById('displayCur').value;
    const totalSumElement = document.getElementById('totalSum');
    const totalLabel = document.getElementById('totalCurLabel');
    
    list.innerHTML = ""; 
    let currentTotal = 0;

    budgetData.forEach((item, index) => {
        const convertedPrice = (displayCur === "RUB") ? item.priceInRub : item.priceInRub / rates[displayCur];
        
        const row = list.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.originalPrice} ${item.originalCur}</td>
            <td>${convertedPrice.toFixed(2)} ${displayCur}</td>
            <td><button class="btn-delete" onclick="removeItem(${index})">X</button></td>
        `;
        currentTotal += convertedPrice;
    });

    totalLabel.innerText = displayCur;
    totalSumElement.innerText = Math.max(0, currentTotal).toFixed(2);
};

const addItem = () => {
    const name = document.getElementById('itemName').value;
    const price = getNumber('itemPrice');
    const cur = document.getElementById('itemCur').value;

    if (!name || isNaN(price) || price < 0) {
        return alert("Заполните поля корректно");
    }

const priceInRub = (cur === "RUB") ? price : price * rates[cur];

    budgetData.push({
        name: name,
        originalPrice: price,
        originalCur: cur,
        priceInRub: priceInRub
    });

    renderBudget();
    
    document.getElementById('itemName').value = "";
    document.getElementById('itemPrice').value = "";
};

const removeItem = (index) => {
    budgetData.splice(index, 1);
    renderBudget();
};