(function() {
    function onConnected(event, user) {
        var logout = $('<div id="twitter-disconnect"></div>');
        logout.bind('click', function() { twttr.anywhere.signOut() });
        var card = '<p id="twitter-connected-user"><img width="14" height="14" src="' + user.profileImageUrl + '">@' + user.screenName + '</p>';
        $.someone.element.empty().append(card, logout)
        return $.someone.trigger('connected', [user]);
    };
    http://essperimentz.ca/shared/someone/
    // jQuery.someone();
    $.someoneDefaults = { placeholder: document.body };
    $.someone = function(options) {
        var lib = arguments.callee,
            opts = $.extend( {}, $.someoneDefaults , options);
        if (lib.initialized !== true) {
            lib.initialized = true;
            $.someone = $(lib);
            opts.placeholder = opts.placeholder || 'body';
            
            if(!opts.key){
                $('script').each(function() {
                    var src = $(this).attr('src');
                    var re = /someone\.js\?k=(\w+)/;
                    console.debug(src.match(re),re,opts,src)
                    if(src && (re).test(src)){
                        opts.key = src.match(re)[1];
                    }
                });                
            };
            $.getScript('http://platform.twitter.com/anywhere.js?v=1&id=' + opts.key, function onGetScript( event ) {
                twttr.anywhere.config({callbackURL: opts.callbackURL })
                twttr.anywhere(function(T) {
                    $.extend($.someone, {
                        element: $(opts.placeholder)
                    });
                    T.bind('authComplete', onConnected);
                    T.bind('signOut',
                    function() {
                        $.someone.trigger('disconnected', [T]);
                        if (opts.reload === true) window.location.reload(true);
                    });
                    if (T.isConnected()) onConnected(null, T.currentUser);
                    else T(opts.placeholder).connectButton();
                    $.someone.trigger('anywhere', [T]);
                });
            });
        };
        return $.someone;
    };
})()