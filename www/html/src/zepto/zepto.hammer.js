(function(factory) {
    if(window.Zepto){
        factory(Zepto, Hammer);
    }else if(window.jQuery){
        factory(jQuery, Hammer);
    }
}(function($, Hammer) {
    function hammerify(el, options) {
        var $el = $(el);
        if(!$el.data("hammer")) {
            $el.data("hammer", new Hammer($el[0], options));
        }
    }
    $.fn.hammer = function(options) {
        return this.each(function() {
            hammerify(this, options);
        });
    };
    Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
            $(this.element).trigger({
                type: type,
                gesture: data
            });
        };
    })(Hammer.Manager.prototype.emit);
}));