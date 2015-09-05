'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ui.router',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).

config(function($stateProvider, $urlRouterProvider) {
  //$urlRouterProvider.otherwise('newsfeed');
  $stateProvider
  .state('newsfeed', {
      url: "/newsfeed",
      templateUrl: "/partials/newsfeed.html"
  })
  .state('people', {
      url: "/people",
      templateUrl: "/partials/people.html"
  })
  .state('calendar', {
      url: "/calendar",
      templateUrl: "/partials/newhtml/calendar.html"
  })
  .state('index', {
      url: "",
      templateUrl: "/partials/newsfeed.html"
  })
  .state('boxed_page', {
      url: "/boxed_page",
      templateUrl: "/partials/newhtml/blog_details.html"
  })
  .state('horizontal_menu', {
      url: "/horizontal_menu",
      templateUrl: "/partials/horizontal_menu.html"
  })
  .state('language_switch', {
      url: "/language_switch",
      templateUrl: "/partials/language_switch.html"
  })
  .state('projects', {
      url: "/projects",
      templateUrl: "/partials/projects.html"
  })
  .state('ds', {
      url: "/ds",
      templateUrl: "/partials/ds.html"
  })
  .state('profilesettings', {
      url: "/profilesettings",
      templateUrl: "/partials/profilesettings.html"
  })
  .state('accountsettings', {
      url: "/accountsettings",
      templateUrl: "/partials/accountsettings.html"
  })
  .state('project_management', {
      url: "/project_management",
      templateUrl: "/partials/project_management.html"
  })
  .state('project_workspace', {
      url: "/project_workspace",
      templateUrl: "/partials/project_workspace.html"
  })
  .state('blog_details', {
      url: "/blog_details",
      templateUrl: "/partials/newhtml/blog_details.html"
  })
  .state('directory', {
      url: "/directory",
      templateUrl: "/partials/newhtml/directory.html"
  })
  .state('invoice', {
      url: "/invoice",
      templateUrl: "/partials/newhtml/invoice.html"
  })
  .state('invoice_print', {
      url: "/invoice_print",
      templateUrl: "/partials/newhtml/invoice_print.html"
  })
  .state('lock_screen', {
      url: "/lock_screen",
      templateUrl: "/partials/newhtml/lock_screen.html"
  })
  .state('mail', {
      url: "/mail",
      templateUrl: "/partials/newhtml/mail.html"
  })
  .state('mail.mail_view', {
      url: "/mail_view",
      templateUrl: "/partials/newhtml/mail_view.html"
  })
  .state('sent', {
      url: "/sent",
      templateUrl: "/partials/newhtml/sent.html"
  })
  .state('important', {
      url: "/important",
      templateUrl: "/partials/newhtml/important.html"
  })
  .state('drafts', {
      url: "/drafts",
      templateUrl: "/partials/newhtml/drafts.html"
  })
  .state('trash', {
      url: "/trash",
      templateUrl: "/partials/newhtml/trash.html"
  })
  .state('mail_compose', {
      url: "/mail_compose",
      templateUrl: "/partials/newhtml/mail_compose.html"
  })  
  .state('pricing_table', {
      url: "/pricing_table",
      templateUrl: "/partials/newhtml/pricing_table.html"
  })
  .state('timeline', {
      url: "/timeline",
      templateUrl: "/partials/newhtml/timeline.html"
  })
  .state('note_history', {
    url : "/note_history",
    templateUrl : "/partials/note_history.html"
  })

  .state('protocol_history', {
    url : "/protocol_history",
    templateUrl : "/partials/protocol_history.html"
  })

  .state('experiment_history', {
    url : "/experiment_history",
    templateUrl : "/partials/experiment_history.html"
  })

  .state('litrature_history', {
    url : "/litrature_history",
    templateUrl : "/partials/litrature_history.html"
  })
  .state('instantmessaging', {
    url : "/instantmessaging",
    templateUrl : "/partials/newhtml/chat.html"
  })  
  .state('searchresult', {
    url : '/searchresult',
    templateUrl : "partials/searchresult.html"
  })
  .state('create_task', {
    url : '/create_task',
    templateUrl : "partials/create_task.html"
  })
  .state('all_task', {
    url : '/all_task',
    templateUrl : "partials/all_task.html"
  })
  .state('view_task', {
    url : '/view_task',
    templateUrl : "partials/view_task.html"
  })
  .state('my_task', {
    url : '/my_task',
    templateUrl : "partials/my_task.html"
  })
  .state('edit_task', {
    url : '/edit_task',
    templateUrl : "partials/edit_task.html"
  })
  .state('unload', {
      url: "/unload",
      template: ""
  });
});