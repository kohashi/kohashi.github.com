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
			var labels = $tabs.find('#tabs_list').find('a')
			window.$tbs = $tabs
			var contents = $tabs.children('div').children('textarea')
			var arr  = [];
			for(var i=0; i<labels.length; i++){
				arr[i] = {};
				arr[i].title = labels.eq(i).text();
				arr[i].content = contents.eq(i).val();
			}
			return arr;
		}

		//--------------------------------
		// close icon: removing the tab on click
		// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
		$( "#tabs span.ui-icon-close" ).live( "click", function() {
			var index = $( "li", $tabs ).index( $( this ).parent() );
			$tabs.tabs( "remove", index );
		});
		
		// addTab button: just opens the dialog
		$( "#add_tab" ).button()
			.click(function() {
				$dialog.dialog( "open" );
			});
		//execute button
		$( "#execute").button()
			.click(function(){
				var timelineData = window.App.Instances.TimelineView.model.toJSON();
				var kfData = '';
				for(objName in timelineData){
					kfData += '$("#' + objName + '").keyframe('
					+ JSON.stringify(timelineData[objName], null, " ")
					+ ');\r\n\r\n'
				}
				
				$('#exec_area').val(kfData);
					
				try {
					eval(kfData);
				} catch(e) {
					alert('It was a problem with your code!');
				}
			});
		//save button
		$('#save').button()
			.click(function(){
				var savedata = { idx : $tabs.tabs('option', 'selected') };
				savedata.tabs = getTabsData();
				console.log(JSON.stringify(savedata))
				localStorage['savedata'] = JSON.stringify(savedata);
			});
		//clearData button
		$('#clearData').button()
			.click(function(){
					$( "#dialog:ui-dialog" ).dialog( "destroy" );
					$( "#dialog_message" ).dialog( "open" );
			});	
		$('#clear_img').button()
			.click(function(){
					currentObject.css('backgroundImage', 'none')
			});	
			
		$('#add_object').button()
			.click(function(){
				//$("#new_object_dialog").dialog( "open" ); //jQ-Prompt
				var newObjName = prompt("オブジェクト名入れてください(絶対に重複名入れないでください)");
				if(newObjName){
					//何かに追加
					App.Instances.TimelineView.addObject(newObjName);
				}
			});
			
		$('#delete_object').button()
			.click(function(){
					App.Instances.TimelineView.removeObject(window.currentObject.attr('id'));
			});
		$('#go_zero_frame').button()
			.click(function(){
					$('#timeline_table td').eq(0).click();
			});
		$('#write_to_tab').button().click(function(){
			//タブへ書き出し
			var selectedId = $tabs.tabs('option', 'selected') ;
			var targetId = $("#tabs_list").children().eq(selectedId).find("a").attr("href");
			$(targetId).find('textarea').val(JSON.stringify(App.Instances.TimelineView.model.toJSON(), null, "\t"));
		})
		$('#read_from_tab').button().click(function(){
			//タブから読み込み
			var selectedId = $tabs.tabs('option', 'selected') ;
			var targetId = $("#tabs_list").children().eq(selectedId).find("a").attr("href");
			var jsonString = $(targetId).find('textarea').val();
			//JSON.parse(jsonString);//コメント等が使用できないので却下
			var timelineObj = eval("(" + jsonString+ ")");//だせぇ…仕方ない
			
			$("#demo_stage").empty();
			App.Instances.TimelineView.setModel(new App.Models.TimelineModel(timelineObj));
			$('#timeline_table td').eq(0).click();//初回は左上端を選択状態にする。
		})
		//選択中のフレームを削除
		$('#delete_current_frame').button().click(function(){
			if(window.currentFrame == 0){
				alert('0フレーム目は削除できません');
				return;
			}
			App.Instances.TimelineView.model.deletePropData(window.currentObject[0].id, window.currentFrame )
		})
		//-----------------------------------
		
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
		});
		
		
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
	//----------
	// prop area

		
	// image setting
	$("#backgroundImage").on('input', function(){
		var imgUrl = 'url(' + $(this).val() +')';
		var objName = currentObject.attr('id');
		currentObject.css('backgroundImage', imgUrl);
		var mdl = window.App.Instances.TimelineView.model.get(objName);
		mdl[0].backgroundImage = imgUrl;
		App.Instances.TimelineView.model.set(objName, mdl);
	});
	//z-index setting
	$("#z-index").on('input',function(){
		var zIdx = $(this).val();
		var objName = currentObject.attr('id');
		currentObject.css('z-index', zIdx);
		var mdl = window.App.Instances.TimelineView.model.get(objName);
		mdl[0]['z-index'] = zIdx;
		App.Instances.TimelineView.model.set(objName, mdl);
	})
	// color setting
	var colorInput = $('#backgroundColor');
	colorInput.ColorPicker({
		color: colorInput.val() || '#0000ff',
		onChange: function (hsb, hex, rgb){
			$("#backgroundColor").val('#' + hex);
			currentObject.css('backgroundColor', '#' + hex);
		},
		onShow : function(colpkr){
			$(colpkr).css('z-index',9999)
		}
	}).on("change",function(){
		console.log($(this)[0].id)
		console.log($(this).val())
		this.model.set($(this)[0].id, $(this).val());//modelへの変更
	});
	// other css setting
	$("#other_css").on('input', function(){
		try{
			var obj = JSON.parse($(this).val())
			currentObject.css(obj);
		}catch(e){
		}
	});
	$( "#dialog" ).dialog({autoOpen:false, position:'right'});
	$("#dialog_button").on("click", function(){$( "#dialog" ).dialog("open")});

		
});