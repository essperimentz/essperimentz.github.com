
(function() {
    function onConnected(event, user) {
        var logout = $('<div id="twitter-disconnect"></div>');
        logout.bind('click', function() { twttr.anywhere.signOut() });
        var card = '<p id="twitter-connected-user"><img width="14" height="14" src="' + user.profileImageUrl + '">@' + user.screenName + '</p>';
        $.someone.element.empty().append(card, logout)
        return $.someone.trigger('connected', [user]);
    };
    // jQuery.someone();
    // $.someoneDefaults = { placeholder: document.body };
    $.someone = function(options) {
        var lib = arguments.callee,
            opts = $.extend( {}, options);
        if (lib.initialized !== true) {
            lib.initialized = true;
            $.someone = $( lib );
            if(!opts.key){
                $('script').each(function() {
                    var src = $(this).attr('src');
                    var re = /someone\.js\?k=(\w+)/;
                    if(src && (re).test(src)){
                        var m = src.match(re);
                        if(m && m[1]) opts.key = m[1];  
                    }
                });                
            };
            $.getScript('http://platform.twitter.com/anywhere.js?v=1&id=' + opts.key, function onGetScript( event ) {
                twttr.anywhere.config({callbackURL: opts.callbackURL })
                twttr.anywhere(function(T) {
                    $.extend($.someone, {
                        element: $('<footer id="account" class="loading"></footer>').appendTo( document.body )
                    });
                    T.bind('authComplete', onConnected);
                    T.bind('signOut',
                    function() {
                        $.someone.trigger( 'disconnected', [ T ] );
                        if ( opts.reload === true ) window.location.reload( true );
                    });
                    if ( T.isConnected() ) onConnected( null, T.currentUser );
                    else T( $.someone.element ).connectButton();
                    $.someone.trigger('anywhere', [T]);
                });
            });
        };
        return $.someone;
    };
})()