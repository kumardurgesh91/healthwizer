'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.filter('htmlToPlaintext', function() {
    return function(htmlText) {
      return String(htmlText).replace(/<[^>]+>/gm, '');
    }
  }
)
.filter('filterLabComment', function(){
  return function(labcomments, id){
    var comments = new Array();
    angular.forEach(labcomments, function(value){
      if(value.labbookid == id) comments.push(value);
    });
    return comments;
  }
})
.filter('highlight', function () {
  return function (text, search, caseSensitive) {
    if ((search || angular.isNumber(search)) && text != null) {
      text = text.toString();
      search = search.toString();
      if (caseSensitive) {
        return text.split(search).join('<span class="ui-match">' + search + '</span>');
      } else {
        return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
      }
    } else if(text == null){
      return '';
    } else {
      return text;
    }
  };
})
.filter('filterLabitems', function(){
  return function(items,isDisplayStarredLab, isDisplayDraftLab, isDisplayArchivedLab){
    var labItems = new Array();
    angular.forEach(items, function(value){
      if(isDisplayStarredLab && isDisplayDraftLab && isDisplayArchivedLab){
        if(value.isStared && value.isDraft && value.isArchived)
          labItems.push(value);
      } else if(isDisplayStarredLab && isDisplayDraftLab){
        if(value.isStared && value.isDraft)
          labItems.push(value)
      } else if(isDisplayStarredLab && isDisplayArchivedLab){
        if(value.isStared && value.isArchived)
          labItems.push(value);
      } else if(isDisplayDraftLab && isDisplayArchivedLab){
        if(value.isDraft && value.isArchived)
          labItems.push(value);
      } else if(isDisplayStarredLab){
        if(value.isStared)
          labItems.push(value);
      } else if(isDisplayDraftLab){
        if(value.isDraft)
          labItems.push(value);
      } else if(isDisplayArchivedLab){
        if(value.isArchived)
          labItems.push(value);
      } else {
        if(!value.isDraft && !value.isArchived)
          labItems.push(value);
      }
    });
    return labItems;
  }
})
.filter('filesFilter', function(){
  
  return function(filename){
    var filesType = ['.jpg',  '.jpeg','.gif', '.xls', '.xlsx', '.doc', '.ppt', '.pdf', '.txt', '.mp3', '.mp4', '.html', '.htm'];
    var filesClass = [
      ' fa-file-image-o',
      ' fa-file-image-o',
      ' fa-file-image-o',
      ' fa-file-excel-o',
      ' fa-file-excel-o',
      ' fa-file-word-o',
      ' fa-file-powerpoint-o',
      ' fa-file-pdf-o',
      ' fa-file-text',
      ' fa-file-sound-o',
      ' fa-file-video-o',
      ' fa-html5',
      ' fa-html5'
      ];
    var isFound = false;
    var foundIndex;
    angular.forEach(filesType, function(value, index){
      if(filename.toLowerCase().indexOf(value) >= 0){
        foundIndex = index;
        isFound = true;
      }
    });
    if(isFound){
      return filesClass[foundIndex];
    } else {
      return 'fa-file-o';
    }
  }
})
.service('sharedProperties', function() {
    var projectAtt ;
    return {
        getProjectAtt: function() {
            return projectAtt;
        },
        setProjectAtt: function(value) {
            projectAtt = value;
        }
    }
})
.controller('mainController', function($scope, $window, $location,$http, $anchorScroll, sharedProperties) {
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
    $scope.discussionComments = new Array();
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
    $scope.mailview = false;
    var isFileData;
    $scope.searchSuggestions =  [];
    $scope.sampleTags = ['c++', 'java', 'php', 'coldfusion', 'javascript', 'asp', 'ruby', 'python', 'c', 'scala', 'groovy', 'haskell', 'perl', 'erlang', 'apl', 'cobol', 'go', 'lua'];
    $scope.draftToCompose;
    $scope.isDraftToCompose = false;
    $scope.selectedInboxEmail;
    $scope.selectedSentEmail;
    $scope.selectedDraftEmail;
    $scope.selectAllInbox = {checked : false};
    $scope.selectAllSent = {checked : false};
    $scope.selectAllDraft = {checked : false};
    $scope.selectAllTrash = {checked : false};
    $scope.selectAllImportant = {checked : false};
    $scope.favourites = false;
    $scope.isReply = false;
    $scope.isForwared = false;
    $scope.forwaredEmail ;
    $scope.isStarsLabBook = false;
    $scope.isDisplayStarredLab = false;
    $scope.isDisplayDraftLab = false;
    $scope.isDisplayArchivedLab = false;
    $scope.gridView = false;
    $scope.projectFileId;
    $scope.projectLibraryId;
    $scope.searchQuery;
    $scope.mailPageSize = 10;
    $scope.currentMailPage = 0;
    $scope.currentSentPage = 0;
    $scope.currentDraftPage = 0;
    $scope.currentImportantPage = 0;
    $scope.currentTrashPage = 0;

    $scope.fileuploads= [];
    $scope.filesType = ['.jpg', '.JPG', '.jpeg', '.JPEG'];

    $scope.chatting = { isChatting : false, chatUser : "", chat : [], message : ""};

    jQuery.getScript('//connect.facebook.net/en_UK/all.js', function(){
      window.FB.init({
        appId: '580086595433795',
      });     
    });
    $scope.fbshare = function(){
      FB.ui({
        method: 'feed',
         name: 'Health Wizer',
         link: 'http://www.healthwizer.com',
         caption: 'Health Wizer',
         description: $scope.projectAtt.projectdesc,
         message: ''
      }, function(response){});
    }

    /**
    * Create New Task
    **/

    $scope.createTask = function(){
      var task_project = $("#task_project").val();
      var task_title = $("#task_title").val();
      var task_description = $("#task_description").val();
      var task_user = $("#task_user").val();
      var task_start_date = $("#task_start_date").val();
      var task_end_date = $("#task_end_date").val();

      $http.post('/createTask', {projectid : task_project, title : task_title, description : task_description, assignedto : task_user, startdate : task_start_date, enddate : task_end_date})
      .success(function(response){
        if(response.message == 'success'){
          $scope.task_message = "Task created.";
          $scope.task_class = 'success';
          $scope.resetTaskForm();
        } else {
          $scope.task_class = 'error';
          $scope.task_message = response.message;
        }
        setTimeout(function() { console.log('completed'); $(".alert").fadeOut(1000); }, 5000);
      })
      .error(function(error){
        console.log('Error'+error);
        $scope.task_class = 'error';
        $scope.task_message = "Please try again.";
      });
    }

    $scope.updateTask = function(){
      console.log('in update');
      var task_project = $("#task_project").val();
      var task_title = $("#task_title").val();
      var task_description = $("#task_description").val();
      var task_user = $("#task_user").val();
      var task_start_date = $("#task_start_date").val();
      var task_end_date = $("#task_end_date").val();

      $http.post('/updateTask', {id : $scope.editedTask.id, projectid : parseInt(task_project), title : task_title, description : task_description, assignedto : task_user, startdate : task_start_date, enddate : task_end_date})
      .success(function(response){
        if(response.message == 'success'){
          $scope.task_message = "Task created.";
          $scope.task_class = 'success';
          $scope.getCreatedTasks();

          setTimeout(function() { 
          $(".alert").fadeOut(1000);
          $scope.changePath('/view_task', $scope.editedTask.id, 1);
        }, 2000);
        } else {
          $scope.task_class = 'error';
          $scope.task_message = response.message;
        }
          
      })
      .error(function(error){
        console.log('Error'+error);
        $scope.task_class = 'error';
        $scope.task_message = "Please try again.";
      });
    }

    $scope.initEditedTask = function(id){
      console.log('in init');
      angular.forEach($scope.createdTasks, function(value, index){
          if(value.id == id){
            $scope.editedTask = value;
            $location.path('/edit_task');
          }
        });
    }

    $scope.editTask = function(){

      setTimeout(function(){
        $("#task_project").val(typeof $scope.editedTask.project != 'undefined' ? $scope.editedTask.project.id : '');
        $("#task_title").val($scope.editedTask.title != 'undefined' ? $scope.editedTask.title : '');
        $("#task_description").val($scope.editedTask.description != 'undefined' ? $scope.editedTask.description : '');
        $("#task_user").val(typeof $scope.editedTask.assignedto != 'undefined' ? $scope.editedTask.assignedto.id : '');
        $("#task_start_date").val(typeof $scope.editedTask.startdate.split('T')[0] != 'undefined' ? $scope.editedTask.startdate.split('T')[0] : '');
        $("#task_end_date").val($scope.editedTask.enddate.split('T')[0] != 'undefined' ? $scope.editedTask.enddate.split('T')[0] : '');
        }, 1000);
    }

    $scope.changePath = function(path, id, type){
      $location.path(path);
      if(path == '/view_task' && type == 1) {
        $scope.isTaskCreate = true;
        angular.forEach($scope.createdTasks, function(value, index){
          if(value.id == id){
            $scope.currentViewedTask = value;
            console.log(JSON.stringify($scope.currentViewedTask));
          }
        });
      } else if(path == '/view_task' && type == 2) {
        $scope.isTaskCreate = false;
        angular.forEach($scope.myTasks, function(value, index){
          if(value.id == id){
            $scope.currentViewedTask = value;
            if(!$scope.currentViewedTask.detail.isSeen) {
              $http.post('/markIsSeenTask', {id : $scope.currentViewedTask.detail.id})
              .success(function(res){
                $scope.getUnSeenTasksCount();
              })
              .error(function(error){
                console.log(error);
              });
            }
          }
        });
      }
    }

    $scope.markTaskAsDoneUndone = function(id, assid, status){
      $http.post('/markTaskAsDoneUndone', {assid : assid, status : status})
      .success(function(res){
        if(res.message == 'success'){
          if(status){
            $scope.currentViewedTask.detail.taskcompleted = 100;
            $scope.currentViewedTask.detail.status = 'Completed';
            $scope.currentViewedTask.detail.isCompleted = true;
          } else {
            $scope.currentViewedTask.detail.taskcompleted = 0;
            $scope.currentViewedTask.detail.status = 'Uncompleted';
            $scope.currentViewedTask.detail.isCompleted = false;
          }
        } else {
          console.log(res);
        }
      })
      .error(function(error){
        console.log(error);
      });
    }

    $scope.getMyTask = function(){
      $http.get('/getMyTask')
      .success(function(res){
        if(res.message == 'success'){
          $scope.myTasks = res.myTask;
          console.log($scope.myTasks);
        } else {
          console.log(res);
        }
      })
      .error(function(error){
        console.log(error);
      });
    }

    $scope.deleteTask = function(id){
      $http.post('/deleteTask', {id : id})
      .success(function(res){
        if(res.message = 'success'){
          $location.path('/all_task');
        } else {
          console.log(res);
        }
      })
    }

    $scope.getCreatedTasks = function(){
      $http.get('/getCreatedTasks')
      .success(function(response){
        if(response.message == 'success'){
          $scope.createdTasks = response.createdTasks;
        } else {
          console.log(response);
        }
      })
      .error(function(error){
        console.log('Error' + error);
      });
    }

    $scope.resetTaskForm = function(){

      $("#task_project").val('');
      $("#task_title").val('');
      $("#task_description").val('');
      $("#task_user").val('');
      $("#task_start_date").val('');
      $("#task_end_date").val('');
    }

    $scope.getVisibleMails = function(folder){  
      if(folder == "inbox"){
        var v = "";
        if($scope.inbox.length == 0){
          v = "0 - ";
        }else{
          v = ((this.currentMailPage*$scope.mailPageSize)+1)+" - ";
        }

        if((this.currentMailPage+1)*$scope.mailPageSize <= $scope.inbox.length){
          v = v+(this.currentMailPage+1)*$scope.mailPageSize;
        }
        else
          v = v+" "+$scope.inbox.length;
        v = v+" of "+$scope.inbox.length;
        return v;
      }      
      else if(folder == "sent"){
        var v = "";
        if($scope.sent.length == 0){
          v = "0 - ";
        }else{
          v = ((this.currentSentPage*$scope.mailPageSize)+1)+" - ";
        }

        if((this.currentSentPage+1)*$scope.mailPageSize <= $scope.sent.length){
          v = v+(this.currentSentPage+1)*$scope.mailPageSize;
        }
        else
          v = v+" "+$scope.sent.length;
        v = v+" of "+$scope.sent.length;
        return v;
      }
      else if(folder == "drafts"){
        var v = "";
        if($scope.drafts.length == 0){
          v = "0 - ";
        }else{
          v = ((this.currentDraftPage*$scope.mailPageSize)+1)+" - ";
        }

        if((this.currentDraftPage+1)*$scope.mailPageSize <= $scope.drafts.length){
          v = v+(this.currentDraftPage+1)*$scope.mailPageSize;
        }
        else
          v = v+" "+$scope.drafts.length;
        v = v+" of "+$scope.drafts.length;
        return v;
      }
      else if(folder == "trash"){
        var v = "";
        if($scope.trash.length == 0){
          v = "0 - ";
        }else{
          v = ((this.currentTrashPage*$scope.mailPageSize)+1)+" - ";
        }

        if((this.currentTrashPage+1)*$scope.mailPageSize <= $scope.trash.length){
          v = v+(this.currentTrashPage+1)*$scope.mailPageSize;
        }
        else
          v = v+" "+$scope.trash.length;
        v = v+" of "+$scope.trash.length;
        return v;
      }
      else if(folder == "important"){
        var v = "";
        if($scope.getImportant().length == 0){
          v = "0 - ";
        }else{
          v = ((this.currentImportantPage*$scope.mailPageSize)+1)+" - ";
        }

        if((this.currentImportantPage+1)*$scope.mailPageSize <= $scope.getImportant().length){
          v = v+(this.currentImportantPage+1)*$scope.mailPageSize;
        }
        else
          v = v+" "+$scope.getImportant().length;
        v = v+" of "+$scope.getImportant().length;
        return v;
      }
    }

    $scope.search = function(type){
      var s, url;
      if(type == 0){
        s = $("#searchQuery").val();
        $scope.searchIn = '';
        $scope.searchQuery = s;
        url = '/search?q='+s;
      } else if(type == 1){
        $scope.searchIn = 'in project '+$scope.projectAtt.projectname;
        s = $("#searchQueryInProject").val();
        $scope.searchQuery = s;
        url = '/search?projectId='+$scope.projectAtt.id+'&q='+s;
      }
      $http.get(url)
      .success(function(res){
        $scope.searchresult = res.result;
      })
      .error(function(){
        console.log(error);
      });
    }

    $scope.displayStaredLabItems = function(){
      if($scope.isDisplayStarredLab){
        $scope.isDisplayStarredLab = false;
      } else {
        $scope.isDisplayStarredLab = true;
      }
      $scope.isDisplayDraftLab = false;
      $scope.isDisplayArchivedLab = false;
    }

    $scope.displayDraftLadItems = function(){
      if($scope.isDisplayDraftLab){
        $scope.isDisplayDraftLab = false;
      } else{
        $scope.isDisplayDraftLab = true;
      }
      $scope.isDisplayStarredLab = false;
      $scope.isDisplayArchivedLab = false
    }

    $scope.displayArchivedItems = function(){
      if($scope.isDisplayArchivedLab){
        $scope.isDisplayArchivedLab = false;
      } else{
        $scope.isDisplayArchivedLab = true;
      }
      $scope.isDisplayDraftLab = false;
      $scope.isDisplayStarredLab = false;
    }

    $scope.resetDisplayLabItems = function(){
      $scope.isDisplayStarredLab = false;
      $scope.isDisplayDraftLab = false;
      $scope.isDisplayArchivedLab = false;
    }


    $scope.addFavourites = function(){
      if($scope.projectAtt.id){
        $http.post('/addFavourites', {projectid : $scope.projectAtt.id})
        .success(function(response){
          if(response.message == 'success'){
            $scope.favourites = true;
          }
        })
        .error(function(error){
          console.log("error "+error);
        })
      } else {
        console('can not add as favourites')
      }
    }
    $scope.startChat = function(user){      
      if($scope.chatting.chatUser=="" || user.id != $scope.chatting.chatUser.id){
        $scope.chatting = { isChatting : true, chatUser : user, chat : [], message : ""};
        $http.post("/getInstantMessages", {chatUserId : user.id})
        .success(function(data){
          if(data.message == "success")
            $scope.chatting.chat = data.chat;
        })
        .error(function(error){

        });
      }
    }

    $scope.sendIm = function(){
      if($scope.chatting.message.trim()!=""){
        $http.post("/sendInstantMessages", {chatUserId : $scope.chatting.chatUser.id, message : $scope.chatting.message})
        .success(function(data){
          if(data.message == "success")
            $scope.chatting.message = "";
            $scope.chatting.chat = data.chat;
        })
        .error(function(error){

        });
      }
    }

    $scope.isFavourites = function(){
      if($scope.projectAtt.id){
        $http.post('/isFavourites', {projectid : $scope.projectAtt.id})
        .success(function(response){
          if(response.message == 'success'){
            $scope.favourites = response.favourites;
          } else {
            console.log(response);
          }
        })
        .error(function(error){
          console.log("Error "+error);
        });
      } else {
        console.log('can not get');
      }
    }

    $scope.archivedlab = function(id, type){
      $http.post('/archivedlab', {id : id, type : type})
      .success(function(res){
        if(res.message == 'success'){
          $scope.findnote();
          $scope.findlitrature();
          $scope.findprotocol();
          $scope.findexperiments();
        } else {
          console.log('error');
        }
      })
      .error(function(error){
        console.log("Error "+error);
      });
    }

    $scope.showItem = function(object){
      if(!$scope.isStarsLabBook){
        $("#"+object).slideToggle();
        $scope.isStarsLabBook = false;
      }
    }

    $scope.getIconClass =  function(filename){
      var filesType = ['.jpg',  '.jpeg','.gif', '.xls', '.xlsx', '.doc', '.ppt', '.pdf', '.txt', '.mp3', '.mp4', '.html', '.htm'];
      var filesClass = [
        ' fa-file-image-o',
        ' fa-file-image-o',
        ' fa-file-image-o',
        ' fa-file-excel-o',
        ' fa-file-excel-o',
        ' fa-file-word-o',
        ' fa-file-powerpoint-o',
        ' fa-file-pdf-o',
        ' fa-file-text',
        ' fa-file-sound-o',
        ' fa-file-video-o',
        ' fa-html5',
        ' fa-html5'
        ];
      var isFound = false;
      var foundIndex;
      angular.forEach(filesType, function(value, index){
        if(filename.toLowerCase().indexOf(value) >= 0){
          foundIndex = index;
          isFound = true;
        }
      });
      if(isFound){
        return filesClass[foundIndex];
      } else {
        return 'fa-file-o';
      }
    }
    
    $scope.removeFavourites = function(){
      if($scope.projectAtt.id){
        $http.post('/removeFavourites', {projectid : $scope.projectAtt.id})
        .success(function(response){
          if(response.message == 'success'){
            $scope.favourites = false;
          }
        })
        .error(function(error){
          console.log("error "+error);
        })
      } else {
        console('can not add as favourites')
      }
    }
    /**
     * Retriving All project ides from projects.
     */
    $scope.initProjectIds = function(){
      var selectedProject = new Array();
      for(var j = 0; j < $scope.projects.length; j++){
        selectedProject.push({id : $scope.projects[j].id, status : false});
      }
      $scope.selectedProject = selectedProject;
    }

    /**
     * Initlizing mail id to select checkboxs
     */
    $scope.initInboxMailIds = function(){
      var selectedInboxEmail = new Array();
      for(var j = 0; j < $scope.inbox.length; j++){
        //selectedInboxEmail.push(id : {id : $scope.inbox[j].mail.id, status : false});
        selectedInboxEmail["mail"+$scope.inbox[j].mail.id] = false;
      }
      $scope.selectedInboxEmail = selectedInboxEmail;
    }
    $scope.initSentMailIds = function(){
      var selectedSentEmail = new Array();
      for(var j = 0; j < $scope.sent.length; j++){
        selectedSentEmail["mail"+$scope.sent[j].mail.id] = false;
      }
      $scope.selectedSentEmail = selectedSentEmail;
    }
    $scope.initDraftMailIds = function(){
      var selectedDraftEmail = new Array();
      for(var j = 0; j < $scope.drafts.length; j++){
        selectedDraftEmail["mail"+$scope.drafts[j].id] = false;
      }
      $scope.selectedDraftEmail = selectedDraftEmail;;
    }

    $scope.initTrashMailIds = function(){
      var selectedTrashEmail = new Array();
      for(var j = 0; j < $scope.trash.length; j++){
        selectedTrashEmail[j] = false;
      }
      $scope.selectedTrashEmail = selectedTrashEmail;;
    }

    $scope.initImportantMailIds = function(){
      var selectedImportantMail = new Array();
    }

    /**
     * Selecting All Inbox mails
     */

     $scope.selectAllInboxMail = function(){
      if($scope.selectAllInbox.checked){
        var selectedInboxEmail = new Array();
        for(var j = 0; j < $scope.inbox.length; j++){
          //selectedInboxEmail.push(id : {id : $scope.inbox[j].mail.id, status : false});
          selectedInboxEmail["mail"+$scope.inbox[j].mail.id] = true;
        }
        $scope.selectedInboxEmail = selectedInboxEmail;
      } else {
        var selectedInboxEmail = new Array();
        for(var j = 0; j < $scope.inbox.length; j++){
          //selectedInboxEmail.push(id : {id : $scope.inbox[j].mail.id, status : false});
          selectedInboxEmail["mail"+$scope.inbox[j].mail.id] = false;
        }
        $scope.selectedInboxEmail = selectedInboxEmail;
      }
     }

     $scope.selectAllImportantMail = function(){
      if($scope.selectAllImportant.checked){
        var selectedInboxEmail = new Array();
        for(var j = 0; j < $scope.inbox.length; j++){
          if($scope.inbox[j].details.isImportant)
            selectedInboxEmail["mail"+$scope.inbox[j].mail.id] = true;
        }
        $scope.selectedInboxEmail = selectedInboxEmail;
      } else {
        var selectedInboxEmail = new Array();
        for(var j = 0; j < $scope.inbox.length; j++){
          if($scope.inbox[j].details.isImportant)
            selectedInboxEmail["mail"+$scope.inbox[j].mail.id] = false;
        }
        $scope.selectedInboxEmail = selectedInboxEmail;
      }
     }

     $scope.selectAllTrashMail = function(){
      if($scope.selectAllTrash.checked){
        for(var j = 0; j < $scope.trash.length; j++){
          $scope.selectedTrashEmail[j] = true;
        }
      } else {
        for(var j = 0; j < $scope.trash.length; j++){
          $scope.selectedTrashEmail[j] = false;
        }
      }
     }

     /**
     * Selecting All Sent Mails
     */

     $scope.selectAllSentMail = function(){
      if($scope.selectAllSent.checked){
        var selectedSentEmail = new Array();
        for(var j = 0; j < $scope.sent.length; j++){
          //selectedInboxEmail.push(id : {id : $scope.inbox[j].mail.id, status : false});
          selectedSentEmail["mail"+$scope.sent[j].mail.id] = true;
        }
        $scope.selectedSentEmail = selectedSentEmail;
      } else {
        var selectedSentEmail = new Array();
        for(var j = 0; j < $scope.sent.length; j++){
          //selectedInboxEmail.push(id : {id : $scope.inbox[j].mail.id, status : false});
          selectedSentEmail["mail"+$scope.sent[j].mail.id] = false;
        }
        $scope.selectedSentEmail = selectedSentEmail;
      }
     }

     /**
     * Selecting All drafts Mails
     */

     $scope.selectAllDraftMail = function(){
      if($scope.selectAllDraft.checked){
        var selectedDraftEmail = new Array();
        for(var j = 0; j < $scope.drafts.length; j++){
          selectedDraftEmail["mail"+$scope.drafts[j].id] = true;
        }
        $scope.selectedDraftEmail = selectedDraftEmail;
      } else {
         var selectedDraftEmail = new Array();
        for(var j = 0; j < $scope.drafts.length; j++){
          selectedDraftEmail["mail"+$scope.drafts[j].id] = false;
        }
        $scope.selectedDraftEmail = selectedDraftEmail;
      }
     }

     /**
      * Deleting Inbox mail
      */

      $scope.deleteSelectedInboxMail = function(){
        var selectedInboxEmail = new Array();
        for(var j = 0; j < $scope.inbox.length; j++){
          if($scope.selectedInboxEmail['mail'+$scope.inbox[j].mail.id]){
            selectedInboxEmail.push($scope.inbox[j].mail.id);
          }
        }
        var obj = new Object();
        obj.mails = selectedInboxEmail;
        $http.post('/deleteSelectedInboxMail', {mails : obj})
        .success(function(response){
          $scope.getEmails();
        })
        .error(function(response){
          console.log('Error' + response);
        });
      }

      $scope.markAsReadEmail = function(type){
        var selectedMail = new Array();
        if(type == 1){
          var j = -1;
          var next = function(){
            j++;
            if($scope.inbox.length > j){
              if($scope.selectedInboxEmail['mail'+$scope.inbox[j].mail.id]){
              $http.post('/setMailAsRead', {id:$scope.inbox[j].details.id})
              .success(function(data) {
                next();
              })
              .error(function(data) {
                console.log('Error: ' + data);
                next();
              }); 
            } else {
              next();
            }
            } else {
              $scope.getEmails();
            }
          }
          next();
        }
      }


      $scope.markAsUnreadEmail = function(type){
        var selectedMail = new Array();
        if(type == 1){
          var j = -1;
          var next = function(){
            j++;
            if($scope.inbox.length > j){
              if($scope.selectedInboxEmail['mail'+$scope.inbox[j].mail.id]){
              $http.post('/setMailAsUnread', {id:$scope.inbox[j].details.id})
              .success(function(data) {
                next();
              })
              .error(function(data) {
                console.log('Error: ' + data);
                next();
              }); 
            } else {
              next();
            }
            } else {
              $scope.getEmails();
            }
          }
          next();
        }
      }

      $scope.deleteSelectedTrashMail = function(){
        var selectedTrashEmail = new Array();
        for(var k =0; k < $scope.trash.length; k++){
          if($scope.selectedTrashEmail[k]) {
            selectedTrashEmail.push($scope.trash[k]);
          }
        }
        $http.post('/deleteSelectedTrashMail', {mails : JSON.stringify(selectedTrashEmail)})
        .success(function(response){
          $scope.getEmails();
        })
        .error(function(error){
          console.log('Error ' + error);
        });
      }


      $scope.restoreSelectedTrashMail = function(){
        var selectedTrashEmail = new Array();
        for(var k =0; k < $scope.trash.length; k++){
          if($scope.selectedTrashEmail[k]) {
            selectedTrashEmail.push($scope.trash[k]);
          }
        }
        $http.post('/restoreSelectedTrashMail', {mails : JSON.stringify(selectedTrashEmail)})
        .success(function(response){
          $scope.getEmails();
        })
        .error(function(error){
          console.log('Error ' + error);
        })
      }

      /**
      * Deleting Sent mail
      */

      $scope.deleteSelectedSentMail = function(){
        var selectedSentEmail = new Array();
        for(var j = 0; j < $scope.sent.length; j++){
          if($scope.selectedSentEmail['mail'+$scope.sent[j].mail.id]){
            selectedSentEmail.push($scope.sent[j].mail.id);
          }
        }
        var obj = new Object();
        obj.mails = selectedSentEmail;
        $http.post('/deleteSelectedSentMail', {mails : obj})
        .success(function(response){
          $scope.getEmails();
        })
        .error(function(response){
          console.log('Error' + response);
        });
      }

      /**
       * Deleting Draft mail
       */

       $scope.deleteSelectedDraftMail = function(){
        var selectedDraftEmail = new Array();
        for(var j = 0; j < $scope.drafts.length; j++){
          if($scope.selectedDraftEmail['mail'+$scope.drafts[j].id]){
            selectedDraftEmail.push($scope.drafts[j].id);
          }
        }
        var obj = new Object();
        obj.mails = selectedDraftEmail;
        $http.post('/deleteSelectedDraftMail', {mails : obj})
        .success(function(response){
          $scope.getEmails();
        })
        .error(function(response){
          console.log('Error' + response);
        });
       }

       $scope.deleteInboxMail = function(id){
        if(id){
          $http.post('/deleteInboxMail', {id : id})
          .success(function(res){
            if(res.message == 'success'){
              $scope.getEmails();
            } else {
              console.log('not deleted');
            }
          })
          .error(function(error){
            console.log('Error ' + error);
          });
        } else {
          console.log('can not be deleted');
        }
       }

       $scope.deleteSentMail = function(id){
        if(id){
          $http.post('/deleteSentMail', {id : id})
          .success(function(res){
            if(res.message == 'success'){
              $scope.getEmails();
            } else {
              console.log('not deleted');
            }
          })
          .error(function(error){
            console.log('Error ' + error);
          });
        } else {
          console.log('can not be deleted');
        }
       }

       $scope.deleteTrashMail = function(mail){
        if(mail){
          $http.post('/deleteTrashMail', {mail : mail})
          .success(function(res){
            if(res.message == 'success'){
              $scope.getEmails();
            } else {
              console.log(res);
            }
          })
          .error(function(error){
            console.log('Error' + error);
          });
        } else {

        }
       }

    // $scope.selectProject = function(id){

    // }

    $scope.makeImportant = function(id){
      if(id){
        $http.post('/makeImportant', {id : id})
        .success(function(res){
            if(res.message == 'success'){
            $('#imp'+id).addClass('inbox-started');
          } else {
            console.log('not success');
          }
        });
      } else {
        console.log('id not found');
      }
    }

    $scope.removeImportant = function(id){
      if(id){
        $http.post('/removeImportant', {id : id})
        .success(function(res){
            if(res.message == 'success'){
            $('#imp'+id).removeClass('inbox-started');
          } else {
            console.log('not success');
          }
        });
      } else {
        console.log('id not found');
      }
    }

    $scope.getDiscussion = function(){
      $http.post('/getDiscussions', {projectid : $scope.projectAtt.id})
      .success(function(data) {
          if(data.message == "success")
            $scope.discussions = data.discussions;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      }); 
    }

    /**
     * Adding Files In Multiple Project(Project page).
     */
    $scope.uploadFilesInMultipleProject = function(){
      var files = $("#files_in_multiple_projects")[0].files;

      var formData = new FormData();

      for (var i=0; i < files.length; i++){
        formData.append('projectfile', files[i]);
      }
      var isAnyProjectSelected = false;
      for(var j = 0; j < $scope.selectedProject.length; j++){
        if($scope.selectedProject[j].status){
          formData.append('projects', $scope.selectedProject[j].id);
          isAnyProjectSelected = true;
        }
      }
      if(isAnyProjectSelected){
        $http.post("/uploadFilesInMultipleProject", formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        })
        .success(function(data) {        
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      } else {
        console.log("Please select project first");
      }
    }

    /**
     * Adding colaborators in multiple projects
     */ 

    $scope.addColaboratorInMultipeProject = function(){

      var isAnyProjectSelected = false;
      var projects = new Array();
      for(var j = 0; j < $scope.selectedProject.length; j++){
        if($scope.selectedProject[j].status){
          projects.push($scope.selectedProject[j].id)
          isAnyProjectSelected = true;
        }
      }
      var proj = new Object();
      proj.projects = projects;
      if(isAnyProjectSelected){
        $http.post('/addColaboratorInMultipeProject', {projects:proj, users : $("#addColaborator #invite_tags").val(), subject : $("#addColaborator input#message_subject").val(), message : $("#addColaborator textarea#message_body").val()})
        .success(function(data) {
          $("#closeaddcolaboration").click();
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      } else {
        console.log("Please select project first");
      }
    }

    /**
     * Getting Colaborators Users According to project
     */
     $scope.getColaboraters = function(){
      if($scope.projectAtt.id){
        $http.post('/getColaboraters', {projectid : $scope.projectAtt.id})
        .success(function(data) {
            if(data.message == "success")
              $scope.colaborators = data.colaborators;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        }); 
      } else {
        console('project not initlize');
      }
     }

     /**
      * Getting all coments on project
      */

      $scope.getAllCommentOnProject = function(){
        if($scope.projectAtt.id){
          $http.post('/getAllCommentOnProject', {projectid : $scope.projectAtt.id})
          .success(function(data) {
              if(data.message == "success")
                $scope.totalComments = data.totalComments;
          })
          .error(function(data) {
            console.log('Error: ' + data);
          }); 
        } else {
          console('project not initlize');
        }
      }

    /**
     * Initlize user
     */
     $scope.initUser = function(user){
      $scope.user = user;
      $scope.getColaborations();
      $http.post('/users', {})
      .success(function(data) {
        if(data.message == "success")
          $scope.users = data.users;
          $scope.users.push(user);
          var usersuggestions = new Array();
          angular.forEach(data.users, function(user, key) {            
            if(user.email!=$scope.user.email)
              usersuggestions[key] = user.email;
          });
          $scope.usersuggestions = usersuggestions;
          $scope.getEmails();
          $scope.getUnSeenTasksCount();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });       
    };
    var noteTypes =  {
      'RAW DATA' : 1,
      'PROCESSED DATA' : 2,
      'FINAL DATA' : 3
    };

    $scope.setProjectAtt = function(project){
      alert(project.projectname);
    }

    $scope.getUnSeenTasksCount = function(){
      $http.get('/getUnSeenTasks')
      .success(function(res){
        if(res.message == 'success'){
          $scope.unSeenTasks = res.unSeenTasks;
          console.log($scope.unSeenTasks);
        } else {
          console.log(res);
        }
      })
      .error(function(error){
         console.log(error);
      })
    }
    $scope.findNewsFeeds = function(){
      $http.post('/findactivity', {})
       .success(function(data) {
        if(data.message = "success")
        $scope.newsFeeds = data.allActivities; 
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

      // $http.post('/findNewsFeeds', {})
      // .success(function(data) {
      //   if(data.message == "success")
      //     $scope.recentLabActivities = data.newsfeeds;
      //   else
      //     alert(data.message);
      // })
      // .error(function(data) {
      //   console.log('Error: ' + data);
      // });
    };

    $scope.gotoDiscussion = function(){
      $("#discussion").trigger("click");
    };

    $scope.resetComposeMail = function(){
    
        $scope.mailAttachements = [];
        $scope.isForwared = false;
        $scope.forwaredEmail = '';
        $scope.isDraftToCompose = false;
        $scope.draftToCompose = [];
    }
    $scope.sendEmail = function(){
      var fd = new FormData();
      for (var i=0; i < $("#attachments")[0].files.length; i++){
        fd.append('attachments', $("#attachments")[0].files[i]);
      }
      fd.append('to',$('#to').val());
      fd.append('cc',$('#cc').val());
      fd.append('bcc',$('#bcc').val());
      fd.append('subject',$('#subject').val());
      fd.append('mail_body',$('#mail_body').val());

      if($scope.isDraftToCompose && $scope.draftToCompose.id){
        fd.append('isForwared', false);
        fd.append('draftMailId', $scope.draftToCompose.id);
        $scope.isDraftToCompose = false;
        $scope.draftToCompose = [];
      } else if($scope.isForwared && $scope.mailAttachements.length >0){
        fd.append('draftMailId', '');
        fd.append('fwdatt', new Object().fwdatt = JSON.stringify($scope.mailAttachements));
        fd.append('isForwared', true);
        $scope.mailAttachements = [];
        $scope.isForwared = false;
        $scope.forwaredEmail = '';
      } else {
        fd.append('draftMailId', '');
        fd.append('isForwared', false);
        $scope.mailAttachements = [];
        $scope.isForwared = false;
        $scope.forwaredEmail = '';
        $scope.isDraftToCompose = false;
        $scope.draftToCompose = [];
      } 

      $http.post("/sendEmail", fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      })
      .success(function(data) {        
        
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };

    /**
     * Saving Draft Email 
     */

    $scope.draftEmail = function(){
      if($('#to').val() != '' || $('#cc').val() != '' || $('#subject').val() != '' || $('#bcc').val() != '' || $('#mail_body').val() != '' || $scope.draftToCompose.id != ''){
        var fd = new FormData();
        if($("#attachments")[0].files) {
          for (var i=0; i < $("#attachments")[0].files.length; i++){
            fd.append('attachments', $("#attachments")[0].files[i]);
          }
        }
        
        fd.append('to',$('#to').val());
        fd.append('cc',$('#cc').val());
        fd.append('bcc',$('#bcc').val());
        fd.append('subject',$('#subject').val());
        fd.append('mail_body',$('#mail_body').val());
        //checking new draft or older draft mail
        if($scope.isDraftToCompose && $scope.draftToCompose.id){
          fd.append('draftMailId', $scope.draftToCompose.id);
          $scope.isDraftToCompose = false;
          $scope.draftToCompose = [];
        } else {
          fd.append('draftMailId', '');
        }

        $http.post("/draftEmail", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data) {        
          $scope.mailAttachements = [];
          $scope.isForwared = false;
          $scope.forwaredEmail = '';
          $scope.isDraftToCompose = false;
          $scope.draftToCompose = [];
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      }
    }

    /**
     * Composing Draft Email
     */

     $scope.initDraftMail = function(id){
      angular.forEach($scope.drafts, function(val, ind){
        if(val.id == id){
          $scope.draftToCompose = val;
          $scope.isDraftToCompose = true;
          // $scope.composeDraftMail = val;
          // $('#to').val(val.to);
          // $('#cc').val(val.cc);
          // $('#bcc').val(val.bcc);
          // $('#subject').val(val.subject);
          // $('#mail_body').val(val.body);
        }
      });
     }

     $scope.initForwaredMail = function(mail){
      $scope.forwaredEmail = mail;
      $scope.isForwared = true;
      // angular.forEach($scope.inbox, function(val, ind){
      //   if(val.id == id){
      //     $scope.forwaredEmail = val;
      //     $scope.isForwared = true;
      //     console.log($scope.forwaredEmail);
      //   }
      // });
     }

     /**
      *  Reply Mail
      */

    $scope.replyMail = function(email, subject){
      $scope.replyEmail = email;
      $scope.replySubject = subject;
      $scope.isReply = true;
    }

     /**
      * Composing draft mail
      */

    $scope.composeDraftMail = function(){
      if($scope.isDraftToCompose && $scope.draftToCompose){
        var emailData = $scope.draftToCompose;
        var toArray = emailData.to.split(",");
        //$("#to_tag").tagit('removeAll');
        angular.forEach(toArray, function(value, key) {
          $("#to_tag").tagit('createTag', value.trim());
        });
        var ccArray = emailData.cc.split(',');
        angular.forEach(ccArray, function(value, key){
          $(this).hide(); $('#cc').parent().removeClass('hidden'); $('#cc').focus();
          $("#cc_tag").tagit('createTag', value.trim());
        });
        var bccArray = emailData.cc.split(',');
        angular.forEach(bccArray, function(value, key){
          $(this).hide(); $('#bcc').parent().removeClass('hidden'); $('#bcc').focus();
          $("#bcc_tag").tagit('createTag', value.trim());
        });
        $("#subject").val(emailData.subject);
        $("#mail_body").data("wysihtml5").editor.setValue(emailData.body);

      } else if($scope.isReply){
        $("#to_tag").tagit('createTag', $scope.replyEmail);
        $("#subject").val($scope.replySubject);
        $scope.isReply = false;
      } else if($scope.isForwared){
        $("#subject").val($scope.forwaredEmail.subject);
        $("#mail_body").data("wysihtml5").editor.setValue($scope.forwaredEmail.body);
      }
    }

    $scope.removeForwaredAttachements = function(id){
      for(var i = 0; i< $scope.mailAttachements.length; i++){
        if($scope.mailAttachements[i].id == id){
          $scope.mailAttachements.splice(i, 1);
          break;
        }
      }
    }

    /**
     * Deleting Attachements
     */

     $scope.deleteAttachements = function(id){
      if(id != '' && typeof id != 'undefined'){
        $http.post('/deleteAttachements', {id:id})
          .success(function(data) {
          })
          .error(function(data) {
            console.log('Error: ' + data);
          }); 
      } else {
        console.log("can not be deleted");
      }
     }

    $scope.getEmails = function(){
      $scope.mailview = false;
      $http.get('/getEmails')
        .success(function(data) {
          $scope.newEmails = data.newEmails;
          $scope.inbox = data.inbox;
          $scope.sent = data.sent;
          $scope.drafts = data.drafts;
          $scope.trash = data.trash;
          $scope.initInboxMailIds();
          $scope.initSentMailIds();
          $scope.initDraftMailIds();
          $scope.initTrashMailIds();
          $scope.initImportantMailIds();
          $scope.selectAllInbox = {checked : false};
          $scope.selectAllSent = {checked : false};
          $scope.selectAllDraft = {checked : false};
          $scope.selectAllTrash = {checked : false};
          $scope.selectAllImportant = {checked : false};
          
        })
        .error(function(data) {
          console.log('Error: ' + data);
        }); 
    };
    $scope.viewInboxMail = function(index){
      if($scope.inbox.length>index){
        $scope.mailview = true;
        $scope.viewmail = $scope.inbox[index];
        if($scope.viewmail.details.isUnread=="unread"){
          $http.post('/setMailAsRead', {id:$scope.viewmail.details.id})
          .success(function(data) {
            if(data.message == "success" && data.mail[0].isUnread=="read"){
              if($scope.newEmails>0){
                $scope.newEmails = $scope.newEmails-1;
              }
            }
          })
          .error(function(data) {
            console.log('Error: ' + data);
          }); 
        }

        // retriving attachements with mail
        if($scope.viewmail.mail.hasAttachments){
          $http.post("/getMailAttachements", {id : $scope.viewmail.mail.id})
          .success(function(response){
             $scope.mailAttachements = response.attachements;
          })
          .error(function(response){
            console.log("Error : " + response);
          });
        }
      }
    };

    $scope.downloadAttachements = function(type, hasId){
      var attArray = new Array();
      var isAttFind = false;
      if(type == 'single'){
        /*attArray.push(hasId);
        isAttFind = true;*/

      } else if(type == 'all'){
        for(var i = 0; i < $scope.mailAttachements.length; i++){
          attArray.push($scope.mailAttachements[i].id);
          isAttFind = true;
        }
      } else {
        console.log('can not be download');
      }
      if(isAttFind){
        $http.post('/downloadAttachements', {attArray : attArray})
        .success(function(res){
          console.log(res);
        })
        .error(function(res){
          console.log("Error : "+ res);
        });
      }
    }

    $scope.viewSentMail = function(index){
      if($scope.sent.length>index){
        $scope.mailview = true;
        $scope.viewmail = $scope.sent[index];

        if($scope.viewmail.mail.hasAttachments){
          $http.post("/getMailAttachements", {id : $scope.viewmail.mail.id})
          .success(function(response){
             $scope.mailAttachements = response.attachements;
          })
          .error(function(response){
            console.log("Error : " + response);
          });
        }
      }
    };

    $scope.viewTrashMail = function(index){
      if($scope.trash.length>index){
        $scope.mailview = true;
        $scope.viewmail = $scope.trash[index];
        //console.log($scope.viewmail);
        if($scope.viewmail.details && $scope.viewmail.details.isUnread=="unread"){
          $http.post('/setMailAsRead', {id:$scope.viewmail.details.id})
          .success(function(data) {
            if(data.message == "success" && data.mail[0].isUnread=="read"){
              if($scope.newEmails>0){
                $scope.newEmails = $scope.newEmails-1;
              }
            }
          })
          .error(function(data) {
            console.log('Error: ' + data);
          }); 
        }

        // retriving attachements with mail
        if($scope.viewmail.mail.hasAttachments){
          $http.post("/getMailAttachements", {id : $scope.viewmail.mail.id})
          .success(function(response){
             $scope.mailAttachements = response.attachements;
          })
          .error(function(response){
            console.log("Error : " + response);
          });
        }
      }
    };

    $scope.getUserSuggession = function(suggFor){
      if(suggFor){
        $http.post('/getUserSuggession', {projectid : $scope.projectAtt.id, activity : suggFor})
        .success(function(data) {
          var colaUserSugg = new Array();
          angular.forEach(data.users, function(user, key) {
            colaUserSugg[key] = user.email;
          });
          $scope.colaUserSugg = colaUserSugg;
          $('#invite_tags_ul').tagit({
              availableTags: colaUserSugg
              ,singleField: true
              ,singleFieldNode: $('#invite_tags')
          }, function(){
            removeEntry();
          });
        })
        .error(function(data) {
          console.log('Error: ' + data);
        }); 
      } else {
        console.log("/")
      }
    }
    $scope.getColaborations = function(){
      $http.post('/getColaborations', {email : $scope.user.email})
      .success(function(res) {
        $scope.colaborations = res.colaborations;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      }); 
    }
    $scope.colaborationReply = function(activity, id){
      if(!activity){
        console.log("/");
      } else if(!id){
        console.log("/");
      } else {
        $http.post('/colaborationReply', {id : id, activity : activity})
        .success(function(res) {
          $scope.getColaborations();
          $scope.findprojects();
        })
        .error(function(data) {
          console.log('Error: ' + data);
        }); 
      }
    }
    $scope.getEditEntry = function(object, type){
      $scope.fileuploads = [];
      $("#createnoteform")[0].reset();
      $("#createnoteform ul").empty();

      $("#createlitratureform")[0].reset();
      $("#createlitratureform ul").empty();

      $("#createprotocolform")[0].reset();
      $("#createprotocolform ul").empty();
      $("#createexperimentform")[0].reset();
      $("#createexperimentform ul").empty();

      if(type=="note"){
        $("#myNote .modal-title").html("Edit Note");
        $("#myNote span.note_type").removeClass('active_ntype');
        $("#myNote span.note_type:nth-child("+noteTypes[object.type]+")").addClass('active_ntype');        
        $("#myNote input#my_note").val(object.name);
        var tags = object.tags.split(",");
        $("#myNote ul#note_tags").tagit('removeAll');
        angular.forEach(tags, function(value, key) {
          $("#myNote ul#note_tags").tagit('createTag', value.trim());
        });        
        $("#myNote textarea#note_desc").data("wysihtml5").editor.setValue(object.description);
      }
      else if(type=='litrature'){
        $("#myLitrature .modal-title").html("Edit Litrature");        
        $("#myLitrature input#my_litrature").val(object.name);
        $("#myLitrature ul#litrature_tags").tagit('removeAll');
        var tags = object.tags.split(",");
        angular.forEach(tags, function(value, key) {
          $("#myLitrature ul#litrature_tags").tagit('createTag', value.trim());
        });
        $("#myLitrature textarea#litrature_abs").data("wysihtml5").editor.setValue(object.abstract);
        $("#myLitrature textarea#litrature_high").data("wysihtml5").editor.setValue(object.highlight);
      }
      else if(type=='protocol'){
        $("#myprotocol .modal-title").html("Edit Protocol");        
        $("#myprotocol input#my_protocol").val(object.name);
        $("#myprotocol ul#protocol_tags").tagit('removeAll');
        var tags = object.tags.split(",");
        angular.forEach(tags, function(value, key) {
          $("#myprotocol ul#protocol_tags").tagit('createTag', value.trim());
        });
        $("#myprotocol textarea#protocol_mat").data("wysihtml5").editor.setValue(object.materials);
        $("#myprotocol textarea#protocol_pro").data("wysihtml5").editor.setValue(object.procedure);
      }
      else if(type=='experiment'){
        $("#myexperiment .modal-title").html("Edit Experiment");        
        $("#myexperiment input#my_experiment").val(object.name);
        $("#myexperiment ul#experiment_tags").tagit('removeAll');
        var tags = object.tags.split(",");
        angular.forEach(tags, function(value, key) {
          $("#myexperiment ul#experiment_tags").tagit('createTag', value.trim());
        });
        $("#myexperiment textarea#experimet_bg").data("wysihtml5").editor.setValue(object.background);
        $("#myexperiment textarea#experimet_res").data("wysihtml5").editor.setValue(object.result);
        $("#myexperiment textarea#experimet_con").data("wysihtml5").editor.setValue(object.conclusion);
      }
      $scope.edit_entry= object.id;
    }
    /*
     * Send FeedBack
    **/
    $scope.sendFeedback = function(){
      $http.post('/sendFeedback', {feedback_text : $("#feedback_text").val()})
      .success(function(data) {
        $("#feedback_text").data("wysihtml5").editor.setValue("");
        $("#closesendfeedback").click();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });   
    }
    $scope.removeEntry = function(){
      $scope.fileuploads = [];
      $("#createnoteform")[0].reset();
      $("#createnoteform ul").empty();

      $("#createlitratureform")[0].reset();
      $("#createlitratureform ul").empty();

      $("#createprotocolform")[0].reset();
      $("#createprotocolform ul").empty();
      $("#createexperimentform")[0].reset();
      $("#createexperimentform ul").empty();


      $scope.edit_entry='';
      $("#myNote .modal-title").html("Create New Note");
      $("#myNote span.note_type").removeClass('active_ntype');
      $("#myNote span.note_type:nth-child(1)").addClass('active_ntype');        
      $("#myNote input#my_note").val("");
      $("#myNote ul#note_tags").tagit('removeAll');
      $("#myNote textarea#note_desc").data("wysihtml5").editor.setValue("");

      $("#myLitrature .modal-title").html("Create New Litrature");        
      $("#myLitrature input#my_litrature").val("");
      $("#myLitrature ul#litrature_tags").tagit('removeAll');
      $("#myLitrature textarea#litrature_abs").data("wysihtml5").editor.setValue("");
      $("#myLitrature textarea#litrature_high").data("wysihtml5").editor.setValue("");

      $("#myprotocol .modal-title").html("Create New Protocol");        
      $("#myprotocol input#my_protocol").val("");
      $("#myprotocol ul#protocol_tags").tagit('removeAll');
      $("#myprotocol textarea#protocol_mat").data("wysihtml5").editor.setValue("");
      $("#myprotocol textarea#protocol_pro").data("wysihtml5").editor.setValue("");

      $("#myexperiment .modal-title").html("Create New Experiment");        
      $("#myexperiment input#my_experiment").val("");
      $("#myexperiment ul#experiment_tags").tagit('removeAll');
      $("#myexperiment textarea#experimet_bg").data("wysihtml5").editor.setValue("");
      $("#myexperiment textarea#experimet_res").data("wysihtml5").editor.setValue("");
      $("#myexperiment textarea#experimet_con").data("wysihtml5").editor.setValue("");

      $("#addColaborator ul#invite_tags_ul").tagit('removeAll');
      $("#addColaborator input#message_subject").val("");
      $("#addColaborator textarea#message_body").data("wysihtml5").editor.setValue("");
      
    }
    $scope.removeEntry1 = function(){
      //$("#addColaborator ul#invite_tags_ul").tagit('removeAll');
      $("#addColaborator input#message_subject").val("");
      $("#addColaborator textarea#message_body").data("wysihtml5").editor.setValue("");
    };
    $scope.resetDiscussionForm = function(){
      $("#discussion_form")[0].reset();
      $http.post('/getDiscussions', {projectid : $scope.projectAtt.id})
      .success(function(data) {
          if(data.message == "success")
            $scope.discussions = data.discussions;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      }); 
    };
    $scope.createNewDiscussion = function(){
      $http.post('/createDiscussions', { description : $("#duscussion_description").val().toString(), title : $("#discussion_title").val(), projectid : $scope.projectAtt.id})
      .success(function(data) {
        if(data.message = "success")
          $scope.resetDiscussionForm();
        else
          alert(data.message.toString());
      })
      .error(function(data) {
        console.log('Error: ' + data);
      }); 

    };

    $scope.addColaborator = function(){
      $http.post('/addColaborator', {projectname : $scope.projectAtt.projectname, projectid:$scope.projectAtt.id, users : $("#addColaborator #invite_tags").val(), subject : $("#addColaborator input#message_subject").val(), message : $("#addColaborator textarea#message_body").val()})
      .success(function(data) {
        $("#closeaddcolaboration").click();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }

    /**
    * find projects
    */
    $scope.findprojects =function(){
      $http.post('/findproject', {username:username})
      .success(function(data) {
        $scope.projects=data;
        if(data.length==0)
          $scope.findColaboratedProjects();
        
        for(var i in data){
          $scope.pro_lastupdate[data.id]=data.updatedAt;
          if(i==data.length-1){
            $scope.findColaboratedProjects();
          }          
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    $scope.findColaboratedProjects = function(){
      $http.get('/findColaboratedProjects', {email:$scope.user.email})
      .success(function(data) {
        if(data.message = "success"){
          $scope.colaboratedProjects=data.projects;
          $scope.projects = $scope.projects.concat(data.projects);   
          $scope.initProjectIds();     
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }
    /**
    * Find project files
    */
    $scope.findprojectsfiles =function(projectid){ 
      $scope.projectFileId =projectid;
      if(isFileData == projectid){
        $scope.fileArr[projectid]=[];
        isFileData = "";
      }else{
        isFileData = projectid;
        $http.post('/findfiles', {projectid:projectid})
        .success(function(data) {
          //$scope.files=data;
          $scope.fileArr = [];
          $scope.fileArr[projectid]=data;
          //filename="";
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      }
    };  
    /**
    * create projects and send project data to server
    */
    
    $scope.createProject = function(){
      
      var pro_type=0;
      pro_type=$('#pro_type').val();
      if(pro_type=='null' || pro_type == null || pro_type == "none")
        pro_type=0;
      var type ='open';
      type  = $('#project_mode').val();      
      var fd = new FormData();
      // for (var i=0; i < $("#projectfile")[0].files.length; i++){
      //   console.log($("#projectfile")[0].files[i].name);
      //   fd.append('projectfile', $("#projectfile")[0].files[i]);
      // }

      for (var i=0; i < $scope.fileuploads.length; i++){
        fd.append('projectfile', $scope.fileuploads[i]);
      }
      $scope.fileuploads = []
      fd.append('projectname',$('#pro_name').val());
      fd.append('projectdesc',$('#pro_desc').val());
      fd.append('projecttype',type);
      fd.append('projectcat',pro_type);
      fd.append('projectid',$('#projectId').val());

      $http.post("/project", fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      })
      .success(function(data) {        
        $("#closeModel").click();
        $scope.resetProjectForm();
        $scope.findprojects();
        $scope.findprojectsfiles(data.id);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    $scope.editProject = function(project){
      $scope.fileuploads = [];
      $scope.resetProjectForm();
      $('#projectId').val(project.id);
      $('#pro_name').val(project.projectname);
      $('#pro_desc').data("wysihtml5").editor.setValue(project.projectdesc);
      $('#project_mode').val();
      pro_type=$('#pro_type').val(project.projectType);
      var oDropdown = $("#project_mode").msDropdown().data("dd");
      if(project.isPrivate){
        oDropdown.set("selectedIndex", 2);
        $('.open_drop').hide();
      } 
      else {
        oDropdown.set("selectedIndex", 1);
        $('.open_drop').show();
        var oDropdown1 = $("#pro_type").msDropdown().data("dd");
        if(project.projectTypeID == 0){
          oDropdown1.set("selectedIndex", 1);
        } else if(project.projectTypeID == 1) {
          oDropdown1.set("selectedIndex", 2);
        } else if(project.projectTypeID == 2) {
          oDropdown1.set("selectedIndex",3);
        } else if(project.projectTypeID == 3) {
          oDropdown1.set("selectedIndex", 4);
        } else if(project.projectTypeID == 4) {
          oDropdown1.set("selectedIndex", 5);
        } else if(project.projectTypeID == 5) {
          oDropdown1.set("selectedIndex", 6);
        }
      }
      $("#myModal div .modal-footer button:first").text("Edit Project");
    };
    $scope.resetProjectForm = function(){
      $scope.fileuploads = [];
      $('#projectId').val('');
      $('#pro_name').val('');
      $('#pro_desc').data("wysihtml5").editor.clear();
      $("#upload ul").empty();
      $('#projectfile').val('');
      var oDropdown = $("#project_mode").msDropdown().data("dd");
      oDropdown.set("selectedIndex", 0);
      var oDropdown1 = $("#pro_type").msDropdown().data("dd");
      oDropdown1.set("selectedIndex", 0);
      $('.open_drop').hide();
      $("#myModal div .modal-footer button:first").text("Create A project");
    }
    $scope.findprojectid = function (id) {
      $scope.pro_id= id;
    }

    $scope.project_colaborations = {};
    $scope.know_me = function(id){
      $http.post('/findCollaborators', {projectid : id})
      .success(function(data) {
        if(data.message == "success")
          $scope.project_colaborations[id] = data.colaborations;
          //console.log($scope.project_colaborations[id]);
      })
      .error(function(data) {
        //console.log(JSON.stringify(data));
      });

      $('#'+id).parent().children(".manage-team-wrap").slideToggle();
    }
    $scope.closemanageteam = function(id){
      $('#'+id+"_").parent().parent().slideUp();
    }
    $scope.deleteproject = function(){
      var password = $('#my_pass').val();
      var projectid = $scope.pro_id;
      $http.post('/deleteproject', {password:password,projectid:projectid})
      .success(function(data) {
        $scope.findprojects ();
        $("#close_delete_dialog").click();
        if(data.success == false){
          alert(data.message);
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    /**
    *  find project attribute
    */
    $scope.findprojectAtt = function(project){
      $scope.projectAtt=project;
      sharedProperties.setProjectAtt(project);
      $scope.projectId= project.id;
      //alert($scope.projectI);
      $scope.lastupdate = $scope.convertTime(project.updatedAt);
      $scope.findProjectTags();
    };
    $scope.findProjectTags = function(projectid){
        $http.post('/findProjectTags', {projectid : $scope.projectAtt.id})
        .success(function(data) {
          if(data.message == "success")
            $scope.tagssuggestions = data.tags;
        })
        .error(function(data) {
          //console.log(JSON.stringify(data));
        });
    };
    $scope.convertTime = function(date){
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
      return "on " + date.split("T")[0];
    };

    $scope.viewProfile = function(peopleid){
      var u = $scope.users.filter(
        function(user){
          return (user.id==peopleid);
        });
      $scope.people = u[0];
    };
    $scope.getImportant = function(){
      return $scope.inbox.filter(
        function(mail){
          return (mail.details.isImportant);
        });
    }
    $scope.getUserInfo = function(username){
      var u = $scope.users.filter(
        function(user){
          return (user.email==username);
        }
      );
      return u[0];
    }
    $scope.deleteColaboration = function(projectid, colaborationid){
      $http.post('/deleteColaboration', {colaborationid  : colaborationid})
      .success(function(data) {
        if(data.message = "success"){
          $scope.project_colaborations[projectid] = data.colaborations;
          //console.log(JSON.stringify($scope.project_colaborations[projectid]));
        }
      })
      .error(function(data) {
        console.log("DB Error");
      });
    }
    $scope.reAddColaboration = function(projectid, colaborationid){
      $http.post('/reAddColaboration', {colaborationid  : colaborationid})
      .success(function(data) {
        if(data.message = "success"){
          $scope.project_colaborations[projectid] = data.colaborations;
          //console.log(JSON.stringify($scope.project_colaborations[projectid]));
        }
      })
      .error(function(data) {
        console.log("DB Error");
      });
    }
    $scope.findEmailAddress = function(peopleid){
      var u = $scope.users.filter(
        function(user){
          return (user.id==peopleid);
        });
      return u[0].email;
    };
    $scope.findProfilepicUrl = function(peopleid){
      var u = $scope.users.filter(
        function(user){
          return (user.id==peopleid);
        });
      if(u[0].profilepic && u[0].profilepic.trim!="")
       return u[0].profilepic;
      else
        return "images/dummy.png";
    };


    $scope.viewProfileByEmail = function(email){
      $http.post('/viewProfile', {email  : email})
      .success(function(data) {
        $scope.people = data.user;
      })
      .error(function(data) {
        console.log("DB Error");
      });
    };
    /**
    * create note from here
    */
    $scope.createnote = function(flag){
      
      var notename = $('#my_note').val();
      var notedesc = $('#note_desc').val();
      var notetype = $('.active_ntype').text();
      var projectid = $('.active_ntype').text();
      var tags = $("#myNote input#get_data_note").val();
      var files = $("#projectfile_note")[0].files;
      var formData = new FormData();
      // for (var i=0; i < files.length; i++){
      //   formData.append('projectfile', files[i]);
      // }

      for (var i=0; i < $scope.fileuploads.length; i++){
        formData.append('projectfile', $scope.fileuploads[i]);
      }
      $scope.fileuploads = []

      formData.append('notename',notename);
      formData.append('projectid', $scope.projectAtt.id);
      formData.append('projectname', $scope.projectAtt.projectname);
      formData.append('notedesc', notedesc);
      formData.append('tags', tags);
      formData.append('notetype', notetype);
      formData.append('noteid', $scope.edit_entry);
      formData.append('isDraft', flag);
      var edit_entry = $scope.edit_entry;
      if(edit_entry=='') {
         $http.post('/createnote', formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
          })
           .success(function(data) {
             $scope.findnote();
             if(tags.trim()!="")
              $scope.tagssuggestions = $scope.tagssuggestions.concat(data.notes.tags.split(","));
             $("#createnoteform")[0].reset();
             $("#createnoteform ul").empty();
             $("#closecreatenote").click();
          })
          .error(function(data) {
            console.log('Error: ' + data.message);
          });
      }
      else{
        $http.post('/updatenote', formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
          })
        .success(function(data) {
         $scope.findnote();
         if(tags.trim()!="")
            $scope.tagssuggestions = $scope.tagssuggestions.concat(data.notes.tags.split(","));
         $("#createnoteform")[0].reset();
         $("#createnoteform ul").empty();
         $("#closecreatenote").click();           
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      }
    };
    /**
    * find note from here 
    */
    $scope.findnote = function(){
      $http.post('/findnote', {projectid: $scope.projectAtt.id})
       .success(function(data) {
        $scope.notes=data;  
        for(var id in $scope.notes ){
          var tags = $scope.notes[id].tags.trim();
          var tarr= tags.split(",");
          if(tarr && tarr.length==1 && tarr[0]==""){
            tarr.pop();
          }
          $scope.tags[$scope.notes[id].id]=tarr;
          var update=$scope.notes[id].updatedAt;
          $scope.lastnoteupdateArr[$scope.notes[id].id]=$scope.convertTime(update);
        }
        //$scope.findactivity();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };

    $scope.isStared = [];
    $scope.starsLabBook = function(id){
      $scope.isStarsLabBook = true;
      $scope.isStared[id] = true;
      $http.post('/starsLabBook', {id : id})
      .success(function(res){
        if(res.message == 'success'){
          $('#stars'+id).addClass('active');
        }
        $scope.isStarsLabBook = false;
      })
      .error(function(error){
        console.log('Error '+error);
        $scope.isStarsLabBook = false;
      });
    }

    $scope.removeStarsLabBook = function(id){
      $scope.isStarsLabBook = true;
      $scope.isStared[id] = false;
      $http.post('/removeStarsLabBook', {id : id})
      .success(function(res){
        if(res.message == 'success'){
          $('#stars'+id).removeClass('active');
        }
        $scope.isStarsLabBook = false;
      })
      .error(function(error){
        console.log('Error '+error);
        $scope.isStarsLabBook = false;
      });
    }
    /**
     * Note Hisory
     */
    $scope.getNoteHistory = function(noteid){
      if(noteid){
        $http.post('/getNoteHistory', {noteid : noteid})
        .success(function(response){
          if(response.message == 'success'){
            $scope.noteHistory = response.noteHistory;
          }
        })
        .error(function(response){
          console.log('Error' + response);
        });
      } else {
        console.log('note id not defined');
      }
    }

    $scope.showLabVersionDetail = function(object, type){
      if(type=="note"){
        $("#myNote span.note_type").removeClass('active_ntype');
        $("#myNote span.note_type:nth-child("+noteTypes[object.type]+")").addClass('active_ntype');        
        $("#myNote input#my_note").val(object.name);
        var tags = object.tags.split(",");
        //$("#myNote ul#note_tags").tagit('removeAll');
        angular.forEach(tags, function(value, key) {
          $("#myNote ul#note_tags").tagit('createTag', value.trim());
        });        
        $("#myNote textarea#note_desc").data("wysihtml5").editor.setValue(object.description);

      }
      else if(type=='litrature'){    
        //console.log(object.name);
        $("#my_litrature").val(object.abstract);
        var tags = object.tags.split(",");
        angular.forEach(tags, function(value, key) {
          $("#litrature_tags").tagit('createTag', value.trim());
        });
        $("#litrature_abs").data("wysihtml5").editor.setValue(object.abstract);
        $("#litrature_high").data("wysihtml5").editor.setValue(object.highlight);
      }
      else if(type=='protocol'){
        $("#myprotocol .modal-title").html("Edit Protocol");        
        $("#myprotocol input#my_protocol").val(object.name);
        $("#myprotocol ul#protocol_tags").tagit('removeAll');
        var tags = object.tags.split(",");
        angular.forEach(tags, function(value, key) {
          $("#myprotocol ul#protocol_tags").tagit('createTag', value.trim());
        });
        $("#myprotocol textarea#protocol_mat").data("wysihtml5").editor.setValue(object.materials);
        $("#myprotocol textarea#protocol_pro").data("wysihtml5").editor.setValue(object.procedure);
      }
      else if(type=='experiment'){
        $("#myexperiment .modal-title").html("Edit Experiment");        
        $("#myexperiment input#my_experiment").val(object.name);
        $("#myexperiment ul#experiment_tags").tagit('removeAll');
        var tags = object.tags.split(",");
        angular.forEach(tags, function(value, key) {
          $("#myexperiment ul#experiment_tags").tagit('createTag', value.trim());
        });
        $("#myexperiment textarea#experimet_bg").data("wysihtml5").editor.setValue(object.background);
        $("#myexperiment textarea#experimet_res").data("wysihtml5").editor.setValue(object.result);
        $("#myexperiment textarea#experimet_con").data("wysihtml5").editor.setValue(object.conclusion);
      }
      //console.log(object);
      $scope.edit_entry= object.id;
      $scope.labHistoryfiles = object.files;
      $scope.labBookversionId = object.id;
      $scope.labBookId = object.labbookid;
    }

    $scope.restoreLabBook = function(t){
      if($scope.labBookId == '' || $scope.labBookId == 'undefined'){
        $("#closecreatenote").click();
      } else {
        $http.post('/restoreLabBook', {labbookid : $scope.labBookId, versionid : $scope.labBookversionId})
        .success(function(res){
          if(res.message == 'success'){
            if(t==1){
              $("#closecreatenote").click();
              $scope.getNoteHistory($scope.labBookId);
            } else if(t == 2){
              $("#closecreatelitrature").click();
              $scope.getLitratureHistory($scope.labBookId);
            } else if(t == 3){
              $("#closecreateprotocol").click();
              $scope.getProtocolHistory($scope.labBookId);
            } else if(t == 4){
              $("#closecreateexperiment").click();
              $scope.getExperimentHistory($scope.labBookId);
            }

            $scope.labBookId = '';
            $scope.labBookversionId = '';
          } else {
            console.log(res);
          }
        })
        .error(function(error){
          console.log('Error' + error);
        });
      }
    }
    /**
     * Litrature Hisory
     */
    $scope.getLitratureHistory = function(litratureid){
      if(litratureid){
        $http.post('/getLitratureHistory', {litratureid : litratureid})
        .success(function(response){
          if(response.message == 'success'){
            $scope.litratureHistory = response.litratureHistory;
            //console.log($scope.litratureHistory);
          }
        })
        .error(function(response){
          console.log('Error' + response);
        });
      } else {
        console.log('litrature id not defined');
      }
    }

    /**
     * Protocol Hisory
     */
    $scope.getProtocolHistory = function(protocolid){
      if(protocolid){
        $http.post('/getProtocolHistory', {protocolid : protocolid})
        .success(function(response){
          if(response.message == 'success'){
            $scope.protocolHistory = response.protocolHistory;
            //console.log($scope.protocolHistory);
          }
        })
        .error(function(response){
          console.log('Error' + response);
        });
      } else {
        console.log('protocol id not defined');
      }
    }

    /**
     * Experiment Hisory
     */
    $scope.getExperimentHistory = function(experimentid){
      if(experimentid){
        $http.post('/getExperimentHistory', {experimentid : experimentid})
        .success(function(response){
          if(response.message == 'success'){
            $scope.experimentHistory = response.experimentHistory;
            //console.log($scope.experimentHistory);
          }
        })
        .error(function(response){
          console.log('Error' + response);
        });
      } else {
        console.log('protocol id not defined');
      }
    }


    /**    
    *  create lirtature here
    */
    $scope.createlitrature = function(flag){
      var litraturename = $('#my_litrature').val();
      var litratureabstarct = $('#litrature_abs').val();
      var litraturehighilight = $('#litrature_high').val();
      var tags = $('#get_data_lit').val();
      var edit_entry = $scope.edit_entry;
      var post_type='';
      
      var files = $("#projectfile_literature")[0].files;
      var formData = new FormData();

      for (var i=0; i < $scope.fileuploads.length; i++){
        formData.append('projectfile', $scope.fileuploads[i]);
      }
      $scope.fileuploads = []

      // for (var i=0; i < files.length; i++){
      //   formData.append('projectfile', files[i]);
      // }

      formData.append('projectid', $scope.projectAtt.id);
      formData.append('projectname', $scope.projectAtt.projectname);
      formData.append('litraturename', litraturename);
      formData.append('litratureabstarct', litratureabstarct);
      formData.append('litraturehighilight', litraturehighilight);
      formData.append('tags', tags);
      formData.append('litartureid', edit_entry);
      formData.append('isDraft', flag);

      if(edit_entry=='') {
        post_type = '/createlirature';
      }
      else{
        post_type = '/updatelitrature';
      }
      
      $http.post(post_type, formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
          })
      .success(function(data) {
        $scope.findlitrature();
        $("#createlitratureform")[0].reset();
        $("#createlitratureform ul").empty();
        $("#closecreatelitrature").click();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    $scope.opencommentbox = function (id){
      console.log(id);
      $("#"+id).parents().children('.comments-box').slideToggle();  
    }
    $scope.openlabcommentbox = function (id){
      console.log(id);
      $("#l"+id).parents().children('.comments-box').slideToggle();  
    }
    $scope.createLabCommnets = function(id){
      var comm = $('#ll'+id).val();
      $http.post('/createLabComment', {id:id,comm:comm, projectid:$scope.projectAtt.id})
       .success(function(data) {
         $scope.getLabBookComments();
         
        $('#ll'+id).val('');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }
    $scope.getLabBookComments = function(){
      $http.post('/getLabBookComments', {projectid:$scope.projectAtt.id})
      .success(function(response){
        if(response.message == 'success'){
          $scope.labBookComments = response.comments;
        }
      })
      .error(function(error){
        console.log('Error' + error);
      });
    }
    $scope.createTaskCommnets = function(){
      var comm = $('#task_comment').val();
      $http.post('/createTaskCommnets', {taskid:$scope.currentViewedTask.id,comm:comm})
       .success(function(data) {
          $scope.getTaskCommnets();
          $('#task_comment').val('');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }
    $scope.getTaskCommnets = function(){
      $http.post('/getTaskCommnets', {taskid:$scope.currentViewedTask.id})
      .success(function(response){
        if(response.message == 'success'){
          $scope.taskComments = response.comments;
        }
      })
      .error(function(error){
        console.log('Error' + error);
      });
    }
    /**
    * find litrature list from here
    */
    $scope.findlitrature= function(){
      $http.post('/findlitrature', {projectid: $scope.projectAtt.id})
       .success(function(data) {
         
        for(var i in data)
        {
          $scope.pro_lastupdate[$scope.projectAtt.id]=data.updatedAt;
        }
        $scope.litratures = data; 
        for(var id in $scope.litratures )
        {
          var tags = $scope.litratures[id].tags;
          var tarr= tags.split(",");
          if(tarr && tarr.length==1 && tarr[0]==""){
            tarr.pop();
          }
          $scope.lit_tag[$scope.litratures[id].id]=tarr;
          var update=$scope.litratures[id].updatedAt;
          $scope.lastlitupdateArr[$scope.litratures[id].id]=$scope.convertTime(update);
          
        }
        //$scope.findactivity();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    /**
    ** create protocol from here
    */
    $scope.createprotocol = function(flag){
      var protocolname = $('#my_protocol').val();
      var protocolmaterail = $('#protocol_mat').val();
      var protocolprocedure = $('#protocol_pro').val();
      
      var tags = $("#get_data_pro").val();
      var edit_entry = $scope.edit_entry;
      
      var files = $("#projectfile_protocol")[0].files;
      var formData = new FormData();

      for (var i=0; i < $scope.fileuploads.length; i++){
        formData.append('projectfile', $scope.fileuploads[i]);
      }
      $scope.fileuploads = []

      // for (var i=0; i < files.length; i++){
      //   formData.append('projectfile', files[i]);
      // }

      formData.append('projectid', $scope.projectAtt.id);
      formData.append('projectname', $scope.projectAtt.projectname);
      formData.append('protocolname', protocolname);
      formData.append('protocolmaterail', protocolmaterail);
      formData.append('protocolprocedure', protocolprocedure);
      formData.append('tags', tags);
      formData.append('protocolid', edit_entry);
      formData.append('isDraft', flag);

      var post_type='';
      
      if(edit_entry=='') 
      {
        post_type = '/createprotocol';
      }
      else
      {
        post_type = '/updateprotocol';
      }     
      
      $http.post(post_type, formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
          })
       .success(function(data) {
          $("#createprotocolform")[0].reset();

          $("#createprotocolform ul").empty();
          $("#closecreateprotocol").click();
          $scope.findprotocol();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    /**
    * find protocols from here
    */
    $scope.findprotocol = function(){
      $http.post('/findprotocol', {projectid: $scope.projectAtt.id})
       .success(function(data) {
        $scope.protocols = data;  
        for(var i in data)
        {
          $scope.pro_lastupdate[$scope.projectAtt.id]=data.updatedAt;
        }
        for(var id in $scope.protocols )
        {
          var tags = $scope.protocols[id].tags;
          var tarr= tags.split(",");
          if(tarr && tarr.length==1 && tarr[0]==""){
            tarr.pop();
          }
          $scope.pro_tag[$scope.protocols[id].id]=tarr;
          var update=$scope.protocols[id].updatedAt;
          $scope.lastproupdateArr[$scope.protocols[id].id]=$scope.convertTime(update);
        }
        //$scope.findactivity();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    /**
    ** create experiment from here
    */
    $scope.createexperiment = function(flag){
      var expname = $('#my_experiment').val();
      var expbg = $('#experimet_bg').val();
      var expresult = $('#experimet_res').val();
      var expcon = $('#experimet_con').val();
      
      var tags = $("#get_data_exp").val();
      var edit_entry = $scope.edit_entry;
      
      var files = $("#projectfile_experiment")[0].files;
      var formData = new FormData();

      for (var i=0; i < $scope.fileuploads.length; i++){
        formData.append('projectfile', $scope.fileuploads[i]);
      }
      $scope.fileuploads = []


      // for (var i=0; i < files.length; i++){
      //   formData.append('projectfile', files[i]);
      // }

      formData.append('projectid', $scope.projectAtt.id);
      formData.append('projectname', $scope.projectAtt.projectname);
      formData.append('expname', expname);
      formData.append('expbg', expbg);
      formData.append('expresult', expresult);
      formData.append('expcon', expcon);
      formData.append('tags', tags);
      formData.append('expid', edit_entry);
      formData.append('isDraft', flag);
      var post_type='';
      
      if(edit_entry=='') 
      {
        post_type = '/createexperiment';
      }
      else
      {
        post_type = '/updateexperiment';
      }         
      
      $http.post(post_type, formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
          })
       .success(function(data) {
         $("#createexperimentform")[0].reset();
         $("#createexperimentform ul").empty();
         $("#closecreateexperiment").click();
         $scope.findexperiments();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    /**
    * find protocols from here
    */
    $scope.findexperiments = function(){
      $http.post('/findexperiments', {projectid: $scope.projectAtt.id})
       .success(function(data) {
         
        $scope.experiments = data;
        for(var i in data)
        {
          $scope.pro_lastupdate[$scope.projectAtt.id]=data.updatedAt;
        }
        for(var id in $scope.experiments )
        {
          var tags = $scope.experiments[id].tags;
          var tarr= tags.split(",");
          if(tarr && tarr.length==1 && tarr[0]==""){
            tarr.pop();
          }
          $scope.exp_tag[$scope.experiments[id].id]=tarr;
          var update=$scope.experiments[id].updatedAt;
          $scope.lastexpupdateArr[$scope.experiments[id].id]=$scope.convertTime(update);
        }
        //$scope.findactivity();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    $scope.orderList = "createdAt";
    
    /**
    * find activity
    */
    $scope.findactivity = function(){
      $http.post('/findactivity', {projectid: $scope.projectAtt.id})
       .success(function(data) {
         
        $scope.activities = data; 
        for(var id in $scope.activities)
        {
          $scope.actArr[$scope.activities[id].id] = $scope.activities[id].activity;
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    /**
    *  create comment from here
    */
    $scope.createcommnets = function (actID){
      var comm = $('#a'+actID).val();
      $http.post('/createcomment', {actid:actID,comm:comm})
       .success(function(data) {
         $scope.findcomments(actID);
         
        $('#a'+actID).val('');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
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
    };

    $scope.createDiscussionCommnets = function(discussionid){
      var comm = $('#f'+discussionid).val();
      $http.post('/createDiscussionComment', {discussionid:discussionid,comm:comm})
       .success(function(data) {
         $scope.findDiscussionComments(discussionid);
         
        $('#a'+discussionid).val('');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    },
    $scope.findDiscussionComments = function(discussionid){
        $http.post('/getDiscussionComments', {discussionid:discussionid})
       .success(function(data) {
        if(data.message == "success")
          $scope.discussionComments[discussionid] = data.comments;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    },
    $scope.getSearchSuggestions = function(){
      $scope.searchSuggestions = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "Scala",
        "Scheme"
      ]
    };
    $scope.shortingOrder = function(){
          $scope.reverse = true;
          if($scope.shortBy == 'id' || $scope.shortBy == 'updatedAt'){
            $scope.reverse = true;
          } else {
            $scope.reverse = false;
          }
         }
  })
  .controller("libController", function($scope, $http, sharedProperties){
      /**
       * Create, Edit or Delete Library Items
       */
       $scope.libItemName = '';
       $scope.libItemType = '';
       $scope.libItemId = '';

       $scope.libItems;

       $scope.ModelHeadingText = 'Create New';
       $scope.ModelLabelText = 'Enter The New';
       var isProjectData;


       $scope.libItem = function(libItemType){
        /**
        * create and edit lib items
        */

         $http.post('/libItem', {libItemName : $scope.libItemName, libItemType : libItemType, libItemId : $scope.libItemId, username : username})
         .success(function(data) {  
            $scope.resetLibraryModel();
            $scope.getLibItems();
          })
         .error(function(data) {
          console.log('Error: ' + data);
         });

        }

        $scope.addProjectLibraryItem = function(libItemType){
       
         $http.post('/addProjectLibraryItem', {libItemName : $scope.libItemName, libItemType : libItemType, libItemId : $scope.libItemId, username : username, projectid : $scope.projectAtt.id})
         .success(function(data) {  
            $scope.resetLibraryModel();
            $scope.getProjectLibItems();
          })
         .error(function(data) {
          console.log('Error: ' + data);
         });

        }

        $scope.resetLibraryModel = function(){
             $scope.libItemName = '';
             $scope.libItemId = ''; 

             /**
              * Setting Default Text On Button
              */
             var buttonText = [];

                $('.modal-footer .btn-default').each(function(index) {
                    buttonText.push($(this).text());

                });

                $.each(buttonText, function(index, value){
                  value = value.replace('Save', 'Create New');
                  buttonText[index] = value;
                }, setButtonText);

                var setButtonText = $.each(buttonText, function(index, value){
                  $('.modal-footer .btn-default').each(function(ind) {
                    if(index == ind) $(this).text(value);
                  });
                });

                /**
                 * Heading and label text of models
                 */
                  $scope.ModelHeadingText = 'Create New';
                  $scope.ModelLabelText = 'Enter The New';
        }

        /**
         * Find all library items
         */

         $scope.getLibItems = function(){
            $http.post('/getLibItems', {username : username})
           .success(function(data) { 
              if(data.message == "success"){
                $scope.libItems = data.libraryItems;
              } else {
                //console.log(data);
              }
            })
           .error(function(data) {
            console.log('Error: ' + data);
          });
         }

         /**
          * Find project library item
          */

          $scope.getProjectLibItems = function(){
            $scope.projectAtt = sharedProperties.getProjectAtt();
            $http.post('/getProjectLibItems', {username : username, projectid : $scope.projectAtt.id})
            .success(function(data) { 
              if(data.message == "success"){
                $scope.projectLibraryItems = data.projectLibraryItems;
              } else {
                //console.log(data);
              }
              })
             .error(function(data) {
              console.log('Error: ' + data);
            });
          }


           /**
    * Find project library item
    */
    $scope.findProjectLibrary =function(projectid){ 
      $scope.projectLibraryId = projectid;
      if(isProjectData == projectid){
        $scope.projectLibrary[projectid]=[];
        isProjectData = "";
      }else{
        isProjectData = projectid;
        $http.post('/getProjectLibItems', {projectid:projectid})
        .success(function(data) {
          //$scope.files=data;

          $scope.projectLibrary = [];
          $scope.projectLibrary[projectid]=data.projectLibraryItems;
          //filename="";
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      }
    };  

         $scope.shortingOrder = function(){
          $scope.reverse = true;
          if($scope.shortBy == 'id' || $scope.shortBy == 'updatedAt'){
            $scope.reverse = true;
          } else {
            $scope.reverse = false;
          }
         }

         /**
          * edit library item
          */
        $scope.editLib = function(libItemId){
          angular.forEach($scope.libItems, function(value, index) {
            if(value.id == libItemId){
                $scope.libItemName = value.name;
                $scope.libItemId = libItemId;
                
                /**
                 * Setting Text On Button
                 */
                var buttonText = [];

                $('.modal-footer .btn-default').each(function(index) {
                    buttonText.push($(this).text());
                });

                $.each(buttonText, function(index, value){
                  value = value.replace('Create New', 'Save');
                  buttonText[index] = value;
                }, setButtonText);

                var setButtonText = $.each(buttonText, function(index, value){
                  $('.modal-footer .btn-default').each(function(ind) {
                    if(index == ind) $(this).text(value);
                  });
                });

                $scope.ModelHeadingText = 'Edit';
                $scope.ModelLabelText = 'Edit';
            }
          });
        }


        $scope.editProjectLibItem = function(libItemId){
          angular.forEach($scope.projectLibraryItems, function(value, index) {
            if(value.id == libItemId){
                $scope.libItemName = value.name;
                $scope.libItemId = libItemId;
                
                /**
                 * Setting Text On Button
                 */
                var buttonText = [];

                $('.modal-footer .btn-default').each(function(index) {
                    buttonText.push($(this).text());
                });

                $.each(buttonText, function(index, value){
                  value = value.replace('Create New', 'Save');
                  buttonText[index] = value;
                }, setButtonText);

                var setButtonText = $.each(buttonText, function(index, value){
                  $('.modal-footer .btn-default').each(function(ind) {
                    if(index == ind) $(this).text(value);
                  });
                });

                $scope.ModelHeadingText = 'Edit';
                $scope.ModelLabelText = 'Edit';
            }
          });
        }

        /**
         * delete library items
         */
        $scope.deleteLib = function(libItemId){
          $http.post('/deleteLibItem', {username : username, libItemId : libItemId})
           .success(function(data) { 
              if(data.message == "success"){
                $scope.resetLibraryModel();
                $scope.getLibItems();
              } else {
                //console.log(data);
              }
            })
           .error(function(data) {
            console.log('Error: ' + data);
          });
        }

        $scope.deleteProjectLibItem = function(libItemId){
          $http.post('/deleteLibItem', {username : username, libItemId : libItemId})
           .success(function(data) { 
              if(data.message == "success"){
                $scope.resetLibraryModel();
                $scope.getProjectLibItems();
              } else {
                //console.log(data);
              }
            })
           .error(function(data) {
            console.log('Error: ' + data);
          });
        }
  }).controller("userController", function($scope, $http){

    var user = $scope.user;
    $scope.fname = user.firstname;
    $scope.lname = user.lastname;
    $scope.city = user.city;
    $scope.country = user.country;
    $scope.aboutme = user.aboutme;
    $scope.houseno = user.houseno;
    $scope.postcode = user.postcode;
    $scope.street = user.street;

    $scope.userSubscriptions = [];
    var elmnt = document.getElementById('user_country');
    for(var i=0; i < elmnt.options.length; i++) {
      if(elmnt.options[i].value === $scope.country) {
        var oDropdown = $("#user_country").msDropdown().data("dd");
            oDropdown.set("selectedIndex", i);
      }
    }
    $scope.updateProfile = function(){
        var photo = $(".cropme.profile-pic>img").attr("src");
        if(photo && photo.length>100){
          var fd = new FormData();
          fd.append('file', photo);
        }

        // console.log($("#x").val());
        // console.log($("#y").val());
        // console.log($("#w").val());
        // console.log($("#h").val());

        // fd.append("file_x", $("#x").val());
        // fd.append("file_y", $("#y").val());
        // fd.append("file_w", $("#w").val());
        // fd.append("file_h", $("#h").val());

        fd.append('fname',$scope.fname);
        fd.append('lname',$scope.lname);
        fd.append('city',$scope.city);
        fd.append('country',$scope.country);
        fd.append('aboutme',$scope.aboutme);
        $http.post("/updateuserprofile", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
          if(data.message == "success"){
            $scope.user = data.user[0];
            $scope.user.firstname = data.user[0].firstname;
            $scope.user.lastname = data.user[0].lastname;
            $scope.user.city = data.user[0].city;
            $scope.user.country = data.user[0].country;
            $scope.user.profilepic = data.user[0].profilepic;
            $scope.user.aboutme = data.user[0].aboutme;
            var elmnt = document.getElementById('user_country');
            for(var i=0; i < elmnt.options.length; i++) {
              if(elmnt.options[i].value === $scope.country) {
                var oDropdown = $("#user_country").msDropdown().data("dd");
                    oDropdown.set("selectedIndex", i);
              }
            }
            alert("Profile Updated Successfully");
          } else {
            alert(data.message);
          }
        })
        .error(function(err){
          console.log('Error: ' + data);
        });
    }

    $scope.updateaccountpass = function(){
      var curpassword = $("#curpassword").val();
      var newpassword = $("#newpassword").val();
      var confpassword = $("#confpassword").val();
      if(newpassword!=confpassword){
        alert("New Password and Confirm Password do not match");
        return;
      }
      $http.post('/updateaccountpass', {curpassword : curpassword, newpassword : newpassword, confpassword : confpassword})
      .success(function(data) { 
        if(data.message == "success"){
          alert("Password Changed Successfully");
        }else{
          alert(data.message);
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }

    $scope.updateaccountemail = function(){
      var curemail = $("#curemail").val();
      var newemail = $("#newemail").val();
      $http.post('/updateaccountemail', {curemail : curemail, newemail : newemail})
      .success(function(data) { 
        if(data.message == "success"){

          alert("Email Updated Successfully");
        }else{
          alert(data.message);
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }

    $scope.updateaddress = function(){

      $http.post('/updateaddress', {
                          houseno : $scope.houseno,
                          street : $scope.street,
                          city : $scope.city,
                          country : $scope.country,
                          postcode : $scope.postcode
                        })
      .success(function(data) { 
        if(data.message == "success"){
          $scope.user.houseno = data.user.houseno;
          $scope.user.street = data.user.bhawarkua;
          $scope.user.city = data.user.city;
          $scope.user.country = data.user.country;
          $scope.user.postcode = data.user.postcode;

          alert("Address Updated Successfully");
        }else{
          alert(data.message);
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }

    $scope.getUserSubscription = function(){

      $http.post('/getUserSubscription')
      .success(function(res){
        if(res.message == 'success'){
          $scope.userSubscriptions = res.userSubscriptions;
        }
      })
      .error(function(error){
        console.log('Error ' +error);
      });
    }

    $scope.subscribeMe = function(id, status){
      //console.log(id, status);
      $http.post('/subscribeMe', {subscriptionId : id, status : status})
      .success(function(res){
        if(res.message == 'success'){
          //$scope.userSubscriptions = res.userSubscriptions;
          $scope.getUserSubscription();
        } else {
          console.log(res);
        }
      }).
      error(function(error){
        console.log(error);
      });
    }
  });

