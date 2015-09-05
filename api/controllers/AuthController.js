/*jshint node:true */
 
/*---------------------
	:: Auth
	-> controller
---------------------*/
var passport = require('passport');
var sid = require('shortid');
var fs = require('fs');
var mkdirp = require('mkdirp');
var bcrypt = require('bcrypt-nodejs');

var UPLOAD_PATH = '/images/project_files';

 
// Setup id generator
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);

function safeFilename(name) {
  name = name.replace(/ /g, '-');
  name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
  name = name.replace(/\.+/g, '.');
  name = name.replace(/-+/g, '-');
  name = name.replace(/_+/g, '_');
  return name;
}
 
function fileMinusExt(fileName) {
  return fileName.split('.').slice(0, -1).join('.');
}
 
function fileExtension(fileName) {
  return fileName.split('.').slice(-1);
}
 
// Where you would do your processing, etc
// Stubbed out for now
function processImage(id, name, path, cb) {
  console.log('Processing image');
 
  cb(null, {
    'result': 'success',
    'id': id,
    'name': name,
    'path': path
  });
}
 
var AuthController = {
	/**
	* define index view here
	*/
 	index: function (req, res) {
        res.view();
    },
 	
 	openidLogin: function(req, res) {
 		console.log("openidLogin");
     	passport.authenticate('openid', { failureRedirect: '/' },
	        function (err, user) {
                req.logIn(user, function (err) {
					console.log(user);
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }
					console.log("from here++++++++");
                    res.redirect('/');
                    return;
                });
            }
	  	)(req, res);
  	},

 	openidCallback : function(req, res){
 		console.log("openidCallback");
 		passport.authenticate('openid', { failureRedirect: '/login' },
			function (err, user) {
                req.logIn(user, function (err) {
					console.log(user);
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }
                    res.redirect('/');
                    return;
                });
            }
		)(req, res);
 	},


 	facebookLogin: function(req, res) {
		passport.authenticate('facebook', { failureRedirect: '/' },
	    function (err, user) {
	    	console.log(err);
	        req.logIn(user, function (err) {
				console.log(user);
	            if (err) {
	                console.log(err);
	                res.view('500');
	                return;
	            }
				console.log("from here++++++++");
	            res.redirect('/');
	            return;
	        });
	    })(req, res);
  	},

 	facebookLoginCallback : function(req, res){
 		passport.authenticate('facebook', { failureRedirect: '/login'},
            function (err, user) {
            	console.log(err);
                req.logIn(user, function (err) {
					console.log(user);
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }
					console.log("from here++++++++");
                    res.redirect('/');
                    return;
                });
            })(req, res);
 	},
	
	login: function(req, res) {
		res.view({layout:false}, { message: 'this is test'});
		//res.view();
		return;
		
	},


	googleLogin: function(req, res) {
		passport.authenticate('google', { failureRedirect: '/', scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'] },
	    function (err, user) {
	    	console.log(err);
	        req.logIn(user, function (err) {
				console.log(user);
	            if (err) {
	                console.log(err);
	                res.view('500');
	                return;
	            }
	            res.redirect('/');
	            return;
	        });
	    })(req, res);
  	},

 	googleLoginCallback : function(req, res){
 		passport.authenticate('google', { failureRedirect: '/login', scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']},
            function (err, user) {
            	console.log(err);
                req.logIn(user, function (err) {
					console.log(user);
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }
					console.log("from here++++++++");
                    res.redirect('/');
                    return;
                });
            })(req, res);
 	},


 	linkdinLogin: function(req, res) {
		passport.authenticate('linkedin', { failureRedirect: '/',  scope:['r_basicprofile', 'r_emailaddress'], state : "DCEEFWF45453sdffef424XZY" },
	    function (err, user) {
	    		if(user){
                	req.logIn(user, function (err) {
						console.log(user);
	                    if (err) {
	                        console.log(err);
	                        res.view('500');
	                        return;
	                    }
	                    res.redirect('/');
	                    return;
                	});
                } else {
                	res.redirect('/registration');
                }
	    })(req, res);
  	},

 	linkdinLoginCallback : function(req, res){
 		passport.authenticate('linkedin', { failureRedirect: '/login',  scope:['r_basicprofile', 'r_emailaddress'], state : "DCEEFWF45453sdffef424XZY"},
            function (err, user) {

                if(user){
                	req.logIn(user, function (err) {
						console.log(user);
	                    if (err) {
	                        console.log(err);
	                        res.view('500');
	                        return;
	                    }
	                    res.redirect('/');
	                    return;
                	});
                } else {
                	res.redirect('/registration');
                }
            })(req, res);
 	},
	
	login: function(req, res) {
		res.view({layout:false}, { message: 'this is test'});
		//res.view();
		return;
	},

	/**
	* create login process here
	*/
	process: function(req, res) {
	 
		passport.authenticate('local', function(err, user, info) {
			if ((err) || (!user)) {
				res.send(400, {error: "wrong user name or password"});
				res.redirect('/login');
				return;
			}
 
			req.logIn(user, function(err) {
				if (err) {
					res.view();
					return;
				}
				console.log("logged in  herrooooo");
				req.session.user = user;
				// res.send(user);
				//	res.redirect('/newsfeed');
				res.redirect('/');
				
				return;
			});
		})(req, res);
	},
	/**
	* create new user fvrom here
	*/
	create: function (req, res) {
        var username = req.param("username");
        var password = req.param("password");
		var email = req.param("email");
		console.log(username,password,":  user details");
         
        User.findByUsername(username).done(function(err, usr){
            if (err) {
                res.send(500, { error: "DB Error" });
            } else if (usr && usr.length>0) {
				console.log(usr,": value of user======")
                res.send(400, {error: "Username already Taken"});
            } else {
                      User.create({username: username, password: password, email: email, profilepic:"images/dummy.png" }).done(function(error, user) {
                if (error) {
                    res.send(500, {error: "DB Error"});
                } else {
                    req.session.user = user;
                    res.redirect('/');
                }
            });
        }
    });
},

// Login from facebook
 // https://developers.facebook.com/docs/
    // https://developers.facebook.com/docs/reference/login/
   //  facebook: function (req, res) {
		 // passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] },
   //          function (err, user) {
   //          	console.log(err);
   //              req.logIn(user, function (err) {
			// 		console.log(user);
   //                  if (err) {
   //                      console.log(err);
   //                      res.view('500');
   //                      return;
   //                  }
			// 		console.log("from here++++++++");
   //                  res.redirect('/');
   //                  return;
   //              });
   //          })(req, res);
   //  },

	// Login from google 
	
    // https://developers.google.com/
    // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
    // google: function (req, res) {
    //     passport.authenticate('google', { failureRedirect: '/login', scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'] },
    //         function (err, user) {
    //             req.logIn(user, function (err) {
    //                 if (err) {
    //                     console.log(err);
    //                     res.view('500');
    //                     return;
    //                 }

    //                 res.redirect('/');
    //                 return;
    //             });
    //         })(req, res);
    // },
	// Login from Linkedin
	 // https://developers.likdin.com/
    // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
    // linkdin: function (req, res) {
    //     passport.authenticate('linkedin', { failureRedirect: '/login', scope:['r_basicprofile', 'r_emailaddress'] },
    //         function (err, user) {
    //             req.logIn(user, function (err) {
    //                 if (err) {
    //                     console.log(err);
    //                     res.view('500');
    //                     return;
    //                 }

    //                 res.redirect('/');
    //                 return;
    //             });
    //         })(req, res);
    //},
	
	// Logout from here
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	},
	
	
	/**
	* show registration view
	**/

	registration:function(req,res){
		res.view({layout:false});
	},
	
	/**
	*   project creation from here
	*/
	projectcreated:function(req,res){
		
		var projectTitle = req.param("projectname");
		var projectdesc=req.param("projectdesc");
		var isPrivate= true;
		var projectId = req.param("projectid");		
		if(req.param("projecttype")=="open"){
			var isPrivate= false;
		}
		var isAdmin=true;
		var username=req.user.username;
		var projectcat =0;
		projectcat= req.param("projectcat");
		var i=-1;
		function uploadProjectFiles(project){
			
			function next(){
				i++;
				if(req.files && req.files.projectfile && req.files.projectfile.length>i){
					console.log('in multiple');
					var file = req.files.projectfile[i];
					var filename = file.name;
					var dirPath = UPLOAD_PATH + '/' +project.id;
					var filePath = dirPath + '/' + filename;
					console.log(dirPath, filePath);
					try {
					  	mkdirp.sync("./assets"+dirPath, 0755);					  	
					} catch (e) {
					  	console.log(e);
					}
					console.log('filepath',file.path);
					fs.readFile(file.path, function (err, data) {
					  	if (err) {
							res.json({'error': 'could not read file'}); 
					 	} else {
							fs.writeFile("./assets"+filePath, data, function (err) {
						  		if (err) {
									res.json({'error': 'could not write file to storage'});
						  		} else {
									if (err) {
										res.json(err);
						  			} else {
						  				File.create({projectid: project.id, filename: filename,filepath:filePath,creater:req.user.username }).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												next();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
					console.log("in single");
					var file = req.files.projectfile;
					var filename = file.name;
					var dirPath = UPLOAD_PATH + '/' +project.id;
					var filePath = dirPath + '/' + filename;
					console.log(dirPath, filePath);
					try {
					  	mkdirp.sync("./assets"+dirPath, 0755);					  	
					} catch (e) {
					  	console.log(e);
					}
					fs.readFile(file.path, function (err, data) {
					  	if (err) {
							res.json({'error': 'could not read file'});
					 	} else {
							fs.writeFile("./assets"+filePath, data, function (err) {
						  		if (err) {
									res.json({'error': 'could not write file to storage'});
						  		} else {
									if (err) {
										res.json(err);
						  			} else {
						  				File.create({projectid: project.id, filename: filename,filepath:filePath,creater:req.user.username }).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												var user = req.user;
												activity = "1 file added by <a href='#/people' ng-click='viewProfile("+user.id+")' class='activity_link'>" + user.username+"  </a> in project " + project.projectname;
												Projectactivity.create({projectid: project.id,activity:activity,creater:user.username})
												.done(function(error, activity) {
													if(error){
														res.json({'error': 'error in creating activity'});
													} else {
														res.send({message: "success", project : project});
													}
												});
												
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				}else{
					if(req.files && req.files.projectfile && req.files.projectfile.length>0){
						var user = req.user;
						activity = req.files.projectfile.length + " files added by <a href='#/people' ng-click='viewProfile("+user.id+")' class='activity_link'>" + user.username+"  </a> in project " + project.projectname;
						Projectactivity.create({projectid: project.id,activity:activity,creater:user.username})
						.done(function(error, activity) {
							if(error){
								console.log("error while creating activity");
							} else {
								res.send({message: "success", project : project});
							}
						});
					} else {
						res.send({message: "success", project : project});
					}
				}
			}
			next();
		};
	   	if(projectId && projectId != '' && projectId != 'undefined'){
	   		Project.findOne({id : projectId}, function(err, project){
	   			if(err){
	   				console.log(err);
	   			} 
	   			else {
	   				project.projectname=projectTitle;
	   				project.isPrivate=isPrivate;
	   				project.projectdesc=projectdesc;
	   				project.username=username;
	   				project.isAdmin=isAdmin;
	   				if(projectcat)
	   					project.projectTypeID=projectcat;
	   				else
	   					project.projectTypeID="";
	   				project.save(function(err, project){
	   					if(err){
	   						res.send({ message : "error while saving project"});
	   					} else {
	   						var user = req.user;
	   						activity = " Project " + project.projectname +" Updated by <a href='#/people' ng-click='viewProfile("+user.id+")' class='activity_link'>" + user.username+"  </a>";
							Projectactivity.create({projectid: project.id,activity:activity,creater:user.username})
							.done(function(error, activity) {
								if(error){
									res.json({'error': 'error in creating activity'});
								} else {
									console.log("Uploading files for old project ", project);
					        		uploadProjectFiles(project);
								}
							});					        
	   					}
	   				});
	   			}
	   		});
	   	} else {
	   		Project.create({projectname: projectTitle, isPrivate: isPrivate,projectdesc:projectdesc, username:username, isAdmin:isAdmin, projectTypeID:projectcat}).done(function(error, project) {
                if (error) {
                    res.send(500, {message: "DB Error"});
                } else {
                	var user = req.user;
                	activity = " New project created by <a href='#/people' ng-click='viewProfile("+user.id+")' class='activity_link'>" + user.username+"  </a>. Project name "+ project.projectname ;
					Projectactivity.create({projectid: project.id,activity:activity,creater:user.username})
					.done(function(error, activity) {
						if(error){
							res.json({'error': 'error in creating activity'});
						} else {
							console.log("Uploading files for new project ", project);
			        		uploadProjectFiles(project);
						}
					});	         		
                }
            });
	   	}
	},

	/**
	* Delete project from list
	*/
	deleteproject : function(req,res)
	{
		projectid = req.param("projectid");
		password = req.param("password");
		bcrypt.compare(password, req.user.password, function (err, result) {
          if (!result)
		  {
			res.send({message : 'Invalid Password', success: false});
		  }
		  else
		  {
	  		Project.destroy({"id": projectid}, function (error, project) {
				if (error) res.send({message : "error", success: false});
				else{
					File.destroy({projectid : projectid}, function(error, project){
						if (error) res.send({message : "error", success: false});
						else res.send({message : "success", success : true});
					});	
				}			
			});
		  }
        });		
	},
	/**
	*  Find all project list
	*/
	
	findproject:function(req,res){
		var username=req.param("username");
		//console.log(username,"====username==")
		Project.find({
		  username: username
		}).done(function(err, projects) {

		  // Error handling
		  if (err) {
			return console.log(err);

		  // Found multiple projects!
		  } else {
			//console.log("Users found:", projects);
			 res.send(projects);
		  }
		});
	},

	findColaboratedProjects:function(req,res){
		//console.log(username,"====username==")
		var projects = [];
		console.log(req.user);
		Colaborations.find({
		  colaborator: req.user.email , status : 2
		}).done(function(err, colaborations) {
		  // Error handling
		  if (err) {
			return console.log(err);

		  // Found multiple projects!
		  } else {
			//console.log("Users found:", projects);
			var i=0;
			function next(){
				if(i<colaborations.length){
					Project.findOne({id : colaborations[i].projectid}).done(function(err, porject){
						if(err){res.send({message : "Db Error"});return}
						else{
							projects.push(porject);
							next(++i);
						}
					});
				}else{
					res.send({message : "success", projects : projects});
				}
			}
			next();
		  }
		});
	},
	
	/**
	 * find user files
	*/
	findfiles:function(req,res){
		var projectid=req.param("projectid");
		console.log(projectid,"====projectid==")
		File.find({projectid: projectid}).done(function(err, files) {
		  // Error handling
		  if (err) {
			return console.log(err);
		  // Found multiple projects!
		  } else {
			//console.log("Users found:", projects);
			 res.send(files);
		  }
		});
	},
	
	getUserSubscription : function(req, res){
		userid = req.user.id;

		Subscription.find()
		.done(function(error, sub){
			if(error){
				console.log(error);
				res.send({message : 'Error'});
			} else {

				function subscription(sub){
					var z = -1;
					function next(){
						z++;
						if(z < sub.length){
							UserSubscription.findOne({userid : userid, subscriptionid : sub[z].id})
							.done(function(error, us){
								if(error){
									console.log(error);
									next();
								} else if(us){
									sub[z].status = us.status;
									next();
								} else {
									sub[z].status = false;
									next();
								}
							});
						} else {
							res.send({message : 'success', userSubscriptions : sub});
						}
					}
					next();
				}

				try{
					subscription(sub);
				} catch(e){
					console.log(e);
					res.send({message : 'Error'});
				}

			}
		});
	},

	subscribeMe : function(req, res){
		var subscriptionId = req.param('subscriptionId');
		var status = req.param('status');

		if(subscriptionId){
			UserSubscription.findOne({userid : req.user.id, subscriptionid : subscriptionId})
			.done(function(error, us){
				if(error){
					console.log(error);
					res.send({message : 'Error'});
				} else if(us && us != 'undefined'){
					console.log('in update');
					UserSubscription.update({id : us.id}, {status : status})
					.done(function(error, us){
						if(error){
							console.log(error);
							res.send({message : 'Error'});
						} else {
							//res.redirect('/getUserSubscription');
							res.send({message : 'success'});
						}
					});
				} else {

					UserSubscription.create({userid : req.user.id, subscriptionid : subscriptionId, status : status})
					.done(function(error, su){
						if(error){
							console.log(error);
							res.send({message : error});
						} else {
							//res.redirect('/getUserSubscription');

							res.send({message : 'success'});
						}
					});
				}
			});
		} else {
			res.send({message : 'error'});
		}
	},
	

	
	 _config: {}
};
module.exports = AuthController;

module.exports.blueprints = {
 
  // Expose a route for every method,
  // e.g.
  // `/auth/foo` =&gt; `foo: function (req, res) {}`
  actions: true,
 
  // Expose a RESTful API, e.g.
  // `post /auth` =&gt; `create: function (req, res) {}`
  rest: true,
 
  // Expose simple CRUD shortcuts, e.g.
  // `/auth/create` =&gt; `create: function (req, res) {}`
  // (useful for prototyping)
  shortcuts: true
 
};