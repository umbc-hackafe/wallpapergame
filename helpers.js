helpers = {
    zeroFill: function(value, width) {
        var val = String(value);
        var remaining = width - val.length;
        if(remaining > 0) {
            val = new Array(remaining + 1).join('0') + val;
        }
        return val;
    },
};
