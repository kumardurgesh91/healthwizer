/**
 * ...
 * @author Vipul
 */
	
	 var projects;
		
		function createProject()
		{
			var projectname = $('#pro_name').val();
			var projectdesc = $('#pro_desc').val();
			var type = $('#pro_type').val();
			
			
			//alert(projectname + ' ' + projectdesc + ' ' +  type+' '+ username);
			
			//$('.library_list_cont tbody').append("<tr><td width='12'><input type='checkbox'></td><td width='300'>Portfolio X </td><td>Me</td><td>.....</td></tr>");
			socket.post('/project', {projectname: projectname, projectdesc: projectdesc, projecttype:type,username:username}, onResponse);
			
			//document.getElementById("projectform").reset();
			$('#projectform')[0].reset();
			$('#pro_desc').data("wysihtml5").editor.clear();
			//$('#pro_type').msDropDown().setValueByIndex ("selectedIndex", 0);
			/*var oHandler = $('#pro_type').msDropDown().data("dd");
			if(oHandler) {
				oHandler.set("selectedIndex", i);
			}*/

			
		}
		function onResponse(response)
		{
			console.log(response+"=======value of response=="+response.length);
			//alert("response :" + response.success);
			findProjects();	
			
		}
		
		$(document).ready(function(){
			
				
			findProjects();
			
			
			}); 
		
			
		
		
		function findProjects()
		{
			socket.post('/findproject', {username:username}, onFindProject);
		}
		
		function onFindProject(projects)
		{
			projects = projects;
			console.log(projects.length,"project find===",projects);
			//alert("hii"+projects[0].username);
			var no_projetct = projects.length;
			for(i=0; i< no_projetct; i++)
			{
				var time=projects[i].updatedAt;
				time=time.replace("T","  T  ");
				$('.library_list_cont table tbody').append('<tr><td width="12"><input type="checkbox"></td><td width="12"><img src="images/daslist_foldericon.png" alt=""></td><td width="300">' + projects[i].projectname + '</td><td>'+ projects[i].username + '</td><td>.....</td><td> '+ time + '</td></tr>');
			}
		}