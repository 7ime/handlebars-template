module.exports = function(context, options) {
    let ret = "<ul class='list'>";

    for (var i = 0, j = context.length; i < j; i++) {
        ret = ret + "<li class='item'>" + options.fn(context[i]) + "</li>";
    }

    return ret + "</ul>";
};
