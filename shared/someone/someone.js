// 
// (function() {
//     function mkButton(type) {
//         return $('<button>').attr({},true)
//     }
//     function onConnected(event, user) {
//         $('#twitter-account').removeClass('loading');
//         var logout = $('<div id="twitter-disconnect"></div>');
//         logout.bind('click', function() { twttr.anywhere.signOut() });
//         var card = '<p id="twitter-connected-user"><img width="14" height="14" src="' + user.profileImageUrl + '">@' + user.screenName + '</p>';
//         $.someone.element.empty().append(card, logout)
//         return $.someone.trigger('connected', [user]);
//     };
//     function findKey() {
//         var key;
//         $('script').each(function() {
//             var src = $(this).attr('src');
//             var re = /someone\.js\?k=(\w+)/;
//             if(src && (re).test(src)){
//                 var m = src.match(re);
//                 if(m && m[1]) key = m[1];  
//             }
//         });
//         return key;
//     }
//     // jQuery.someone();
//     $.someone = function(callbackURL) {
//         var lib = arguments.callee;
//         if (lib.initialized !== true) {
//             lib.initialized = true;
//             $.someone = $( lib );
//             var key = findKey();
//             if(!key) return;
//             $.getScript('http://platform.twitter.com/anywhere.js?v=1&id=' + key, function onGetScript( event ) {
//                 $.extend($.someone, {
//                     element: $('<footer id="twitter-account" class="loading"></footer>').appendTo( document.body )
//                 });
//                 twttr.anywhere.config({callbackURL: callbackURL })
//                 twttr.anywhere(function(T) {
//                     $('#twitter-account').removeClass('loading');
//                     T.bind('authComplete', onConnected);
//                     T.bind('signOut',
//                     function() {
//                         $.someone.trigger( 'disconnected', [ T ] );
//                         window.location.reload( true );
//                     });
//                     if ( T.isConnected() ) onConnected( null, T.currentUser );
//                     else T( $.someone.element ).connectButton();
//                     $.someone.trigger('anywhere', [T]);
//                 });
//             });
//         };
//         return $.someone;
//     };
//     $(function() {
//         $('head').append('<link rel="stylesheet" href="http://essperimentz.ca/shared/someone/someone.css" />')
//     })
// })()


(function() {
	function initAnywhere(T) {
		$('<footer id="twitter-session"><h3 id="twitter-session-title">Connect to <span id="twitter-session-site">...</span> using your <span class="twitter-word">Twitter</span> account by pressing the big green button <b id="twitter-session-arrow">&rarr;</b></h3><button id="twitter-session-button">Connect using Twitter</button><div id="twitter-session-notifications"></div></footer>').appendTo(document.body)
		var title = $('title').text();
		$('#twitter-session-site').text(title);
		var ui = {
			//connected,loading
			setState: function setState(state) {
				$('#twitter-session').addClass(state);
				if(state === 'connected'){
			        $.someone.trigger('connected');				    
					$('#twitter-session-button').text('Disconnect from Twitter');
				}
			},
			hasState: function hasState(state) {
				$('#twitter-session').hasClass(state);
			},
			unsetState: function unsetState(state) {
				$('#twitter-session').removeClass(state);
				if(state === 'connected'){
			        $.someone.trigger('disconnected');				    				    
					$('#twitter-session-button').text('Connect using Twitter');
					$('#twitter-session-title').html(
						'Connect to <span id="twitter-session-site">'+title+'</span> using your <span class="twitter-word">Twitter</span> account by pressing the big green button <b id="twitter-session-arrow">→</b>'
					);						
				};
			},
			setUser: function setUser(name,image) {		
				$('#twitter-session-title').html('You are connected to <span id="twitter-session-site">'+title+'</span> as <span id="twitter-session-user">@'+name+'</span> <img id="twitter-session-avatar" src="'+image+'" width="14" height="15">');
			},
			notify: function notify( level, message ) {
				$('#twitter-session-notifications').show(function() {
					var notification = $('<div>').addClass('twitter-session-notification').addClass(level),
						close = $('<button>').text('×').click(function() {
							notification.remove();
							var remain = $('#twitter-session-notifications .twitter-session-notification').length;
							if(remain === 0) $('#twitter-session-notifications').hide();
						}),
						message = $('<p>').html(message);
						notification.append(message,close);
						$(this).append(notification);
				});
			}	
		};//ui
		$('#twitter-session-button').bind('click',function() {
		    if($('#twitter-session').hasClass('connected')){
			    twttr.anywhere.signOut();		        
		    }else{
		        ui.setState('loading');		
                T.signIn();
		    }
		});
		if(T.isConnected()){
			ui.unsetState('loading');		    
			ui.setState('connected');
			ui.setUser(T.currentUser.screeName,T.currentUser.profileImageUrl);
		}else{
			T.bind('authComplete',function(e,user) {
			  ui.unsetState('loading');			    
			  ui.setState('connected');					
			  ui.setUser(T.currentUser.screeName,T.currentUser.profileImageUrl);
			});
		};
		T.bind('signOut',function(e) { ui.unsetState('connected');
        // window.location.reload(true) 
		});
	};
	$.someone;
	$.someone = function(callbackURL) {
	    if(!$.someone.initialized){
	        $.someone.initialized = true;
    		var key;
            $('script').each(function() {
                var src = $(this).attr('src');
                var re = /someone\.js\?k=(\w+)/;
                if(src && (re).test(src)){
                    var m = src.match(re);
                    if(m && m[1]) key = m[1];  
                }
            });
    		if(!key) throw('Missing twitter API key');
    		var url = 'http://platform.twitter.com/anywhere.js?v=1&id=' + key;
    		$.getScript( url , function( event ) { 
    		    if(!$.someone.anywhereInitialized){
    		        $.someone.anywhereInitialized = true;
        			$.someone.trigger('anywhere');
        			twttr.anywhere.config({callbackURL: callbackURL }); 
        			twttr.anywhere(initAnywhere);    		        
    		    }
    		});	        
    		$.someone = $(arguments.callee);
	    }
		return $.someone;
	};
	$(function() {$('head').append('<link rel="stylesheet" href="http://127.0.0.1/someone/someone.css" />') })

})();