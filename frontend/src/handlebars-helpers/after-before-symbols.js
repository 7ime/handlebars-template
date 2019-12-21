module.exports = function(html, symbol, count) {
    let sequence = '';

    for(let i = 0; i < count; i++) {
        sequence += symbol;
    }

    return `${sequence} ${html} ${sequence}`;
};
