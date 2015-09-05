var project_management = angular.module('project_management', []);




var isFileData = true;


function mainController($scope, $http) {
	
	$scope.projects;
	$scope.files;
	$scope.projectAtt; 
	$scope.notes;
	$scope.litratures;
	$scope.protocols;
	$scope.experiments;
	
	$scope.lastupdate;
	$scope.orderList;
	
	$scope.projectI;
	
	$scope.activities;
	
	$scope.comments;
	
	$scope.lastupdate;
	
	$scope.commArr = new Array();
	
	$scope.actArr = new Array();
	
	$scope.tags = new Array();
	
	$scope.lit_tag = new Array();
	
	$scope.pro_tag = new Array();
	
	$scope.exp_tag = new Array();
	
	$scope.fileArr = new Array();
	
	$scope.pro_lastupdate = new Array();
	
	$scope.lastnoteupdateArr = new Array();
	$scope.lastlitupdateArr = new Array();
	$scope.lastproupdateArr = new Array();
	$scope.lastexpupdateArr = new Array();
	$scope.lastactupdateArr = new Array();
	
	/**
	* find projects
	*/
	$scope.findprojects =function()
	{
	   $http.post('/findproject', {username:username})
			.success(function(data) {
				console.log(data);
				$scope.projects=data;
				for(var i in data)
				{
					$scope.pro_lastupdate[data.id]=data.updatedAt;
				}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	/**
	* Find project files
	*/
	$scope.findprojectsfiles =function(projectid)
	{
		//alert(isFileData+"  file called  "+projectid)
		if(projectid==34)
		{
			projectid = $scope.projectI;
		}
		if(isFileData)
		{
			isFileData=false;
			//alert(projectid,"=====project id")
		
	   $http.post('/findfiles', {projectid:projectid})
			.success(function(data) {
				console.log(data,"===========filedata======");
				
				$scope.files=data;
				$scope.fileArr[projectid]=data;
				filename="";
				
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		}
		else
		{
			isFileData=true;
			$scope.fileArr[projectid]=[];
		}
		
	};
	
	/**
	* create projects and send project data to server
	*/
	
	$scope.createProject = function()
		{
			
			var pro_type=0;
			var type ='open';
			var projectname = $('#pro_name').val();
			var projectdesc = $('#pro_desc').val();
			type  = $('#project_mode').val();
			pro_type=$('#pro_type').val();
			
			//alert(filename+"  "+filepath+"  "+ pro_type);
			
			  
		    var projectId = $('#projectId').val();
		    if(projectId == '' && typeof projectId == 'string'){

			 $http.post('/project', {projectname: projectname, projectdesc: projectdesc, projecttype: type, projectcat: pro_type, username:username,filename:filename,filepath:filepath})
				 .success(function(data) {
					$scope.findprojects();
					
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			
		    } else {

			 $http.post('/project', {projectname: projectname, projectdesc: projectdesc, projecttype: type, projectcat: pro_type, username:username,filename:filename,filepath:filepath, projectid : projectId})
				 .success(function(data) {
					$scope.findprojects();
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			
		    }
			
			//$('#projectform')[0].reset();
			$('#projectId').val('');
			$('#pro_name').val('');
			$('#pro_desc').data("wysihtml5").editor.clear();
			 $("#upload ul").empty();
			 var oDropdown = $("#project_mode").msDropdown().data("dd");
			oDropdown.set("selectedIndex", 0);
			$('.open_drop').hide();
			
			
			/*
			var oDropdown1 = $("#Pro_type").msDropdown().data("dd");
			oDropdown1.set("selectedIndex", 0);*/
			
						
		};

        $scope.editProject = function(project){
        	console.log(project);
   //      	$('#projectId').val(project.id);
   //          $('#pro_name').val(project.projectname);
   //          $('#pro_desc').val(project.projectdesc);
   //          $('#project_mode').val();
   //          pro_type=$('#pro_type').val(project.projectType);
   //          var oDropdown = $("#project_mode").msDropdown().data("dd");
			// if(project.isPrivate){
			// 	oDropdown.set("selectedIndex", 2);
			// 	$('.open_drop').hide();
			// } else {
			// 	oDropdown.set("selectedIndex", 1);
			// 	$('.open_drop').show();
			// 	var oDropdown1 = $("#pro_type").msDropdown().data("dd");
			// 	if(project.projectTypeId == 0){
			// 		oDropdown1.set("selectedIndex", 1);
			// 	} else if(project.projectTypeId == 1) {
			// 		oDropdown1.set("selectedIndex", 2);
			// 	} else if(project.projectTypeId == 2) {
			// 		oDropdown1.set("selectedIndex",3);
			// 	} else if(project.projectTypeId == 3) {
			// 		oDropdown1.set("selectedIndex", 4);
			// 	} else if(project.projectTypeId == 4) {
			// 		oDropdown1.set("selectedIndex", 5);
			// 	} else if(project.projectTypeId == 5) {
			// 		oDropdown1.set("selectedIndex", 6);
			// 	}
			// }

        };

        $scope.resetProjectForm = function(){
        	//$('#projectform')[0].reset();
        	$('#projectId').val('');
			$('#pro_name').val('');
			$('#pro_desc').data("wysihtml5").editor.clear();
			 $("#upload ul").empty();
			 var oDropdown = $("#project_mode").msDropdown().data("dd");
			oDropdown.set("selectedIndex", 0);
			$('.open_drop').hide();
        }
		$scope.deleteproject = function()
		{
			var password = $('#my_pass').val();
			var projectid = pro_id;
			//alert(password, "====",pro_id);
			
			$http.post('/deleteproject', {password:password,projectid:projectid})
					.success(function(data) {
					console.log(data,"================= deleted");
					$scope.findprojects	();								
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};
		/**
		*  find project attribute
		*/
		$scope.findprojectAtt = function(projectid)
		{
			//alert("hi==");
			window.open("/project_workspace","_self");
			localStorage.setItem("projectid", projectid);
		};
		/**
		* find project by ID
		*/
		$scope.findprojectbyID = function()
		{
			
			var projectid = localStorage.getItem("projectid");
			//console.log(projectid,"anishwa");
			$http.post('/findProjectdata', {projectid:projectid})
					.success(function(data) {
					console.log(data,"===========fil==========edata======");
									
					
					$scope.projectAtt=data;
					$scope.projectI= data.id;
					//alert($scope.projectI);
					$scope.lastupdate = $scope.convertTime(data.updatedAt);
					var oDropdown = $("#authorn").msDropdown().data("dd");
					var att= $scope.projectAtt.username;
					oDropdown.add(new Option(att,att ));
											
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};
		
		$scope.convertTime = function(date)
		{
			var system_date  = Date.parse(date);;
			var user_date = new Date();
			
			var diff = Math.floor((user_date - system_date) / 1000);
			if (diff <= 1) {return "just now";}
			if (diff < 20) {return diff + " seconds ago";}
			if (diff < 40) {return "half a minute ago";}
			if (diff < 60) {return "less than a minute ago";}
			if (diff <= 90) {return "one minute ago";}
			if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
			if (diff <= 5400) {return "1 hour ago";}
			if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
			if (diff <= 129600) {return "1 day ago";}
			if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
			if (diff <= 777600) {return "1 week ago";}
			return "on " + system_date;
		};
		/**
		* create note from here
		*/
		$scope.createnote = function()
		{
			var projectid = localStorage.getItem("projectid");
			
			var notename = $('#my_note').val();
			var notedesc = $('#note_desc').val();
			var notetype = $('.active_ntype').text();
			var tags = note_tag;		
						
			alert(edit_entry+ "  : value of edit entry");
			
			if(edit_entry=='') 
			{
			
				 $http.post('/createnote', {projectid: projectid, notename: notename, notedesc: notedesc, tags: tags, filename:filename,filepath:filepath,notetype:notetype})
					 .success(function(data) {
						 $scope.findnote();
						 $scope.createActivity("note",notename);
						 console.log(" on sucessess====== on find note=====")							
					})
					.error(function(data) {
						console.log('Error: ' + data);
					});
			}
			else
			{
				$http.post('/updatenote', {projectid: projectid, notename: notename, notedesc: notedesc, tags: tags, filename:filename,filepath:filepath,notetype:notetype, noteid:edit_entry })
					 .success(function(data) {
						 $scope.findnote();
						 $scope.createActivity("note",notename);
						 console.log(" on sucessess====== on find note=====")							
					})
					.error(function(data) {
						console.log('Error: ' + data);
					});
			}
			
			
			$('#my_note').val('');
				$('#note_desc').data("wysihtml5").editor.clear();
				$('.single_tag').remove();
				$('#get_data_note').val('');
				note_tag="";
				edit_entry='';
			
			
			
		};
		
		/**
		* find note from here 
		*/
		
		$scope.findnote = function()
		{
			var projectid = localStorage.getItem("projectid");
			$http.post('/findnote', {projectid: projectid})
			 .success(function(data) {
				 
				 
				$scope.notes=data;	
				
				for( id in $scope.notes )
				{
					var tags = $scope.notes[id].tags;
					var tarr= tags.split(",");
					tarr.pop();
					$scope.tags[$scope.notes[id].id]=tarr;
					var update=$scope.notes[id].updatedAt;
					$scope.lastnoteupdateArr[$scope.notes[id].id]=$scope.convertTime(update);
					
					//console.log(tarr,"array");
					
				}
				console.log($scope.lastnoteupdateArr,"+++++++++++++updated array+++++++");
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		};
		
		/**
		*  create lirtature here
		*/
		$scope.createlitrature = function()
		{
			var projectid = localStorage.getItem("projectid");
			
			var litraturename = $('#my_litrature').val();
			var litratureabstarct = $('#litrature_abs').val();
			var litraturehighilight = $('#litrature_high').val();
			
			var tags = lit_tag;
			var post_type='';
			
			if(edit_entry=='') 
			{
				post_type = '/createlirature';
			}
			else
			{
				post_type = '/updatelitrature';
			}
			
			$http.post(post_type, {projectid: projectid, litraturename: litraturename, litratureabstarct: litratureabstarct, litraturehighilight: litraturehighilight, tags: tags, filename:filename,filepath:filepath,litartureid:edit_entry})
			 .success(function(data) {
				 
				 $scope.findlitrature();
				 
				$scope.createActivity("litrature",litraturename);
				 								
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
			 $('#my_litrature').val('');
				$('#litrature_abs').data("wysihtml5").editor.clear();
				$('#litrature_high').data("wysihtml5").editor.clear();
				$('.single_tag').remove();
				$('#get_data_lit').val('');
				lit_tag="";
				edit_entry='';
			
		};
		
		/**
		* find litrature list from here
		*/
		$scope.findlitrature= function()
		{
			var projectid = localStorage.getItem("projectid");
			$http.post('/findlitrature', {projectid: projectid})
			 .success(function(data) {
				 
				for(var i in data)
				{
					$scope.pro_lastupdate[projectid]=data.updatedAt;
				}
				$scope.litratures = data;	
				for( id in $scope.litratures )
				{
					var tags = $scope.litratures[id].tags;
					var tarr= tags.split(",");
					tarr.pop();
					console.log("tarrtarrtarr",tarr);
					$scope.lit_tag[$scope.litratures[id].id]=tarr;
					var update=$scope.litratures[id].updatedAt;
					$scope.lastlitupdateArr[$scope.litratures[id].id]=$scope.convertTime(update);
					
				}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		};
		
		/**
		** create protocol from here
		*/
		$scope.createprotocol = function()
		{
			var projectid = localStorage.getItem("projectid");
			
			var protocolname = $('#my_protocol').val();
			var protocolmaterail = $('#protocol_mat').val();
			var protocolprocedure = $('#protocol_pro').val();
			
			var tags = pro_tag;
			
			var post_type='';
			
			if(edit_entry=='') 
			{
				post_type = '/createprotocol';
			}
			else
			{
				post_type = '/updateprotocol';
			}			
			
			$http.post(post_type, {projectid: projectid, protocolname: protocolname, protocolmaterail: protocolmaterail, protocolprocedure: protocolprocedure, tags: tags, filename:filename,filepath:filepath,protocolid:edit_entry})
			 .success(function(data) {
				 
				 $scope.findprotocol();
				
				 	$scope.createActivity("protocol",protocolname );								
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
			 $('#my_protocol').val('');
				$('#protocol_mat').data("wysihtml5").editor.clear();
				$('#protocol_pro').data("wysihtml5").editor.clear();
				$('.single_tag').remove();
				$('#get_data_pro').val('');
				pro_tag="";
				edit_entry='';
		};
		
		/**
		* find protocols from here
		*/
		
		$scope.findprotocol = function()
		{
			var projectid = localStorage.getItem("projectid");
			
			$http.post('/findprotocol', {projectid: projectid})
			 .success(function(data) {
				 
				 console.log(data,"protocols realated this project");
				$scope.protocols = data;	
				for(var i in data)
				{
					$scope.pro_lastupdate[projectid]=data.updatedAt;
				}
				for( id in $scope.protocols )
				{
					var tags = $scope.protocols[id].tags;
					var tarr= tags.split(",");
					tarr.pop();
					console.log("tarrtarrtarr",tarr);
					$scope.pro_tag[$scope.protocols[id].id]=tarr;
					var update=$scope.protocols[id].updatedAt;
					$scope.lastproupdateArr[$scope.protocols[id].id]=$scope.convertTime(update);
				}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		};
		
		
		/**
		** create experiment from here
		*/
		$scope.createexperiment = function()
		{
			var projectid = localStorage.getItem("projectid");
			
			var expname = $('#my_experiment').val();
			var expbg = $('#experimet_bg').val();
			var expresult = $('#experimet_res').val();
			var expcon = $('#experimet_con').val();
			
			var tags = exp_tag;
			
			var post_type='';
			
			if(edit_entry=='') 
			{
				post_type = '/createexperiment';
			}
			else
			{
				post_type = '/updateexperiment';
			}					
			
			$http.post(post_type, {projectid: projectid, expname: expname, expbg: expbg, expresult: expresult,expcon:expcon, tags: tags, filename:filename,filepath:filepath,expid:edit_entry})
			 .success(function(data) {
				 				 
				 $scope.findexperiments();
				
				 $scope.createActivity("experiment",expname );							
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
			 $('#my_experiment').val('');
				$('#experimet_bg').data("wysihtml5").editor.clear();
				$('#experimet_res').data("wysihtml5").editor.clear();
				$('#experimet_con').data("wysihtml5").editor.clear();
				$('.single_tag').remove();
				$('#get_data_exp').val('');
				exp_tag="";
				edit_entry='';
		};
		
		/**
		* find protocols from here
		*/
		
		$scope.findexperiments = function()
		{
			var projectid = localStorage.getItem("projectid");
			
			$http.post('/findexperiments', {projectid: projectid})
			 .success(function(data) {
				 
				$scope.experiments = data;
				for(var i in data)
				{
					$scope.pro_lastupdate[projectid]=data.updatedAt;
				}
				for( id in $scope.experiments )
				{
					var tags = $scope.experiments[id].tags;
					var tarr= tags.split(",");
					tarr.pop();
					console.log("tarrtarrtarr",tarr);
					$scope.exp_tag[$scope.experiments[id].id]=tarr;
					var update=$scope.experiments[id].updatedAt;
					$scope.lastexpupdateArr[$scope.experiments[id].id]=$scope.convertTime(update);
				}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		};
		
		$scope.orderList = "createdAt";
		
		
		/**
		* create entry as per user actvity
		*/
		$scope.createActivity = function(act,acttype)
		{
			alert("start activity");
			
			var projectid = localStorage.getItem("projectid");

			var activity = "The "+ act+ " <a href='#c' data-toggle='tab' class='activity_link'>"+ acttype + "</a> was created by <a href='/profile' class='activity_link'>" + username+"  </a> in " + $scope.projectAtt.projectname;
			
			$http.post('/createactivity', {projectid: projectid,activity:activity})
			 .success(function(data) {
				 //console.log(data);
				$scope.findactivity();
				 
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		};
		
		/**
		* find activity
		*/
	
		$scope.findactivity = function()
		{
			var projectid = localStorage.getItem("projectid");
			
			$http.post('/findactivity', {projectid: projectid})
			 .success(function(data) {
				 
				$scope.activities = data;	
				for(var id in $scope.activities)
				{
					$scope.actArr[$scope.activities[id].id] = $scope.activities[id].activity;
				}
				console.log(data,"=====activities");
				
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
			
		};
		
		
		
		/**
		*  create comment from here
		*/
		
		$scope.createcommnets = function (actID)
		{
			var projectid = localStorage.getItem("projectid");
			var comm = $('#a'+actID).val();
			console.log(comm + '+++++++++++');
			
			$http.post('/createcomment', {projectid: projectid, actid:actID,comm:comm})
			 .success(function(data) {
				 $scope.findcomments(actID);
				 
				console.log("comments created");	
				$('#a'+actID).val('');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
			// $('#my_comment').val('');
		};
		
		/**
		* find comments from here
		*/
		$scope.findcomments = function(actID)
		{
			$http.post('/findcomments', {actid:actID})
			 .success(function(data) {
				 
				$scope.commArr[actID] = data;
								
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		}
		
}




