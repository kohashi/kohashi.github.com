	$(function() {
		window.currentObject = null;
		window.currentFrame  = 0;
		window.currentStyle  = {};
		window.compositStyle  = {};
		
		// tab view ----------------
		var $tab_title_input = $( "#tab_title")
		var tab_counter = 5;
		var tab_content_wrapper = '';

		// tabs init with a custom tab template and an "add" callback filling in the content
		var $tabs = $( "#tabs").tabs({
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				$( ui.panel ).append( '<textarea class="code_area">' + tab_content_wrapper + '</textarea>' );
			},
			select: function(event, ui) {
				console.log(ui.panel)
			}
		});
		
		// modal dialog init: custom buttons and a "close" callback reseting the form inside
		var $dialog = $( "#tab_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			buttons: {
				Add: function() {
					addTab($tab_title_input.val());
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function() {
				$tab_title_input.focus();
			},
			close: function() {
				$form[ 0 ].reset();
			}
		});

		// addTab form: calls addTab function on submit and closes the dialog
		var $form = $( "form", $dialog ).submit(function(){
			addTab($tab_title_input.val());
			$dialog.dialog( "close" );
			return false;
		});

		// actual addTab function: adds new tab using the title input from the form above
		function addTab(title, content) {
			tab_counter++;
			var tab_title = title || "t_"+ tab_counter;
			tab_content_wrapper = content || '// input your code ';
			$tabs.tabs( "add", "#tabs-" + tab_counter, tab_title );
		}
		
		function getTabsData(){
			var labels = $tabs.children().first().children().find('a');
			var contents = $tabs.children('div').children('textarea')
			var arr  = [];
			for(var i=0; i<labels.length; i++){
				arr[i] = {};
				arr[i].title = labels.eq(i).text();
				arr[i].content = contents.eq(i).val();
			}
			return arr;
		}
		
		function reset_box(){
			 window.currentObject.css({
					top:'100px', left:'15px',
					width:'150px', height:'150px',
					'-webkit-border-radius':'5px',
					'-moz-border-radius':'5px',
					background:'#522F7F',
					color:'#fff',
					'font-weight':'bold',
					'line-height':'60px',
					'text-align':'center',
					cursor: 'default',
					opacity: 1
				});
			}

		//--------------------------------
		// close icon: removing the tab on click
		// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
		$( "#tabs span.ui-icon-close" ).live( "click", function() {
			var index = $( "li", $tabs ).index( $( this ).parent() );
			$tabs.tabs( "remove", index );
		});
		
		// addTab button: just opens the dialog
		$( "#add_tab" )
			.button()
			.click(function() {
				$dialog.dialog( "open" );
			});
		$( "#reset" )
			.button()
			.click(function() {
				reset_box();
			});
		//execute button
		$( "#execute")
			.button()
			.click(function(){
				var selectedId = $tabs.tabs('option', 'selected') ;
				var targetId = $("#tabs_list").children().eq(selectedId).find("a").attr("href");
				try {
					eval($(targetId).find('textarea').val());
				} catch(e) {
					alert('It was a problem with your code!');
				}
			});
		//save button
		$('#save')
			.button()
			.click(function(){
				var savedata = { idx : $tabs.tabs('option', 'selected') };
				savedata.tabs = getTabsData();
				localStorage['savedata'] = JSON.stringify(savedata);
			});
		//clearData button
		$('#clearData')
			.button()
			.click(function(){
					$( "#dialog:ui-dialog" ).dialog( "destroy" );
					$( "#dialog_message" ).dialog( "open" );
			});	
		$('#clear_img')
			.button()
			.click(function(){
					currentObject.css('backgroundImage', 'none')
			});	
			
		$('#add_object')
			.button()
			.click(function(){
				//$("#new_object_dialog").dialog( "open" ); //jQ-Prompt
				var newObjName = prompt("オブジェクト名入れてください(絶対に重複名入れないでください)");
				if(newObjName){
					//何かに追加
					//再描画
					var initState = {width:'100px', height:'100px', backgroundColor:"#522F7F", left:'10px', top:'10px',
						opacity:1, transform_rotate:0, transform_scaleX:0, transform_scaleY:0, border_radius:'0px'};
					var d = $('<div id="'+newObjName+'"/>').appendTo($("#demo_stage"))
						.text('#'+newObjName)
						.css(initState);
					App.Instances.TimelineView.model.set(newObjName, {0:initState })
				}
			});
			
		$('#delete_object')
			.button();
		//------------------------------------
		
		//textarea configiration
		$(document).on('keydown', 'textarea', function(e){
			var kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
			if(kC == 9){ // 9 tab
				if (this.setSelectionRange){
					var o = this;
					var sS = o.selectionStart;
					var sE = o.selectionEnd;
					o.value = o.value.substring(0, sS) + "\t" + o.value.substr(sE);
					o.setSelectionRange(sS + 1, sS + 1);
					o.focus();
					return false;
				}
			}
		})
		
		
		//load function 
		var savedata = localStorage['savedata'];
		if(savedata){
			//clear
			while($tabs.children().length > 1){
				$tabs.tabs( "remove", 0 );
			}
			
			//load
			savedata = JSON.parse(savedata);
			var tabData = savedata.tabs;
			for(var i=0; i<tabData.length; i++){
				addTab(tabData[i].title,  tabData[i].content);
			}
			$tabs.tabs( "option", "selected", savedata.idx);
		}
		$( "#dialog_message" ).dialog({
			autoOpen: false,
			modal: true,
			buttons: {
				Ok: function(){
					delete localStorage['savedata'];
					location.href = location.href;
					$( this ).dialog( "close" );
				},
				cancel:function(){
					$( this ).dialog( "close" );
				}
			}
		});
		$( "#new_object_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			buttons: {
				Ok: function(){
					delete localStorage['savedata'];
					location.href = location.href;
					$( this ).dialog( "close" );
				},
				cancel:function(){
					$( this ).dialog( "close" );
				}
			}
		});

		
	});