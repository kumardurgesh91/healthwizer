/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */



/**
 * (1) Core middleware
 *
 * Middleware included with `app.use` is run first, before the router
 */


/**
 * (2) Static routes
 *
 * This object routes static URLs to handler functions--
 * In most cases, these functions are actions inside of your controllers.
 * For convenience, you can also connect routes directly to views or external URLs.
 *
 */

module.exports.routes = {

	// By default, your root route (aka home page) points to a view
	// located at `views/home/index.ejs`
	// 
	// (This would also work if you had a file at: `/views/home.ejs`)
	'/': {
		controller: 'home'
	},

    'get /login': {
		controller: 'auth',
		action: 'login'
	},
 	
	'post /login': {
		controller: 'auth',
		action: 'process'
	},

	'post /registration': {
		controller: 'auth',
		action: 'create'
	},

	'post /getInstantMessages': {
		controller: 'instantMessages',
		action: 'getInstantMessages'
	},
	'post /sendInstantMessages': {
		controller: 'instantMessages',
		action: 'sendInstantMessages'
	},

	'/logout' : {
	    controller : 'auth',
	    action     : 'logout'
  	},
	
	'/registration':{
		controller: 'auth',
		action: 'registration'
	},

	'/sendFeedback':{
		controller: 'home',
		action: 'feedback'
	},

	'/findNewsFeeds':{
		controller: 'home',
		action: 'newsFeeds'
	},

	'/findProjectTags':{
		controller: 'home',
		action: 'findProjectTags'
	},

	'get /profile':{
		controller: 'home',
		action: 'profile'
	},

	'get /ds':{
		controller: 'home',
		action: 'ds'
	},

	'get /profilesetting':{
		controller: 'home',
		action: 'profilesetting'
	},	
	
	'get /project_management':{
		controller: 'home',
		action: 'project_management'
	},	

	'post /addColaborator' : {
		controller: 'home',
	    action: 'addColaborator'
	},
	'post /findCollaborators' : {
		controller: 'home',
	    action: 'findCollaborators'
	},
	
	'/deleteColaboration' : {
		controller: 'home',
	    action: 'deleteColaboration'
	},
	'/reAddColaboration' : {
		controller: 'home',
	    action: 'reAddColaboration'
	},

	'/findColaboratedProjects' : {
		controller: 'auth',
	    action: 'findColaboratedProjects'
	},

	'post /project': {
	    controller: 'auth',
	    action: 'projectcreated'
  	},

	'/project':{
		controller: 'home',
		action: 'project'
	},
	
	'post /sendEmail':{
		controller: 'home',
		action: 'sendEmail'
	},
	'post /draftEmail':{
		controller: 'home',
		action: 'draftEmail'
	},	
	'get /getEmails' : {
		controller: 'home',
		action: 'getEmails'
	},

	'post /setMailAsRead' : {
		controller: 'home',
		action: 'setMailAsRead'
	},

	'post /setMailAsUnread' : {
		controller: 'home',
		action: 'setMailAsUnread'
	},

	'post /findProject':{
		controller: 'auth',
		action: 'findproject'
	},

	'post /findfiles':{
		controller: 'auth',
		action: 'findfiles'
	},
	
	'post /updateuserprofile':{
		controller: 'home',
		action: 'updateuserprofile'
	},
	
	'post /updateaccountpass':{
		controller: 'home',
		action: 'updateaccountpass'
	},
	
	'post /updateaccountemail':{
		controller: 'home',
		action: 'updateaccountemail'
	},
	
	'post /updateaddress':{
		controller: 'home',
		action: 'updateaddress'
	},
	
	'post /findProjectdata':{
		controller: 'home',
		action: 'findProjectdata'
	},
	
	'post /createnote':{
		controller: 'home',
		action: 'createnote'
	},
	
	'get /project_workspace':{
		controller: 'home',
		action: 'project_workspace'
	},
	
	'post /findnote':{
		controller: 'home',
		action: 'findnote'
	},
	
	'post /createlirature':{
		controller: 'home',
		action: 'createlirature'
	},
	
	'post /findlitrature':{
		controller: 'home',
		action: 'findlitrature'
	},
	
	'post /createprotocol':{
		controller: 'home',
		action: 'createprotocol'
	},
	
	'post /findprotocol':{
		controller: 'home',
		action: 'findprotocol'
	},
	
	
	'post /createexperiment':{
		controller: 'home',
		action: 'createexperiment'
	},
	
	'post /findexperiments':{
		controller: 'home',
		action: 'findexperiments'
	},
	
	'post /findactivity':{
		controller: 'home',
		action: 'findactivity'
	},
	'post /createDiscussions' : {
		controller: 'home',
		action: 'createDiscussions'
	},
	'post /getDiscussions' : {
		controller: 'home',
		action: 'getDiscussions'
	},

	'post /createDiscussionComment' : {
		controller: 'home',
		action: 'createDiscussionComment'
	},
	'post /getDiscussionComments' : {
		controller: 'home',
		action: 'getDiscussionComments'
	},

	'post /updatenote':{
		controller: 'home',
		action: 'updatenote'
	},

	'post /getNoteHistory' : {
		controller : 'home',
		action : 'getNoteHistory'
	},

	'post /getProtocolHistory' : {
		controller : 'home',
		action : 'getProtocolHistory'
	},

	'post /getExperimentHistory' : {
		controller : 'home',
		action : 'getExperimentHistory'
	},

	'post /getLitratureHistory' : {
		controller : 'home',
		action : 'getLitratureHistory'
	},
	
	'post /updateprotocol':{
		controller: 'home',
		action: 'updateprotocol'
	},
	
	'post /updatelitrature':{
		controller: 'home',
		action: 'updatelitrature'
	},
	
	'post /updateexperiment':{
		controller: 'home',
		action: 'updateexperiment'
	},
	
	'post /deleteproject':{
		controller: 'auth',
		action: 'deleteproject'
	},

	'post /starsLabBook' : {
		controller : 'home',
		action : 'starsLabBook'
	},

	'post /removeStarsLabBook' : {
		controller : 'home',
		action : 'removeStarsLabBook'
	},
	
	'post /createcomment':{
		controller: 'home',
		action: 'createcomment'
	},
	
	'post /findcomments':{
		controller: 'home',
		action: 'findcomments'
	},
	'post /viewProfile':{
		controller: 'home',
		action: 'viewProfile'
	},	
	'/users':{
		controller: 'home',
		action: 'users'
	},		
	/**
	 * library items
	 */

	 'post /libItem' : {
	 	controller : 'library',
	 	action : 'libItem'
	 },
	 'post /getLibItems' : {
	 	controller : 'library',
	 	action : 'getLibItems'
	 },
	 'post /deleteLibItem' : {
	 	controller : 'library',
	 	action : 'deleteLibItem'
	 },

	 'post /getProjectLibItems' : {
	 	controller : 'library',
	 	action : 'getProjectLibItems'
	 },
	 'post /addProjectLibraryItem' : {
	 	controller : 'library',
	 	action : 'addProjectLibraryItem'
	 },


	 
	 'post /auth/openid' : {
	 	controller : 'auth',
	 	action : 'openidLogin'
	 },
	 'get /auth/openid/return' :{
	 	controller : 'auth',
	 	action : 'openidCallback'
	 },
	 'get /auth/facebook' : {
	 	controller : 'auth',
	 	action : 'facebookLogin'
	 },
	 'get /auth/facebook/callback' :{
	 	controller : 'auth',
	 	action : 'facebookLoginCallback'
	 },
	 'get /auth/google' : {
	 	controller : 'auth',
	 	action : 'googleLogin'
	 },
	 'get /auth/google/callback' :{
	 	controller : 'auth',
	 	action : 'googleLoginCallback'
	 },
	 'get /auth/linkdin' : {
	 	controller : 'auth',
	 	action : 'linkdinLogin'
	 },
	 'get /auth/linkdin/callback' :{
	 	controller : 'auth',
	 	action : 'linkdinLoginCallback'
	 },
	 'post /auth/orcid' : {
	 	controller : 'auth',
	 	action : 'openidLogin'
	 },
	 'get /auth/orcid/return' :{
	 	controller : 'auth',
	 	action : 'openidCallback'
	 },
	 'get /searchSuggestions' :{
	 	controller : 'home',
	 	action : 'searchSuggestions'
	 },

	 'post /getColaborations' : {
	 	controller : 'home',
	 	action : 'getColaborations'
	 },
	 'post /colaborationReply' : {
	 	controller : 'home',
	 	action : 'colaborationReply'
	 },

	 'post /getUserSuggession' : {
	 	controller : 'home',
	 	action : 'getUserSuggession'
	 },
	 'post /uploadFilesInMultipleProject' : {
	 	controller : 'home',
	 	action : 'uploadFilesInMultipleProject'
	 },
	 'post /addColaboratorInMultipeProject' : {
	 	controller : 'home',
	 	action : 'addColaboratorInMultipeProject'
	 },
	 'post /deleteAttachements' : {
	 	controller : 'home',
	 	action : 'deleteAttachements'
	 },
	 'post /getMailAttachements' : {
	 	controller : 'home',
	 	action : 'getMailAttachements'
	 },
	 'get /downloadAttachements/:mailid/:id' : {
	 	controller : 'home',
	 	action : 'downloadAttachements'
	 },
	 'post /deleteSelectedInboxMail' : {
	 	controller : 'home',
	 	action : 'deleteSelectedInboxMail'
	 },
	 'post /deleteSelectedSentMail' : {
	 	controller : 'home',
	 	action : 'deleteSelectedSentMail'
	 },
	 'post /deleteSelectedDraftMail' : {
	 	controller : 'home',
	 	action : 'deleteSelectedDraftMail'
	 },
	 'post /deleteSelectedTrashMail' : {
	 	controller : 'home',
	 	action : 'deleteSelectedTrashMail'
	 },
	 'post /restoreSelectedTrashMail' : {
	 	controller : 'home',
	 	action : 'restoreSelectedTrashMail'
	 },
	 'post /deleteInboxMail' : {
	 	controller : 'home',
	 	action : 'deleteInboxMail'
	 },

	 'post /deleteSentMail' : {
	 	controller : 'home',
	 	action : 'deleteSentMail'
	 },

	 'post /makeImportant' : {
	 	controller : 'home',
	 	action : 'makeImportant'
	 },
	 'post /removeImportant' : {
	 	controller : 'home',
	 	action : 'removeImportant'
	 },
	 'post /deleteTrashMail' : {
	 	controller : 'home',
	 	action : 'deleteTrashMail'
	 },

	 'post /getColaboraters' : {
	 	controller : 'home',
	 	action : 'getColaboraters'
	 },
	 'post /getAllCommentOnProject' : {
	 	controller : 'home',
	 	action : 'getAllCommentOnProject'
	 },

	 'post /addFavourites' : {
	 	controller : 'home',
	 	action : 'addFavourites'
	 },
	 'post /isFavourites' : {
	 	controller : 'home',
	 	action : 'isFavourites'
	 },
	 'post /removeFavourites' : {
	 	controller : 'home',
	 	action : 'removeFavourites'
	 },
	 'post /createLabComment' : {
	 	controller : 'home',
	 	action : 'createLabComment'
	 },
	 'post /getLabBookComments' : {
	 	controller : 'home',
	 	action : 'getLabBookComments'
	 },
	 'post /archivedlab' : {
	 	controller : 'home',
	 	action : 'archivedlab'
	 },
	 'post /restoreLabBook' : {
	 	controller : 'home',
	 	action : 'restoreLabBook'
	 },
	 'post /getUserSubscription' : {
	 	controller : 'auth',
	 	action : 'getUserSubscription'
	 },
	 'post /subscribeMe' : {
	 	controller : 'auth',
	 	action : 'subscribeMe'
	 },
	 'get /searchProjectSuggestions' : {
	 	controller : 'home',
	 	action : 'searchProjectSuggestions'
	 },
	 'get /search' : {
	 	controller : 'home',
	 	action : 'search'
	 },
	 'get /exportlabbook/:projectid' : {
	 	controller : 'home',
	 	action : 'exportLabbook'
	 },

	 'post /createTask' : {
	 	controller : 'home',
	 	action : 'createTask'
	 },
	 'get /getCreatedTasks' : {
	 	controller : "home",
	 	action : 'getCreatedTasks'
	 },
	 'post /markTaskAsDoneUndone' : {
	 	controller : 'home',
	 	action : 'markTaskAsDoneUndone'
	 },
	 'post /deleteTask' : {
	 	controller : 'home',
	 	action : 'deleteTask'
	 },
	 'post /updateTask' : {
	 	controller : 'home',
	 	action : 'updateTask'
	 },
	 'post /createTaskCommnets' : {
	 	controller : 'home',
	 	action : 'createTaskCommnets'
	 },
	 'post /getTaskCommnets' : {
	 	controller : 'home',
	 	action : 'getTaskCommnets'
	 },
	 'get /getMyTask' : {
	 	controller : 'home',
	 	action : 'getMyTask'
	 },
	 'get /getUnSeenTasks' : {
	 	controller : 'home',
	 	action : 'getUnSeenTasks'
	 },
	 'post /markIsSeenTask' : {
	 	controller : 'home',
	 	action : 'markIsSeenTask'
	 },

  /*
  // But what if you want your home page to display
  // a signup form located at `views/user/signup.ejs`?
  '/': {
    view: 'user/signup'
  }


  // Let's say you're building an email client, like Gmail
  // You might want your home route to serve an interface using custom logic.
  // In this scenario, you have a custom controller `MessageController`
  // with an `inbox` action.
  '/': 'MessageController.inbox'


  // Alternatively, you can use the more verbose syntax:
  '/': {
    controller: 'MessageController',
    action: 'inbox'
  }


  // If you decided to call your action `index` instead of `inbox`,
  // since the `index` action is the default, you can shortcut even further to:
  '/': 'MessageController'


  // Up until now, we haven't specified a specific HTTP method/verb
  // The routes above will apply to ALL verbs!
  // If you want to set up a route only for one in particular
  // (GET, POST, PUT, DELETE, etc.), just specify the verb before the path.
  // For example, if you have a `UserController` with a `signup` action,
  // and somewhere else, you're serving a signup form looks like: 
  //
  //		<form action="/signup">
  //			<input name="username" type="text"/>
  //			<input name="password" type="password"/>
  //			<input type="submit"/>
  //		</form>

  // You would want to define the following route to handle your form:
  'post /signup': 'UserController.signup'


  // What about the ever-popular "vanity URLs" aka URL slugs?
  // (you might remember doing this with `mod_rewrite` in Apache)
  //
  // This is where you want to set up root-relative dynamic routes like:
  // http://yourwebsite.com/twinkletoez
  //
  // NOTE:
  // You'll still want to allow requests through to the static assets,
  // so we need to set up this route to ignore URLs that have a trailing ".":
  // (e.g. your javascript, CSS, and image files)
  'get /*(^.*)': 'UserController.profile'

  */
};



