const request = require('request');

module.exports.data = {};

module.exports.getCoinList = function () {
    request.get('https://api.coinmarketcap.com/v2/ticker/?convert=GBP', { json: true }, (err, res, body) => {
        for (currencyIndex in body.data) {
            var tmpData = {};
            var currency = body.data[currencyIndex];

            tmpData.Name = currency.name;
            tmpData.Price = currency.quotes.GBP.price;

            module.exports.data[currency.symbol] = tmpData;
        }
    });
}

module.exports.getCurrencies = function (data) {

}

module.exports.calculatePortfolio = function (data) {
    var portfolioData = {
        "Currencies":{},
        "Overview":{
            "CurrenciesInvested":0,
            "TotalInvestment":0,
            "TotalProfit":0,
            "TotalPortfolio":0
        }
    };
    try {
        for (currencyIndex in data) {
            portfolioData["Currencies"][currencyIndex] = Object.assign(module.exports.data[currencyIndex], data[currencyIndex]);
            if (data[currencyIndex].Owned != undefined && data[currencyIndex].Investment != undefined) {
                portfolioData["Currencies"][currencyIndex].Portfolio = portfolioData["Currencies"][currencyIndex].Owned * portfolioData["Currencies"][currencyIndex].Price
                portfolioData["Currencies"][currencyIndex].Profit = portfolioData["Currencies"][currencyIndex].Portfolio - portfolioData["Currencies"][currencyIndex].Investment;
                portfolioData["Overview"].TotalProfit += portfolioData["Currencies"][currencyIndex].Profit;
                portfolioData["Overview"].TotalInvestment += portfolioData["Currencies"][currencyIndex].Investment;
                portfolioData["Overview"].TotalPortfolio += portfolioData["Currencies"][currencyIndex].Portfolio;
                portfolioData["Overview"].CurrenciesInvested++;
            }
        }
    } catch (e){
        return false
    }

    return portfolioData;
}