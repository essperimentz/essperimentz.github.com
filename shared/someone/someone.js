
(function() {
    function onConnected(event, user) {
        var logout = $('<div id="twitter-disconnect"></div>');
        logout.bind('click', function() { twttr.anywhere.signOut() });
        var card = '<p id="twitter-connected-user"><img width="14" height="14" src="' + user.profileImageUrl + '">@' + user.screenName + '</p>';
        $.someone.element.empty().append(card, logout)
        return $.someone.trigger('connected', [user]);
    };
    function findKey() {
        var key;
        $('script').each(function() {
            var src = $(this).attr('src');
            var re = /someone\.js\?k=(\w+)/;
            if(src && (re).test(src)){
                var m = src.match(re);
                if(m && m[1]) key = m[1];  
            }
        });
        return key;
    }
    // jQuery.someone();
    $.someone = function(callbackURL) {
        var lib = arguments.callee;
        if (lib.initialized !== true) {
            lib.initialized = true;
            $.someone = $( lib );
            var key = findKey();
            if(!key) return;
            $.getScript('http://platform.twitter.com/anywhere.js?v=1&id=' + key, function onGetScript( event ) {
                twttr.anywhere.config({callbackURL: callbackURL })
                twttr.anywhere(function(T) {
                    $.extend($.someone, {
                        element: $('<footer id="account" class="loading"></footer>').appendTo( document.body )
                    });
                    T.bind('authComplete', onConnected);
                    T.bind('signOut',
                    function() {
                        $.someone.trigger( 'disconnected', [ T ] );
                        window.location.reload( true );
                    });
                    if ( T.isConnected() ) onConnected( null, T.currentUser );
                    else T( $.someone.element ).connectButton();
                    $.someone.trigger('anywhere', [T]);
                });
            });
        };
        return $.someone;
    };
	$.someone.bind('anywhere',function(event) {		
		$('#account').removeClass('loading');
	});		
	$.someone.bind('connected',function(event) {
		$('#account').removeClass('loading');			
	});
})()