/** 
 * (3) Action blueprints
 * These routes can be disabled by setting (in `config/controllers.js`):
 * `module.exports.controllers.blueprints.actions = false`
 *
 * All of your controllers ' actions are automatically bound to a route.  For example:
 *   + If you have a controller, `FooController`:
 *     + its action `bar` is accessible at `/foo/bar`
 *     + its action `index` is accessible at `/foo/index`, and also `/foo`
 */


/**
 * (4) Shortcut CRUD blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *			`module.exports.controllers.blueprints.shortcuts = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *		/foo/find/:id?	->	search lampshades using specified criteria or with id=:id
 *
 *		/foo/create		->	create a lampshade using specified values
 *
 *		/foo/update/:id	->	update the lampshade with id=:id
 *
 *		/foo/destroy/:id	->	delete lampshade with id=:id
 *
 */

/**
 * (5) REST blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *		`module.exports.controllers.blueprints.rest = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *
 *		get /foo/:id?	->	search lampshades using specified criteria or with id=:id
 *
 *		post /foo		-> create a lampshade using specified values
 *
 *		put /foo/:id	->	update the lampshade with id=:id
 *
 *		delete /foo/:id	->	delete lampshade with id=:id
 *
 */

/**
 * (6) Static assets
 *
 * Flat files in your `assets` directory- (these are sometimes referred to as 'public')
 * If you have an image file at `/assets/images/foo.jpg`, it will be made available
 * automatically via the route:  `/images/foo.jpg`
 *
 */



/**
 * (7) 404 (not found) handler
 *
 * Finally, if nothing else matched, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 */
 
