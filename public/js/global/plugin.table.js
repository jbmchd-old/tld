(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(function ($) {

    $.extend($.fn, {

        table_defaults: function () {
            
            $(this).each(function (i, table) {

                var all_el = $(table).find('th, td');
                $(all_el).each(function (i, el) {

                    $(el.attributes).each(function (i, attr) {
                        switch (attr.name) {
                            case 'data-tipo':
                                if (attr.value === "date") {
                                    data = $(el).html().split('-').reverse().join('/');
                                    $(el).html(data)
                                }
                                break;

                        }
                    });

                });



            })
        },

    });

    return $;
}));

















