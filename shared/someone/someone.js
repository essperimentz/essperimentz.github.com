(function() {
    var ui;
	function initAnywhere(T) {
        $.someone.trigger('anywhere',[T]);
		$('<footer id="twitter-session"><h3 id="twitter-session-title">Connect to <span id="twitter-session-site">...</span> using your <span class="twitter-word">Twitter</span> account by pressing the big green button <b id="twitter-session-arrow">&rarr;</b></h3><button id="twitter-session-button">Connect using Twitter</button><div id="twitter-session-notifications"></div></footer>').appendTo(document.body)
		$('#twitter-session-site').text(document.domain);
		ui = {
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
						'Connect to <span id="twitter-session-site">'+document.domain+'</span> using your <span class="twitter-word">Twitter</span> account by pressing the big green button <b id="twitter-session-arrow">→</b>'
					);						
				};
			},
			setUser: function setUser(name,image) {		
				$('#twitter-session-title').html('You are connected to <span id="twitter-session-site">'+document.domain+'</span> as <span id="twitter-session-user">@'+name+'</span> <img id="twitter-session-avatar" src="'+image+'" width="14" height="15">');
			},
			notify: function notify( level, message ) {
				$('#twitter-session-notifications').show(function() {
					var notification = $('<div>').addClass('twitter-session-notification').addClass(level),
						close = $('<button>').text('×').bind('click',function() {
							var remain = $('#twitter-session-notifications .twitter-session-notification').not(notification).length;
							if(remain === 0) $('#twitter-session-notifications').hide();
                            notification.remove();
						}),
						msg = $('<p>').html(message);
						notification.append(msg,close).hide();
						$(this).append(notification.fadeIn());
				});
			}	
		};//ui
        $.someone.notify = ui.notify;
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
			ui.setUser(T.currentUser.screenName,T.currentUser.profileImageUrl);
		}else{
			T.one('authComplete',function(e,user) {
    			  ui.unsetState('loading');			    
    			  ui.setState('connected');					
    			  ui.setUser(T.currentUser.screenName,T.currentUser.profileImageUrl);
    		});
		};
		T.one('signOut',function(e) { // ui.unsetState('connected');
            window.location.reload(true) 
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