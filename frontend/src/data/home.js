const rootData = require('./_root');

const data = {
    'title': 'Handlebars Simple Template',
    menu: [
        {
            href: '#',
            name: 'exmaple 1'
        },
        {
            href: '#',
            name: 'exmaple 2'
        }
    ]
};

module.exports = Object.assign({}, rootData, data);
