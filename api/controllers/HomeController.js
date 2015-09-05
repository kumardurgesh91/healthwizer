/**
 * HomeController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var sid = require('shortid');
//var JSZip = require("jszip");
var fs = require('fs');
var mkdirp = require('mkdirp');
var bcrypt = require('bcrypt-nodejs');
var UPLOAD_PATH = './assets/images';
var request = require('request');
var LABBOOK_UPLOAD = '/images/labbook_files';
var ZIP_FOLDER_PATH = '/exported_labbooks';
var MAIL_ATTACHEMENTS_FOLDER_PATH = './assets/mail_attachements';

 
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

function createActivity(data,callback){
	var activity = "";
	function createActivity(){
		Projectactivity.create({projectid: data.projectid,activity:activity,creater:data.user.username}).done(function(error, activity) {
			if (error) {
				callback("DB Error", false);
			} else {
				callback(null, true);
			}
		});
	}
	if(data.type=="note"){
		activity = "The Note <a href='#c' class='activity_link' data-toggle='tab' class='activity_link'>"+ data.note.name + "</a> was "+data.action+" by <a href='#/people' ng-click='viewProfile("+data.user.id+")' class='activity_link'>" + data.user.username+"  </a> in " + data.projectname;
		createActivity();
	} else if(data.type=="litrature"){
		activity = "The Litrature <a href='#c' class='activity_link' data-toggle='tab' class='activity_link'>"+ data.litrature.name + "</a> was "+data.action+" by <a href='#/people' ng-click='viewProfile("+data.user.id+")' class='activity_link'>" + data.user.username+"  </a> in " + data.projectname;
		createActivity();
	} else if(data.type=="experiment"){
		activity = "The Experiment <a href='#c' class='activity_link' data-toggle='tab' class='activity_link'>"+ data.experiment.name + "</a> was "+data.action+" by <a href='#/people' ng-click='viewProfile("+data.user.id+")' class='activity_link'>" + data.user.username+"  </a> in " + data.projectname;
		createActivity();
	} else if(data.type=="protocol"){
		activity = "The Protocol <a href='#c' class='activity_link' data-toggle='tab' class='activity_link'>"+ data.protocol.name + "</a> was "+data.action+" by <a href='#/people' ng-click='viewProfile("+data.user.id+")' class='activity_link'>" + data.user.username+"  </a> in " + data.projectname;
		createActivity();
	} else if(data.type=="colaboration"){
		User.findOne({email : data.colaborator}).done(function(err, user){
			if(user){
				console.log('user', user);
				activity = '<a href="#/people" class="activity_link" ng-click="viewProfile('+data.user.id+')">'+ data.user.firstname +' '+data.user.lastname +'</a> Added  <a href="#/people" ng-click="viewProfile('+user.id+')" class="activity_link">' +user.firstname+' '+user.lastname+ '  </a> in Project ' + data.projectname;
				createActivity();
			}
		});
	}
}

module.exports = {

	/**
	* show index view(Newsfeed page)
	*/
	searchSuggestions : function(req, res){	

		var countries = {
		    "AD": "Ankit",
		    "AE": "United Arab Emirates",
		    "AF": "Afghanistan",
		    "AG": "Antigua and Barbuda",
		    "AI": "Anguilla",
		    "AL": "Albania",
		    "PG": "Papua New Guinea",
		    "PH": "Philippines",
		    "SO": "Somalia",
		    "SR": "Suriname",
		    "ST": "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
		    "SU": "Union of Soviet Socialist Republics",
		    "SV": "El Salvador",
		    "SY": "Syria",
		    "SZ": "Swaziland",
		    "TC": "Turks and Caicos Islands",
		    "TD": "Chad",
		    "TF": "French Southern Territories",
		    "TG": "Togo",
		    "TH": "Thailand",
		    "TJ": "Tajikistan",
		    "TK": "Tokelau",
		    "TL": "Timor-Leste",
		    "TM": "Turkmenistan",
		    "TN": "Tunisia",
		    "TO": "Tonga",
		    "TR": "Turkey"
		}
		var suggestionResults = {
		    // Query is not required as of version 1.2.5
		    "query": "Unit",
		    "suggestions": countries
		}
		res.json({
		    // Query is not required as of version 1.2.5
		    "query": "Unit",
		    "suggestions": [
		        { "value": "United Arab Emirates", "data": "AE" },
		        { "value": "United Kingdom",       "data": "UK" },
		        { "value": "United States",        "data": "US" }
		    ]
		});
	},

	users : function(req, res){
		User.find({ id: { '!': req.user.id }}).done(function(err ,users){
			if(err){res.send({message : "Db Error"})}
			else{ res.send({message : "success", users : users}); }
		});
	},

	setMailAsRead : function(req, res){
		if(req.body.id){
			SentMails.update({id : req.body.id},{isUnread : "read"}).done(function(err, mail){
				res.send({message : "success", mail : mail});
			});
		}else{
			res.send({message : "Parameter Missing"});
		}
	},

	setMailAsUnread : function(req, res){
		if(req.body.id){
			SentMails.update({id : req.body.id},{isUnread : "unread"}).done(function(err, mail){
				res.send({message : "success", mail : mail});
			});
		}else{
			res.send({message : "Parameter Missing"});
		}
	},

	sendEmail : function(req, res){
		Mails.create({
			subject : req.body.subject,
			body	: req.body.mail_body,
			createrid : req.user.id,
			creatername : req.user.firstname+" "+req.user.lastname,
			category : req.body.category?req.body.category:"normal",
			hasAttachments : (req.files.attachments?true:false) || (req.param('isForwared') == 'true' && req.param('fwdatt') && req.param('fwdatt').length > 0 ? true : false) ? true : false,
			to : req.body.to?req.body.to:"",
			cc : req.body.cc?req.body.cc:"",
			bcc : req.body.bcc?req.body.bcc:""
		}).done(function(err, email){
			if(err){
				res.send({message : "Db Error"});
				return;
			}

			// is email from draft
			var draftMailId = req.param('draftMailId');
			if(draftMailId != '' && typeof draftMailId != 'undefined'){

				// removing draft

				function removeDraftMail(draftMailId){
					Mails.destroy({id : draftMailId})
					.done(function(err, draft){
						if(err){
							console.log(err);
						} else {
							console.log("draft removed");
						}
					});
				}
				// adding attachements draft to mail
				function removeAttachment(id){
					Attachment.destroy({id : id})
					.done(function(err, attachement){
						if(err){
							console.log(err);
						} else {
							console.log("attachement removed");
						}
					});
				}

				function addingDraftAttToEmail(){
					Attachment.find({mailid : draftMailId})
					.done(function(err, attachements){
						if(err){
							console.log(err);
						} else if(attachements.length >0) {
							var z = -1;
							function next(){
								z++;
								if(z<attachements.length){
									Attachment.create({mailid: email.id, filename: attachements[z].filename,filepath:attachements[z].filepath}).done(function(error, file) {
										if (error) {
											console.log(error);
											next();
										} else {
											Mails.update({id : email.id}, {hasAttachments : true})
											.done(function(err, mail){
												if(err){
													console.log(err);
												}
												try{
													removeAttachment(attachements[z].id);
												} catch(exception){
													console.log(exception);
												}
												next();
											});
										}
									});
								} else {
									try{
										removeDraftMail(draftMailId);
									} catch(exception){
										console.log(exception);
									}
								}
							}
							next();
						} else {
							try{
								removeDraftMail(draftMailId);
							} catch(exception){
								console.log(exception);
							}
						}
					});
				}

				try{
					addingDraftAttToEmail();
				} catch(exception){
					console.log(exception);
				}
			}

			var isForwared = req.param('isForwared');
			if(isForwared == 'true'){
				function saveAtt(attachments){
					var z = -1;
					function next(){
						z++;
						if(z < attachments.length){
							Attachment.create({
								mailid: email.id, 
								filename: attachments[z].filename,
								filepath:attachments[z].filepath})
							.done(function(error, file) {
								if(error){
									console.log(err);
								}
								next();
							});
						} 
					}
					next();
				}
				saveAtt(JSON.parse(req.param('fwdatt')));
			}

			function createSentEmailEntry(email){
				var to = req.body.to.trim().split(",");
				var cc = req.body.cc.trim().split(",");
				var bcc = req.body.bcc.trim().split(",");
				if(to.length==1 && to[0].trim()=="")
					to.pop();
				if(cc.length==1 && cc[0].trim()=="")
					cc.pop();
				if(bcc.length==1 && bcc[0].trim()=="")
					bcc.pop();
				cc = cc.filter(function(x) { return to.indexOf(x) < 0;});
				bcc = bcc.filter(function(x) { return to.indexOf(x) < 0;} );
				bcc = bcc.filter(function(x) { return cc.indexOf(x) < 0;});
				function sendMailToTo(cb){
					var i=-1;
					function next(){
						i++;
						if(to.length>i){
							User.findOne({email : to[i]}).done(function(err, user){
								if(user){
									SentMails.create({
										mailid : email.id,
										sentby : email.createrid,
										sendername : email.creatername,
										sentAs : "to",
										sentto : user.id,
										recievername : user.firstname+" "+user.lastname,
										isUnread : "unread",
										isImportant : false
									}).done(function(err, sentmail){
										next();
									});
								}else{
									next();
								}
							});
						}else{
							cb(null, "success");
						}
					}
					next();
				}
				function sendMailToCc(cb){
					var i=-1;
					function next(){
						i++;
						if(cc.length>i){
							User.findOne({email : cc[i]}).done(function(err, user){
								if(user){
									SentMails.create({
										mailid : email.id,
										sentby : email.createrid,
										sendername : email.creatername,
										sentAs : "cc",
										sentto : user.id,
										recievername : user.firstname+" "+user.lastname,
										isUnread : "unread",
										isImportant : false
									}).done(function(err, sentmail){
										next();
									});
								}else{
									next();
								}
							});
						}else{
							cb(null, "success");
						}
					}
					next();
				}
				function sendMailToBcc(cb){
					var i=-1;
					function next(){
						i++;
						if(bcc.length>i){
							User.findOne({email : bcc[i]}).done(function(err, user){
								if(user){
									SentMails.create({
										mailid : email.id,
										sentby : email.createrid,
										sendername : email.creatername,
										sentAs : "bcc",
										sentto : user.id,
										recievername : user.firstname+" "+user.lastname,
										isUnread : "unread",
										isImportant : false
									}).done(function(err, sentmail){
										next();
									});
								}else{
									next();
								}
							});
						}else{
							cb(null, "success");
						}
					}
					next();
				}
				sendMailToTo( function(err, mailtoToResponse){
					sendMailToCc(function(err, mailtoCcResponse){
						sendMailToBcc(function(err, mailtoBccResponse){
							res.send({message : "success"});
						});
					});
				});
			};
			if(email.hasAttachments){				
				var i=-1;
				function next(){		
					i++;
					if(req.files && req.files.attachments && req.files.attachments.length>i){
						console.log(req.files.attachments.length);
						var file = req.files.attachments[i];
						var filename = file.name;
						var dirPath = '/images/attachments/'+email.id;
						var filePath = dirPath + '/' + filename;
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
							  				Attachment.create({mailid: email.id, filename: filename,filepath:filePath}).done(function(error, file) {
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
					}else if(req.files && req.files.attachments && typeof req.files.attachments.length == "undefined"){
						var file = req.files.attachments;
						var filename = file.name;
						var dirPath = '/images/attachments/'+email.id;
						var filePath = dirPath + '/' + filename;
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
							  				Attachment.create({mailid: email.id, filename: filename,filepath:filePath}).done(function(error, file) {
												if (error) {
													res.send(500, { message: "DB Error", error : error});
												} else {
													createSentEmailEntry(email);
												}
											});							  			
							  			}
						  			}
									})
						  	}
						});
					}else{
						createSentEmailEntry(email);
					}
				}
				next();
			}else{
				createSentEmailEntry(email);
			}
		});		
	},

	findCollaborators : function(req,res){
		Colaborations.find({projectid : req.body.projectid, owner : req.user.id}).done(function(err, colaborations){
			res.send({message : "success", colaborations : colaborations});
		});
	},
	draftEmail : function(req, res){
		var draftMailId = req.param('draftMailId');
		if(draftMailId != '' && typeof draftMailId != 'undefined'){
				Mails.update({id : draftMailId},{
				subject : req.body.subject,
				body	: req.body.mail_body,
				createrid : req.user.id,
				creatername : req.user.firstname+" "+req.user.lastname,
				category : req.body.category?req.body.category:"normal",
				hasAttachments : req.files.attachments?true:false,
				isDraft : true,
				to : req.body.to?req.body.to:"",
				cc : req.body.cc?req.body.cc:"",
				bcc : req.body.bcc?req.body.bcc:"",

			}).done(function(err, email){
				if(err){
					res.send({message : "Db Error"});
					return;
				}
				email = email[0];
				console.log(email);
				
				if(email.hasAttachments){				
					var i=-1;
					function next(){		
						i++;
						if(req.files && req.files.attachments && req.files.attachments.length>i){
							console.log(req.files.attachments.length);
							var file = req.files.attachments[i];
							var filename = file.name;
							var dirPath = '/images/attachments/'+email.id;
							var filePath = dirPath + '/' + filename;
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
								  				Attachment.create({mailid: email.id, filename: filename,filepath:filePath}).done(function(error, file) {
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
						}else if(req.files && req.files.attachments && typeof req.files.attachments.length == "undefined"){
							var file = req.files.attachments;
							var filename = file.name;
							var dirPath = '/images/attachments/'+email.id;
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
								  				Attachment.create({mailid: email.id, filename: filename,filepath:filePath}).done(function(error, file) {
													if (error) {
														res.send(500, { message: "DB Error", error : error});
													} else {
														res.send({message : "success"});
													}
												});							  			
								  			}
							  			}
										})
							  	}
							});
						}else{
							res.send({message : "success"});
						}
					}
					next();
				}else{
					res.send({message : "success"});
				}
			});		
		} else {
			Mails.create({
			subject : req.body.subject,
			body	: req.body.mail_body,
			createrid : req.user.id,
			creatername : req.user.firstname+" "+req.user.lastname,
			category : req.body.category?req.body.category:"normal",
			hasAttachments : req.files.attachments?true:false,
			isDraft : true,
			to : req.body.to?req.body.to:"",
			cc : req.body.cc?req.body.cc:"",
			bcc : req.body.bcc?req.body.bcc:""
			}).done(function(err, email){
				if(err){
					res.send({message : "Db Error"});
					return;
				}
				
				if(email.hasAttachments){				
					var i=-1;
					function next(){		
						i++;
						if(req.files && req.files.attachments && req.files.attachments.length>i){
							console.log(req.files.attachments.length);
							var file = req.files.attachments[i];
							var filename = file.name;
							var dirPath = '/images/attachments/'+email.id;
							var filePath = dirPath + '/' + filename;
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
								  				Attachment.create({mailid: email.id, filename: filename,filepath:filePath}).done(function(error, file) {
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
						}else if(req.files && req.files.attachments && typeof req.files.attachments.length == "undefined"){
							console.log("Attachments Length is One");
							var file = req.files.attachments;
							var filename = file.name;
							var dirPath = '/images/attachments/'+email.id;
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
								  				Attachment.create({mailid: email.id, filename: filename,filepath:filePath}).done(function(error, file) {
													if (error) {
														res.send(500, { message: "DB Error", error : error});
													} else {
														res.send({message : "success"});
													}
												});							  			
								  			}
							  			}
										})
							  	}
							});
						}else{
							res.send({message : "success"});
						}
					}
					next();
				}else{
					res.send({message : "success"});
				}
			});		
		}
	},

	getEmails : function(req, res){
		var inbox = new Array();
		var sent = new Array();
		var draftsEmail = new Array();
		var trashEmail = new Array();
		var newEmails = 0;

		/**
		 * Adding Draft Mails
		 */

		 function findTrashEmail(){

		 	function findDraftTrash(){
		 		Mails.find({createrid : req.user.id, isDraft : true, isTrashed : true, isDeleted : false})
			 	.sort({id : 'desc'})
			 	.done(function(err, drafts){
			 		if(err){
			 			console.log(err);
			 			res.send({message : "success", inbox : inbox, sent : sent, newEmails : newEmails, drafts : draftsEmail, trash : trashEmail});
			 		} else if(drafts.length > 0) {
			 			var z = -1;
			 			function next(){
			 				z++;
			 				if(z < drafts.length){
			 					drafts[z].trashType = 'draft';
			 					if(drafts[z].hasAttachments){
			 						Attachment.find({mailid : drafts[z].id})
			 						.done(function(err, attachements){
			 							if(err){
			 								console.log(err);
			 								next();
			 							} else {
			 								drafts[z].attachements = attachements;
			 								trashEmail.push({mail : drafts[z]});
			 								next();
			 							}
			 						});
			 					} else {
			 						trashEmail.push({mail : drafts[z]});
			 						next();
			 					}
			 				} else {
			 					res.send({message : "success", inbox : inbox, sent : sent, newEmails : newEmails, drafts : draftsEmail, trash : trashEmail});
			 				}
			 			}
			 			next();
			 		} else {
			 			res.send({message : "success", inbox : inbox, sent : sent, newEmails : newEmails, drafts : draftsEmail, trash : trashEmail});
			 		}
			 	});
		 	}

		 	function findSentTrashMails(){
				SentMails.find({sentby : req.user.id})
				.sort({id : 'desc'})
				.done(function(err, OutgoingMails){
					
					var i=-1;
					function next(){
						i++;
						if(OutgoingMails.length>i){
							Mails.findOne({id:OutgoingMails[i].mailid, isDraft : false, isTrashed : true, isDeleted : false}).done(function(err, email){
								if(err){
									console.log("Err = ", err);
									res.send({message : "error"});
								} else if(email){
									email.trashType = 'sent';
									trashEmail.push({mail : email, details : OutgoingMails[i]});
								}
								next();
							});
						}else{
							findDraftTrash();
						}
					}
					next();
				});
			}

			function findInboxTrashEmail(){
				SentMails.find({sentto : req.user.id, isTrashed : true, isDeleted : false}).done(function(err, IncommingMails){			
					var i=-1;
					function next(){
						i++;
						if(IncommingMails.length>i){
							Mails.findOne({id:IncommingMails[i].mailid, isDraft : false, isDeleted : false}).done(function(err, email){
								if(err){
									console.log(err);
								} else if(email){
									email.trashType = 'inbox';
									trashEmail.push({mail : email, details : IncommingMails[i]});
								}
								next();
							});
						}else{
							findSentTrashMails();
						}
					}
					next();
				});
			}

			try {
				findInboxTrashEmail();
			} catch(experiment){
				console.log(e);
			}
		 }

		 function findDraftsMails(){
		 	Mails.find({createrid : req.user.id, isDraft : true, isTrashed : false, isDeleted : false})
		 	.sort({id : 'desc'})
		 	.done(function(err, drafts){
		 		if(err){
		 			console.log(err);
		 			res.send({message : "success", inbox : inbox, sent : sent, newEmails : newEmails, drafts : draftsEmail});
		 		} else if(drafts.length > 0) {
		 			var z = -1;
		 			function next(){
		 				z++;
		 				if(z < drafts.length){
		 					if(drafts[z].hasAttachments){
		 						Attachment.find({mailid : drafts[z].id})
		 						.done(function(err, attachements){
		 							if(err){
		 								console.log(err);
		 								next();
		 							/*} else if(attachement.length > 0){
		 								var y = -1;
		 								y++;
		 								function nextAttachement(){
		 									if(attachement.length > y){

		 									} else {

		 									}
		 								}*/
		 							} else {
		 								drafts[z].attachements = attachements;
		 								draftsEmail.push(drafts[z]);
		 								next();
		 							}
		 						});
		 					} else {
		 						draftsEmail.push(drafts[z]);
		 						next();
		 					}
		 				} else {
		 					try{
		 						findTrashEmail();
		 					} catch(exception){
		 						console.log(exception);
		 					}
		 					//res.send({message : "success", inbox : inbox, sent : sent, newEmails : newEmails, drafts : draftsEmail});
		 				}
		 			}
		 			next();
		 		} else {
		 			try{
 						findTrashEmail();
 					} catch(exception){
 						console.log(exception);
 					}
		 			//res.send({message : "success", inbox : inbox, sent : sent, newEmails : newEmails, drafts : draftsEmail});
		 		}
		 	});
		 }

		function findSentMails(){
			SentMails.find({sentby : req.user.id})
			.sort({id : 'desc'})
			.done(function(err, OutgoingMails){
				
				var i=-1;
				function next(){
					i++;
					if(OutgoingMails.length>i){
						Mails.findOne({id:OutgoingMails[i].mailid, isDraft : false, isTrashed : false, isDeleted : false}).done(function(err, email){
							if(err){
								console.log("Err = ", err);
								res.send({message : "error"});
							} else if(email){
								sent.push({mail : email, details : OutgoingMails[i]});
							}
							next();
						});
					}else{
						try{
							findDraftsMails();
						} catch(exception){
							console.log(exception);
						}
					}
				}
				next();
			});
		};
		SentMails.find({sentto : req.user.id, isTrashed : false, isDeleted : false}).done(function(err, IncommingMails){			
			var i=-1;
			function next(){
				i++;
				if(IncommingMails.length>i){
					if(IncommingMails[i].isUnread=="unread")
						newEmails++;
					Mails.findOne({id:IncommingMails[i].mailid, isDraft : false, isDeleted : false}).done(function(err, email){
						if(err){
							console.log(err);
						} else if(email){
							inbox.push({mail : email, details : IncommingMails[i]});
						}
						next();
					});
				}else{
					findSentMails();
				}
			}
			next();
		});
	},
	getUserSuggession : function(req, res){
		var projectid = req.param('projectid');
		var activity = req.param('activity');
		if(activity == 'colaboration'){
			if(projectid){
				Colaborations.find({projectid : projectid, status : 1})
				.done(function(err, colaborations){
					if(err){
						res.send({message : "DB Error"});
					} else if(colaborations.length > 0){
						var existUsers = new Array();
						existUsers.push(req.user.email);
						for(var k = 0; k < colaborations.length; k++){
							existUsers.push(colaborations[k].colaborator)
						}
						User.find({
							email : {'!' : existUsers}
						})
						.done(function(err, users){
							if(err){
								res.send({message : "DB Error"});
							} else {
								var newUserList = new Array();
								for(var l = 0; l < users.length; l++){
									newUserList.push(users[l]);
								}
								var removedCount = 0;
								for(var m = 0; m < users.length; m++){
									for(var k = 0; k < existUsers.length; k++){
										if(users[m].email == existUsers[k]){
											//newUserList.splice(m-removedCount, 1);
											for(var l = 0 ; l<newUserList.length; l++){
												if(newUserList[l].email == existUsers[k]){
													newUserList.splice(k, 1);
												}
											}
										}
									}
								}
								res.send({message : "success", users : newUserList});
							}
						});
					} else {
						User.find({ email: { '!': req.user.email }}).done(function(err ,users){
							if(err){res.send({message : "Db Error"})}
							else{ res.send({message : "success", users : users}); }
						});
					}
				});
			} else {
				res.send({message : ""});	
			}
		} else {
			res.send({message : ""});	
		}
	},
	createDiscussions : function(req, res){
		var obj = {projectid : req.body.projectid, description : req.body.description.toString(), title : req.body.title, creatername : req.user.username, createrid : req.user.id};
		console.log("OBJ = ", obj);
		Discussion.create(obj).done(function(err, discussion){
			if(err) {
				console.log("Error = ", err);
				res.send({message : "Db Error"});		
				return;
			}
			res.send({message : "success"});
		});	
	},

	 createDiscussionComment : function(req, res){
               DiscussionComment.create({discussionid : req.body.discussionid, comment : req.body.comm, creatername : req.user.firstname, createrid : req.user.id}).done(function(err, comment){
                       if(err){
                               res.send({message : "success"});
                               return;
                       }
                       res.send({message : "success", comment : comment});        
               });                
       },

       getDiscussionComments : function(req, res){
               DiscussionComment.find({discussionid : req.body.discussionid}).done(function(err, comments){
                       if(err){
                               res.send({message : "success"});
                               return;
                       }
                       res.send({message : "success", comments : comments});        
               });
       },

	getDiscussions : function(req, res){
		Discussion.find({projectid : req.body.projectid}).done(function(err, discussions){
			if(err) {
				res.send({message : "Db Error"});		
				return;
			}
			res.send({message : "success", discussions : discussions});
		});		
	},

	viewProfile : function(req, res){
		User.findOne({id : req.body.userid}).done(function(err ,user){
			if(err){res.send({message : "Db Error"})}
			else{ res.send({message : "success", user : user})}
		});
	},
	newsFeeds : function(req, res){
		newsfeed.find({}).done(function(err, newsfeeds){
			if(err){res.send({message : "DB Error"});}
			else{res.send({message : "success", newsfeeds : newsfeeds});}
		});
	},

	addColaborator : function(req, res){
		var users = req.body.users.split(",");
		User.find({id : users}).done(function(err, users){
			var i=-1;
			function next(){
				i++;
				if(users.length>i){
					Colaborations.create({
						owner : req.user.id, 
						projectid : req.body.projectid,
						colaborator : users[i].username,
						colaboratorid : users[i].id,
						accepted : false,
						status : 1,
						message : req.body.message, 
						subject : req.body.subject
					})
					.done(function(err, colaboration){
						if(err){res.send({message : "err"+err});return;};
						createActivity({projectname : req.body.projectname, projectid : req.body.projectid, user : req.user, action : "added", type : "colaboration", colaborator : users[i].trim()}, next);
					});
				}else{
					res.send({message : "success"});
				}
			}
			next();
		});		
	},

	deleteColaboration : function(req, res){
		Colaborations.destroy({id: req.body.colaborationid}).done(function(err, data){			
			Colaborations.find({projectid : data.projectid}).done(function(err, colaborations){
				res.send({"message" : "success", colaborations : colaborations});
			});	
		});
	},

	reAddColaboration : function(req, res){
		Colaborations.update({id: req.body.colaborationid}, {status : 1}).done(function(err, data){
			Colaborations.find({projectid : data.projectid}).done(function(err, colaborations){
				res.send({"message" : "success", colaborations : colaborations});
			});	
		});
	},
	

	findProjectTags : function(req, res){
		var tags = [];
		Notes.find({projectid : req.body.projectid}).done(function(err, notes){
			if(err){res.send({message : "DB Error"});}
			else{
				function protocolTags(){
					Protocol.find({projectid : req.body.projectid}).done(function(err, protocols){
						protocols.forEach(function(protocol, index){
							if(protocol.tags.trim()!=""){
								tags = tags.concat(protocol.tags.trim().split(','));							
							}
						});
						res.send({message : "success", tags : tags});
					})
				}
				function literatureTags(){
					Litrature.find({projectid : req.body.projectid}).done(function(err, litratures){
						litratures.forEach(function(litrature, index){
							if(litrature.tags.trim()!=""){
								tags = tags.concat(litrature.tags.trim().split(','));							
							}
						});
						protocolTags();	
					})
				}
				function experimentTags(){
					Experiments.find({projectid : req.body.projectid}).done(function(err, experiments){
						experiments.forEach(function(experiment, index){
							if(experiment.tags.trim()!=""){
								tags = tags.concat(experiment.tags.trim().split(','));							
							}
						});
						literatureTags();	
					})
				}
				notes.forEach(function(note, index){
					if(note.tags.trim()!=""){
						tags = tags.concat(note.tags.trim().split(','));							
					}
				});
				experimentTags();					
			}
		});
	},
	feedback : function(req, res){
		if(req.body.feedback_text){
			FeedbackEmail.create({userid : req.user.id, feedback_text : req.body.feedback_text}).done(function(err, feedbackEmail){
				if(err){res.send({message : "success"});}
				res.send({message : "success", feedbackEmail:feedbackEmail});
			});
		}else{
			res.send({message:"failure"});
		}
	},

    index: function (req,res)
    {

        //console.log(req.user);
        res.view({
            user: req.user
        });
    },
	/**
	* show profile page
	*/
	profile:function(req,res){
		 res.view({
            user: req.user
        });
		
	},
	/**
	* show profile setting page
	*/
	profilesetting:function(req,res){
		 res.view({
            user: req.user
        });
		
	},
	
	/**
	*   show project page
	*/
	project:function(req,res){
		console.log("=======from here-=======");
		 res.view({
            user: req.user
        });
		
	},
	/**
	* show dash board (Library page here)
	*/
	ds:function(req,res){
		  res.view({
            user: req.user
        });
		
	},
	
	/**
	*   show project workspace
	*/
	project_workspace:function(req,res){
		res.view({
			user: req.user
		});
	},
	
	/**
	* show project management
	*/
	
	project_management:function(req,res)
	{
		res.view({
			user: req.user
		});
	},
	/**
	*  upadate user profile
	*/
	updateuserprofile:function(req,res){
		var firstname = req.param("fname") != 'undefined' ? req.param("fname") : '';
		var lastname = req.param("lname") != 'undefined' ? req.param("lname") : '';
		var city = req.param("city") != 'undefined' ? req.param("city") : '';
		var country = req.param("country") != 'undefined' ? req.param("country") : '';
		var aboutme= req.param("aboutme") != 'undefined' ? req.param("aboutme") : '';
		var filex = req.param("file_x")!='undefined' ? req.param("file_x") : '';
		var filey = req.param("file_y")!='undefined' ? req.param("file_y") : '';
		var fileh = req.param("file_h")!='undefined' ? req.param("file_h") : '';
		var filew = req.param("file_w")!='undefined' ? req.param("file_w") : '';
		var file = req.param("file")!='undefined' ? req.param("file") : '';
		// FOR PIC UPLOAD
		//console.log("File = ", req.param("file"));

	    //var file = req.files && req.files.file ? req.files.file : '';

	    User.update({username: req.user.username }, { profilepic : file, firstname : firstname, lastname : lastname, city : city, country : country, aboutme : aboutme},         
			function(error, resUser) {
				if (error) {
                res.send(500, {error: "DB Error"});
            } else {
				res.send({message : "success", user : resUser});
            }
	  	});  
	    
	 // 	if(file != '' && file !='undefined'){
		// 	fileName = req.user.username + "." + fileExtension(safeFilename(file.name)),
		// 	dirPath = UPLOAD_PATH + '/' + req.user.username,
		// 	filePath = dirPath + '/' + fileName;
	 //     	try {	      		
		//       	mkdirp.sync(dirPath, 0755);
	 //    	} catch (e) {
		//       	console.log(e);
		//     }
	 // 	   	fs.readFile(file.path, function(err, data){
	 // 	   		if (err) {
		//         	res.json({'error': 'could not read file'});
		//       	} else {		      		
	 //        		fs.writeFile(filePath, data, {} , function (err) {	        			
		//           		if (err) 
		// 	            	res.json({'error': 'could not write file to storage'});
		// 	          	else {
		// 	          		var easyimg = require('easyimage');
		//         			easyimg.crop(
		// 					    {
		// 					        src:filePath, dst:filePath+".jpg",
		// 					        cropwidth:filew, cropheight:fileh,
		// 					        gravity:'North',
		// 					        x:filex, y:filey
		// 					    },
		// 					    function(err, stdout, stderr) {
		// 					    	console.log("Croping Image 2");
		// 					        if (err) throw err;
		// 					        console.log('Cropped');
		// 					    }
		// 					);
		// 				  	filePath=filePath.replace("/assets","");
		// 					User.update({ username : req.user.username }, { firstname : firstname, lastname : lastname, city : city, country : country, aboutme : aboutme, profilepic : filePath },								
		// 						function(error, resUser) {								
		// 							if (error) {
		//                     			res.send(500, {error: "DB Error"});
		// 	                		} else {
		// 			                    res.send({message : "success", user : resUser});
		// 			                }
		// 					  	}
		// 				  	); 
		//               	}
	 //        		});
	 //      		}
	 // 	   	});
		// } else {
		// 	User.update({username: req.user.username }, { profilepic : file, firstname : firstname, lastname : lastname, city : city, country : country, aboutme : aboutme},         
		// 		function(error, resUser) {
		// 			if (error) {
  //                   res.send(500, {error: "DB Error"});
  //               } else {
		// 			res.send({message : "success", user : resUser});
  //               }
		//   	});  
		// }
		
	},
	
	/**
	* update account password
	*/
	updateaccountpass:function(req,res){
		
		var password = req.param("curpassword");
		var newpassword = req.param("newpassword");
		var confirmpassword= req.param("confpassword");
		console.log(password,newpassword,confirmpassword,"from here");
		
		if(newpassword==confirmpassword){	
			bcrypt.compare(password, req.user.password, function (err, result) {
	          	if (!result){
	              res.send({ message : "invalid password" });
			  	}
			  	else{
					UserManager.hashPassword(newpassword, null, function (err, password, salt) {
						if (err) return next(err);
						newpassword = password;
						User.update({  username: req.user.username }, { password: newpassword},         
							function(error, resUser) {
								if (error) {
								console.log("error from here******");
								res.send(500, {error: "DB Error"});
							} else {
								console.log("data updated=================== password");
								res.send({ message : "success", user: resUser});
							}
					  	});    
					});
			  	}
					       
	        });
		}
		else
		{
			res.send({ message : "New Password and Confirm Password do not match" });
		}
	},
	/**
	* update account email
	*/
	updateaccountemail:function(req,res){
			
		var curemail = req.param("curemail");
		var newemail = req.param("newemail");
		
		User.findOne({username : req.user.username, email : curemail}).done(function(error, user) {
			console.log(user);
			if(user){
				User.update({username: user.username }, { email: newemail},         
					function(error, resUser) {
						if (error) {
							console.log("error from here******");
							res.send({message: "DB Error"});
						} else {
							req.user.email = resUser.email;
							res.send({message : "success", user : resUser});
						}
					}
				);
			}else{
				res.send({ message : "not success"});
			}           
		});
	},
		
	
	/**
	* update addreess 
	*/
	updateaddress:function(req,res){
			
		var houseno = req.param("houseno");
		var street = req.param("street");
		var city = req.param("city");
		var country = req.param("country");
		var postcode= req.param("postcode");
		
		User.findOne(req.user.username).done(function(error, user) {
			  
			  User.update({  username: req.user.username }, { houseno: houseno,street:street,city:city,country:country,postcode:postcode},         
					function(error, resUser) {
						if (error) {
						console.log("error from here******");
						res.send(500, {error: "DB Error"});
					} else {
						
						console.log("data updated");
						res.send({ message : "success", user: resUser});
					}
			  });           
			});
		},
		
	
	/**
	*  find project data
	*/
	findProjectdata:function(req,res){
		var projectid = req.param("projectid");
		Project.findOne(projectid).done(function(err, project) {
			// Error handling
		  if (err) {
			return console.log(err);
		  	// Found multiple projects!
		  } else {
			//console.log("Users found:", project);
			 res.send(project);
		 	//res.redirect('/project_workspace');
		  }
		});
	},
	
	
	
	/**
	* create notes from here
	*/
	
	createnote:function(req,res){
		var notename = req.param("notename");
		var tags = req.param("tags");
		var notedesc = req.param("notedesc");
		var filename = req.param("filename");
		var filepath = req.param("filepath");
		var projectid =req.param("projectid");
		var projectname =req.param("projectname");
		var notetype =req.param("notetype");
		var isDraftFlag = req.param("isDraft");
		var username = req.user.username;
		var filesids = '';

		var isDraft = false;
	      if(isDraftFlag == 1){
	        isDraft = false;
	      } else if(isDraftFlag == 0){
	        isDraft = true;
	      }

		function createLabBook(){
			username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
			LabBook.create({
				projectid: projectid,
				name : notename,
				description:notedesc, 
				tags: tags, 
				filename: filename,
				filepath:filepath,
				creater:username,
				type:notetype, 
				createrid : req.user.id, 
				labbooktype : 'note', 
				files : filesids,
				isDraft : isDraft
			}).done(function(error, note) {
				if (error) {
					console.log(error);
					res.send(500, {error: "DB Error"});
				} else {
					createActivity({projectname : projectname, projectid : projectid, user : req.user, action : "created", type : "note", note : note}, function(err, result){
						if(err) res.send(500, {error: "DB Error"});
						else res.json({success: true, notes : note});
					});				
				}
			});	
		}

		function uploadLabFiles(){
			var i = -1;
			// Iterating files
			function next() {
				i++;
				if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
					console.log('in multiple');
					var file = req.files.projectfile[i];
					var filename = file.name;
					var dirPath = LABBOOK_UPLOAD + '/' +projectid;
					var filePath = dirPath + '/' + filename;
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
						  				LabBookFiles.create({filename: filename,filepath:filePath}).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												console.log(file);
												filesids += file.id + ',';
												next();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
					var file = req.files.projectfile;
					var filename = file.name;
					var dirPath = LABBOOK_UPLOAD + '/' +projectid;
					var filePath = dirPath + '/' + filename;
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
						  				LabBookFiles.create({filename: filename,filepath:filePath }).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												filesids += file.id;
												createLabBook();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				} else {
					// Creating activity for multiple file uploades.
						createLabBook();
				}
			}
			next();
		}
		try {
			uploadLabFiles()
		} catch(exc){
			console.log(exc);
		}
	},
	
	/**
	* find note from here
	*/
	 findnote:function(req,res){
		 
		var projectid =req.param("projectid");
		
		LabBook.find({
		  projectid: projectid, labbooktype : 'note', isDeleted : false
		}).done(function(err, notes) {

		  // Error handling
		  if (err) {
			return console.log(err);

		  // Found multiple projects!
		  } else {

				function getNotes(notes){
					var k = -1;
					function nextNote(){
						k++;
						var files = new Array();
						if(k < notes.length){
							if(notes[k].files && notes[k].files != null && typeof notes[k].files != 'undefined') {
								var filesId = notes[k].files.split(',');
								var z = -1;
								
								function next(){
									z++;
									if(z < filesId.length){
										if(filesId[z] != ''){
											LabBookFiles.findOne({id : filesId[z]})
											.done(function(error, file){
												if(error){
													console.log(error);
													next();
												} else if(file){
													files.push(file);
													next();
												} else {
													next();
												}
											});
										} else {
											next();
										}
									} else {
										notes[k].files = files;
										nextNote();
									}
								}
								next();
							} else {
								nextNote();
							}
						} else {
							res.send(notes);
						}
					}
					nextNote();
				}
				getNotes(notes);
			
		  }
		});
	 },
	 /**
	 * create litrature here
	 */
	 createlirature :function(req,res){
		 
		 console.log("create litrature========");
		 
		var litraturename = req.param("litraturename");
		var tags = req.param("tags");
		var litratureabstarct = req.param("litratureabstarct");
		var litraturehighilight = req.param("litraturehighilight");
		var filename = req.param("filename");
		var filepath = req.param("filepath");
		var projectid =req.param("projectid");
		var projectname = req.param("projectname");
		var username = req.user.username;
		var filesids = '';

		var isDraftFlag = req.param("isDraft");
		var isDraft = false;
	      if(isDraftFlag == 1){
	        isDraft = false;
	      } else if(isDraftFlag == 0){
	        isDraft = true;
	      }

		function createLabBook(){
			username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
			LabBook.create({
				projectid: projectid,
				name : litraturename, 
				tags: tags, 
				abstract : litratureabstarct, 
				highlight : litraturehighilight, 
				filename: filename,
				filepath:filepath,
				creater:username, 
				createrid : req.user.id, 
				labbooktype : 'litrature', 
				files : filesids,
				isDraft : isDraft
			}).done(function(error, litrature) {
				if (error) {
					res.send(500, {error: "DB Error"});
				} else {
					createActivity({projectname : projectname, projectid : projectid, user : req.user, action : "created", type : "litrature", litrature : litrature}, function(err, result){
						if(err) res.send(500, {error: "DB Error"});
						else res.json({success: true, litrature : litrature});
					});				
				}
			});	
		}

		function uploadLabFiles(){
			var i = -1;
			// Iterating files
			function next() {
				i++;
				if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
					console.log('in multiple');
					var file = req.files.projectfile[i];
					var filename = file.name;
					var dirPath = LABBOOK_UPLOAD + '/' +projectid;
					var filePath = dirPath + '/' + filename;
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
						  				LabBookFiles.create({filename: filename,filepath:filePath}).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												console.log(file);
												filesids += file.id + ',';
												next();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
					var file = req.files.projectfile;
					var filename = file.name;
					var dirPath = LABBOOK_UPLOAD + '/' +projectid;
					var filePath = dirPath + '/' + filename;
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
						  				LabBookFiles.create({filename: filename,filepath:filePath }).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												filesids += file.id;
												createLabBook();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				} else {
					// Creating activity for multiple file uploades.
						createLabBook();
				}
			}
			next();
		}
		try {
			uploadLabFiles()
		} catch(exc){
			console.log(exc);
		}

	 },
	 
	 /**
	 * find litrature from here
	 */
	 
	 findlitrature: function(req,res){
		 
		var projectid =req.param("projectid");
		console.log("litrature");
		LabBook.find({
		  projectid: projectid, labbooktype : 'litrature', isDeleted : false
		}).done(function(err, litratures) {

		  // Error handling
		  if (err) {
			return console.log(err);

		  // Found multiple projects!
		  } else {
				
					function getLiterature(literatures){
						var k = -1;
						function nextLiterature(){
							 k++;
							 var files = new Array();
							if(k < literatures.length){
								if(literatures[k].files && literatures[k].files != null && typeof literatures[k].files != 'undefined') {
									var filesId = literatures[k].files.split(',');
									var z = -1;
									
									function next(){
										z++;
										if(z < filesId.length){
											if(filesId[z] != ''){
												LabBookFiles.findOne({id : filesId[z]})
												.done(function(error, file){
													if(error){
														console.log(error);
														next();
													} else if(file){
														files.push(file);
														next();
													} else {
														next();
													}
												});
											} else {
												next();
											}
										} else {
											literatures[k].files = files;
											nextLiterature();
										}
									}
									next();
								} else {
									nextLiterature();
								}
							} else {
								res.send(litratures);
							}
						}
					nextLiterature();
				}
				getLiterature(litratures);
				
		  }
		});
		 
	 },
	 
	 /**
	 * create protocol here
	 */
	 createprotocol :function(req,res){
		 
		var protocolname = req.param("protocolname");
		var tags = req.param("tags");
		var protocolmaterail = req.param("protocolmaterail");
		var protocolprocedure = req.param("protocolprocedure");
		var filename = req.param("filename");
		var filepath = req.param("filepath");
		var projectid =req.param("projectid");
		var projectname =req.param("projectname");	
		var username = req.user.username;
		var filesids = '';
		
		var isDraftFlag = req.param("isDraft");
		var isDraft = false;
	      if(isDraftFlag == 1){
	        isDraft = false;
	      } else if(isDraftFlag == 0){
	        isDraft = true;
	      }

		function createLabBook(){
			username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
			LabBook.create({
				projectid: projectid,
				name : protocolname,
				materials:protocolmaterail,
				procedure:protocolprocedure, 
				tags: tags, 
				creater:username, 
				createrid : req.user.id, 
				labbooktype : 'protocol', 
				files : filesids,
				isDraft : isDraft
			}).done(function(error, protocol) {
				if (error) {
					res.send(500, {error: "DB Error"});
				} else {
					createActivity({projectname : projectname, projectid : projectid, user : req.user, action : "created", type : "protocol", protocol : protocol}, function(err, result){
					if(err) res.send(500, {error: "DB Error"});
					else res.json({success: true, protocol : protocol});
				});				
				}
			});	
		}

		function uploadLabFiles(){
			var i = -1;
			// Iterating files
			function next() {
				i++;
				if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
					console.log('in multiple');
					var file = req.files.projectfile[i];
					var filename = file.name;
					var dirPath = LABBOOK_UPLOAD + '/' +projectid;
					var filePath = dirPath + '/' + filename;
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
						  				LabBookFiles.create({filename: filename,filepath:filePath}).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												console.log(file);
												filesids += file.id + ',';
												next();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
					var file = req.files.projectfile;
					var filename = file.name;
					var dirPath = LABBOOK_UPLOAD + '/' +projectid;
					var filePath = dirPath + '/' + filename;
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
						  				LabBookFiles.create({filename: filename,filepath:filePath }).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												filesids += file.id;
												createLabBook();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				} else {
					// Creating activity for multiple file uploades.
						createLabBook();
				}
			}
			next();
		}
		try {
			uploadLabFiles()
		} catch(exc){
			console.log(exc);
		}
	 },
	 
	 /**
	 * find protocols from here
	 */
	 
	 findprotocol: function(req,res){
		  
		var projectid =req.param("projectid");
		
		LabBook.find({
		  projectid: projectid, labbooktype : 'protocol', isDeleted : false
		}).done(function(err, protocols) {

		  // Error handling
		  if (err) {
			return console.log(err);

		  // Found multiple projects!
		  } else {
			
				function getProtocol(protocols){
					var k = -1;
					function nextProtocol(){
						 k++;
						 var files = new Array();
						if(k < protocols.length){
							if(protocols[k].files && protocols[k].files != null && typeof protocols[k].files != 'undefined') {
								var filesId = protocols[k].files.split(',');
								var z = -1;
								
								function next(){
									z++;
									if(z < filesId.length){
										if(filesId[z] != ''){
											LabBookFiles.findOne({id : filesId[z]})
											.done(function(error, file){
												if(error){
													console.log(error);
													next();
												} else if(file){
													files.push(file);
													next();
												} else {
													next();
												}
											});
										} else {
											next();
										}
									} else {
										protocols[k].files = files;
										nextProtocol();
									}
								}
								next();
							} else {
								nextProtocol();
							}
						} else {
							res.send(protocols);
						}
					}
					nextProtocol();
				}
				getProtocol(protocols);
			
		  }
		});
		 
	 },
	 
	/**
	* create exprement from here
	*/
 	createexperiment :function(req,res){
		var expname = req.param("expname");
		var tags = req.param("tags");
		var expbg = req.param("expbg");
		var expresult = req.param("expresult");
		var expcon = req.param("expcon");
		var filename = req.param("filename");
		var filepath = req.param("filepath");
		var projectid =req.param("projectid");
		var projectname =req.param("projectname");
		var isDraft = req.param("isDraft");
		var username = req.user.username;
		var filesids = '';

		var isDraftFlag = req.param("isDraft");
		var isDraft = false;
	      if(isDraftFlag == 1){
	        isDraft = false;
	      } else if(isDraftFlag == 0){
	        isDraft = true;
	      }

		
		function createLabBook(){
			username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
			LabBook.create({projectid: projectid,name : expname,background:expbg, result:expresult, conclusion:expcon, tags: tags, creater:username, createrid : req.user.id, labbooktype : 'experiment', files : filesids }).done(function(error, experiment) {
				if (error) {
					res.send(500, {error: "DB Error"});
				} else {
					createActivity({projectname : projectname , projectid : projectid, user : req.user, action : "created", type : "experiment", experiment : experiment}, function(err, result){
					if(err) res.send(500, {error: "DB Error"});
					else res.json({success: true, experiment : experiment});
				});				
				}
			});	
		}

		function uploadLabFiles(){
			var i = -1;
			// Iterating files
			function next() {
				i++;
				if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
					console.log('in multiple');
					var file = req.files.projectfile[i];
					var filename = file.name;
					var dirPath = LABBOOK_UPLOAD + '/' +projectid;
					var filePath = dirPath + '/' + filename;
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
						  				LabBookFiles.create({filename: filename,filepath:filePath}).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												console.log(file);
												filesids += file.id + ',';
												next();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
					var file = req.files.projectfile;
					var filename = file.name;
					var dirPath = LABBOOK_UPLOAD + '/' +projectid;
					var filePath = dirPath + '/' + filename;
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
						  				LabBookFiles.create({filename: filename,filepath:filePath }).done(function(error, file) {
											if (error) {
												res.send(500, { message: "DB Error", error : error});
											} else {
												filesids += file.id;
												createLabBook();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				} else {
					// Creating activity for multiple file uploades.
						createLabBook();
				}
			}
			next();
		}
		try {
			uploadLabFiles()
		} catch(exc){
			console.log(exc);
		}
 	},
	 
	/**
	* find experiments from here
	*/
	 
	 findexperiments: function(req,res){
		  
		var projectid =req.param("projectid");
		
		LabBook.find({
		  projectid: projectid , labbooktype : 'experiment', isDeleted : false
		}).done(function(err, experiments) {

		  // Error handling
		  if (err) {
			return console.log(err);

		  // Found multiple projects!
		  } else {
			
				function getExperiment(experiments){
					var k = -1;
					function nextExperiment(){
						 k++;
						 var files = new Array();
						if(k < experiments.length){
							if(experiments[k].files && experiments[k].files != null && typeof experiments[k].files != 'undefined') {
								var filesId = experiments[k].files.split(',');
								var z = -1;
								
								function next(){
									z++;
									if(z < filesId.length){
										if(filesId[z] != ''){
											LabBookFiles.findOne({id : filesId[z]})
											.done(function(error, file){
												if(error){
													console.log(error);
													next();
												} else if(file){
													files.push(file);
													next();
												} else {
													next();
												}
											});
										} else {
											next();
										}
									} else {
										experiments[k].files = files;
										nextExperiment();
									}
								}
								next();
							} else {
								nextExperiment();
							}
						} else {
							res.send(experiments);
						}
					}
					nextExperiment();
				}
				getExperiment(experiments);
			
		  }
		});
		 
	 },
	 
	 // /**
	 // * create activity
	 // */
	 
	 // createActivity: function(req,res){
		// var projectid =req.param("projectid");
		// var activity = req.param("activity");
		// var username = req.user.username;
	 // 	Projectactivity.create({projectid: projectid,activity:activity,creater:username}).done(function(error, activity) {
		// 	if (error) {
		// 		res.send(500, {message: "DB Error"});
		// 	} else {
		// 		res.json({success: true});
		// 	}
		// });
	 // },
	 
	 /**
	 * find activity from here
	 */
	 
	 findactivity : function(req,res){
		 if(req.param("projectid")){
		 	Projectactivity.find({ projectid: req.param("projectid")}).done(function(err, activities) {
			  // Error handling
			  if (err) {
			  	res.send({message : "DB error"});
				return console.log(err);
			  // Found multiple projects!
			  } else {
				//console.log("Users found:", projects);
				 res.send(activities);
			  }
			});
		}else{
			allActivities = [];
			Project.find({username : req.user.username})
			.done(function(err, result){
				var i=-1;
				function next(){
					i++;
					if(i<result.length){
						Projectactivity.find({ projectid: result[i].id}).done(function(err, activities) {
						  // Error handling
						  if (err) {
					  		res.send({message : "DB error"});
						  } else {
						 	allActivities = allActivities.concat(activities);
						 	next();
						  }
						});						
					}else{
						res.send({message : "success",allActivities : allActivities});
					}
				}	
				next();			
			});
		}
	 },
	 
	 /**
	 * update note fromm here
	 */
	 updatenote :function(req,res){
		var notename = req.param("notename");
		var tags = req.param("tags");
		var notedesc = req.param("notedesc");
		var filename = req.param("filename");
		var filepath = req.param("filepath");
		var projectid =req.param("projectid");
		var projectname =req.param("projectname");
		var notetype =req.param("notetype");
		var username = req.user.username;
		var noteid = req.param("noteid")
		var filesids = '';

		var isDraftFlag = req.param("isDraft");
		var isDraft = false;
	      if(isDraftFlag == 1){
	        isDraft = false;
	      } else if(isDraftFlag == 0){
	        isDraft = true;
	      }
			LabBook.findOne(noteid).done(function(error, labBook) {

				LabBookVersion.create({
					projectid: projectid, 
					labbookid: labBook.id, 
					name : labBook.name,
					description:labBook.description, 
					tags: labBook.tags,
					creater:labBook.creater,
					type:labBook.type, 
					createrid : labBook.createrid, 
					files : labBook.files, 
					labbooktype : labBook.labbooktype,
					isDeleted : labBook.isDeleted,
					isStared : labBook.isStared,
					isDraft : labBook.isDraft,
					isArchived : LabBook.isArchived
				})
				.done(function(err, noteversion){
						if (err) {
							console.log(err);
							res.send(500, {error: "DB Error"});
						} else {
							console.log(noteversion);
							username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
							
							function updateLabBook(){
								username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
								var obj = new Object();
								if(filesids == ''){
									obj = {
										projectid: projectid,
										name : notename,
										description:notedesc, 
										tags: tags,
										creater:username,
										type:notetype, 
										createrid : req.user.id,
										isDraft : isDraft
									};
								} else {
									obj = {
										projectid: projectid,
										name : notename,
										description:notedesc, 
										tags: tags,
										creater:username,
										type:notetype, 
										createrid : req.user.id, 
										files : filesids,
										isDraft : isDraft
									}
								}
								LabBook.update({  id: noteid }, obj,
									function(error, notes) {
										if (error) {
											console.log("error from here******");
											res.send(500, {error: "DB Error"});
										} else {
											createActivity({projectname : projectname, projectid : projectid, user : req.user, action : "updated", type : "note", note : notes[0]}, function(err, result){
												if(err) res.send(500, {error: "DB Error"});
												else res.json({success: true, notes : notes[0]});
											});								
										}
							  		}
							  	); 
							}

							function uploadLabFiles(){
								var i = -1;
								// Iterating files
								function next() {
									i++;
									if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
										console.log('in multiple');
										var file = req.files.projectfile[i];
										var filename = file.name;
										var dirPath = LABBOOK_UPLOAD + '/' +projectid;
										var filePath = dirPath + '/' + filename;
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
											  				LabBookFiles.create({filename: filename,filepath:filePath}).done(function(error, file) {
																if (error) {
																	res.send(500, { message: "DB Error", error : error});
																} else {
																	console.log(file);
																	filesids += file.id + ',';
																	next();
																}
															});							  			
											  			}
										  			}
												})
										  	}
										});
									}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
										var file = req.files.projectfile;
										var filename = file.name;
										var dirPath = LABBOOK_UPLOAD + '/' +projectid;
										var filePath = dirPath + '/' + filename;
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
											  				LabBookFiles.create({filename: filename,filepath:filePath }).done(function(error, file) {
																if (error) {
																	res.send(500, { message: "DB Error", error : error});
																} else {
																	filesids += file.id;
																	updateLabBook();
																}
															});							  			
											  			}
										  			}
												})
										  	}
										});
									} else {
										// Creating activity for multiple file uploades.
											updateLabBook();
									}
								}
								next();
							}
							try {
								uploadLabFiles()
							} catch(exc){
								console.log(exc);
							}
						}
				});        
			});
	 	},

 	/**
 	 * find note history
 	 */

 	 getNoteHistory : function(req, res){
 	 	var noteid = req.param('noteid');

 	 	if(noteid != '' && typeof noteid != 'undefined'){
 	 		LabBookVersion.find()
 	 		.where({labbookid : noteid})
 	 		.done(function(err, notes){
 	 			if(err){
 	 				console.log(err)
 	 				res.send(500, {error : "DB error"});
 	 			} else {;
 	 				LabBook.findOne({id : noteid})
 	 				.done(function(err, note){
 	 					if(err){
 	 						console.log(err)
 	 						res.send(500, {error : "DB error"});
 	 					} else {
 	 						note.current = true;
 	 						notes.push(note);
 	 						//res.send({message : "success", noteHistory : notes});

 	 						
								console.log('in else');
								function getNotes(notes){
									var k = -1;
									function nextNote(){
										k++;
										var files = new Array();
										if(k < notes.length){
											if(notes[k].files && notes[k].files != null && typeof notes[k].files != 'undefined') {
												var filesId = notes[k].files.split(',');
												var z = -1;
												
												function next(){
													z++;
													if(z < filesId.length){
														if(filesId[z] != ''){
															LabBookFiles.findOne({id : filesId[z]})
															.done(function(error, file){
																if(error){
																	console.log(error);
																	next();
																} else if(file){
																	files.push(file);
																	next();
																} else {
																	next();
																}
															});
														} else {
															next();
														}
													} else {
														notes[k].files = files;
														nextNote();
													}
												}
												next();
											} else {
												nextNote();
											}
										} else {
											res.send({message : "success", noteHistory : notes});
										}
									}
									nextNote();
								}
								getNotes(notes);

 	 					}
 	 				});
 	 			}
 	 		});
 	 	} else {
 	 		res.send({message : "note not find"});
 	 	}
 	 },


 	 /**
 	 * find protocol history
 	 */

 	 getProtocolHistory : function(req, res){
 	 	var protocolid = req.param('protocolid');

 	 	if(protocolid != '' && typeof protocolid != 'undefined'){
 	 		LabBookVersion.find()
 	 		.where({labbookid : protocolid})
 	 		.done(function(err, protocols){
 	 			if(err){
 	 				console.log(err)
 	 				res.send(500, {error : "DB error"});
 	 			} else {;
 	 				LabBook.findOne({id : protocolid})
 	 				.done(function(err, protocol){
 	 					if(err){
 	 						console.log(err)
 	 						res.send(500, {error : "DB error"});
 	 					} else {
 	 						protocol.current = true;
 	 						protocols.push(protocol);
 	 						//res.send({message : "success", protocolHistory : protocols});

								function getProtocol(protocols){
									var k = -1;
									function nextProtocol(){
										 k++;
										 var files = new Array();
										if(k < protocols.length){
											if(protocols[k].files && protocols[k].files != null && typeof protocols[k].files != 'undefined') {
												var filesId = protocols[k].files.split(',');
												var z = -1;
												
												function next(){
													z++;
													if(z < filesId.length){
														if(filesId[z] != ''){
															LabBookFiles.findOne({id : filesId[z]})
															.done(function(error, file){
																if(error){
																	console.log(error);
																	next();
																} else if(file){
																	files.push(file);
																	next();
																} else {
																	next();
																}
															});
														} else {
															next();
														}
													} else {
														protocols[k].files = files;
														nextProtocol();
													}
												}
												next();
											} else {
												nextProtocol();
											}
										} else {
											res.send({message : "success", protocolHistory : protocols});
										}
									}
									nextProtocol();
								}
								getProtocol(protocols);
 	 					}
 	 				});
 	 			}
 	 		});
 	 	} else {
 	 		res.send({message : "protocol not find"});
 	 	}
 	 },


 	 /**
 	 * find note history
 	 */

 	 getExperimentHistory : function(req, res){
 	 	var experimentid = req.param('experimentid');

 	 	if(experimentid != '' && typeof experimentid != 'undefined'){
 	 		LabBookVersion.find()
 	 		.where({labbookid : experimentid})
 	 		.done(function(err, experiments){
 	 			if(err){
 	 				console.log(err)
 	 				res.send(500, {error : "DB error"});
 	 			} else {;
 	 				LabBook.findOne({id : experimentid})
 	 				.done(function(err, experiment){
 	 					if(err){
 	 						console.log(err)
 	 						res.send(500, {error : "DB error"});
 	 					} else {
 	 						experiment.current = true;
 	 						experiments.push(experiment);
 	 						//res.send({message : "success", experimentHistory : experiments});

								function getExperiment(experiments){
									var k = -1;
									function nextExperiment(){
										 k++;
										 var files = new Array();
										if(k < experiments.length){
											if(experiments[k].files && experiments[k].files != null && typeof experiments[k].files != 'undefined') {
												var filesId = experiments[k].files.split(',');
												var z = -1;
												
												function next(){
													z++;
													if(z < filesId.length){
														if(filesId[z] != ''){
															LabBookFiles.findOne({id : filesId[z]})
															.done(function(error, file){
																if(error){
																	console.log(error);
																	next();
																} else if(file){
																	files.push(file);
																	next();
																} else {
																	next();
																}
															});
														} else {
															next();
														}
													} else {
														experiments[k].files = files;
														nextExperiment();
													}
												}
												next();
											} else {
												nextExperiment();
											}
										} else {
											res.send({message : "success", experimentHistory : experiments});
										}
									}
									nextExperiment();
								}
								getExperiment(experiments);
 	 					}
 	 				});
 	 			}
 	 		});
 	 	} else {
 	 		res.send({message : "experiment not find"});
 	 	}
 	 },

 	 /**
 	 * find note history
 	 */

 	 getLitratureHistory : function(req, res){
 	 	var litratureid = req.param('litratureid');

 	 	if(litratureid != '' && typeof litratureid != 'undefined'){
 	 		LabBookVersion.find()
 	 		.where({labbookid : litratureid})
 	 		.done(function(err, litratures){
 	 			if(err){
 	 				console.log(err)
 	 				res.send(500, {error : "DB error"});
 	 			} else {
 	 				LabBook.findOne({id : litratureid})
 	 				.done(function(err, litrature){
 	 					if(err){
 	 						console.log(err)
 	 						res.send(500, {error : "DB error"});
 	 					} else {
 	 						litrature.current = true;
 	 						litratures.push(litrature);
 	 						//res.send({message : "success", litratureHistory : litratures});

								function getLiterature(literatures){
									var k = -1;
									function nextLiterature(){
										 k++;
										 var files = new Array();
										if(k < literatures.length){
											if(literatures[k].files && literatures[k].files != null && typeof literatures[k].files != 'undefined') {
												var filesId = literatures[k].files.split(',');
												var z = -1;
												
												function next(){
													z++;
													if(z < filesId.length){
														if(filesId[z] != ''){
															LabBookFiles.findOne({id : filesId[z]})
															.done(function(error, file){
																if(error){
																	console.log(error);
																	next();
																} else if(file){
																	files.push(file);
																	next();
																} else {
																	next();
																}
															});
														} else {
															next();
														}
													} else {
														literatures[k].files = files;
														nextLiterature();
													}
												}
												next();
											} else {
												nextLiterature();
											}
										} else {
											res.send({message : "success", litratureHistory : litratures});
										}
									}
								nextLiterature();
							}
							getLiterature(litratures);
 	 					}
 	 				});
 	 			}
 	 		});
 	 	} else {
 	 		res.send({message : "litrature not find"});
 	 	}
 	 },

	 /**
	 * update litrature from here
	 */
	 
	 updatelitrature :function(req,res)
	 {
		  
		var litraturename = req.param("litraturename");
		var tags = req.param("tags");
		var litratureabstarct = req.param("litratureabstarct");
		var litraturehighilight = req.param("litraturehighilight");
		var filename = req.param("filename");
		var filepath = req.param("filepath");
		var projectid =req.param("projectid");
		var projectname =req.param("projectname");		
		var username = req.user.username;
		var litartureid = req.param("litartureid");

		var isDraftFlag = req.param("isDraft");
		var isDraft = false;
	      if(isDraftFlag == 1){
	        isDraft = false;
	      } else if(isDraftFlag == 0){
	        isDraft = true;
	      }

		var filesids = '';
			LabBook.findOne(litartureid).done(function(error, labBook) {

				LabBookVersion.create({
					projectid: projectid, 
					labbookid: labBook.id, 
					name : labBook.name,
					description:labBook.description, 
					tags: labBook.tags,
					creater:labBook.creater,
					type:labBook.type, 
					createrid : labBook.createrid, 
					files : labBook.files, 
					labbooktype : labBook.labbooktype, 
					abstract:labBook.abstract, 
					highlight:labBook.highlight,
					isDeleted : labBook.isDeleted,
					isStared : labBook.isStared,
					isDraft : labBook.isDraft,
					isArchived : LabBook.isArchived
				})
				.done(function(err, litratureversion){
						if (err) {
							console.log(err);
							res.send(500, {error: "DB Error"});
						} else {
							username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
							
							function updateLabBook(){
								var obj = new Object();
								if(filesids == ''){
									obj = {
										projectid: projectid,
										name : litraturename, 
										abstract:litratureabstarct,
										highlight:litraturehighilight, 
										tags: tags,creater:username, 
										createrid : req.user.id,
										isDraft : isDraft
									};
								} else {
									obj = {
										projectid: projectid,
										name : litraturename, 
										abstract:litratureabstarct,
										highlight:litraturehighilight, 
										tags: tags,creater:username, 
										createrid : req.user.id, 
										files : filesids,
										isDraft : isDraft
									}
								}
								console.log('litartureid', litartureid);
								LabBook.update({  id: litartureid }, obj,
									function(error, litrature) {
										if (error) {
											console.log("error from here******");
											res.send(500, {error: "DB Error"});
										} else {
											console.log(litrature);
											createActivity({projectname : projectname, projectid : projectid, user : req.user, action : "updated", type : "litrature", litrature : litrature[0]}, function(err, result){
												if(err) res.send(500, {error: "DB Error"});
												else res.json({success: true, litrature : litrature[0]});
											});								
										}
							  		}
							  	); 
							}

							function uploadLabFiles(){
								var i = -1;
								// Iterating files
								function next() {
									i++;
									if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
										console.log('in multiple');
										var file = req.files.projectfile[i];
										var filename = file.name;
										var dirPath = LABBOOK_UPLOAD + '/' +projectid;
										var filePath = dirPath + '/' + filename;
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
											  				LabBookFiles.create({filename: filename,filepath:filePath}).done(function(error, file) {
																if (error) {
																	res.send(500, { message: "DB Error", error : error});
																} else {
																	console.log(file);
																	filesids += file.id + ',';
																	next();
																}
															});							  			
											  			}
										  			}
												})
										  	}
										});
									}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
										var file = req.files.projectfile;
										var filename = file.name;
										var dirPath = LABBOOK_UPLOAD + '/' +projectid;
										var filePath = dirPath + '/' + filename;
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
											  				LabBookFiles.create({filename: filename,filepath:filePath }).done(function(error, file) {
																if (error) {
																	res.send(500, { message: "DB Error", error : error});
																} else {
																	filesids += file.id;
																	updateLabBook();
																}
															});							  			
											  			}
										  			}
												})
										  	}
										});
									} else {
										// Creating activity for multiple file uploades.
											updateLabBook();
									}
								}
								next();
							}
							try {
								uploadLabFiles()
							} catch(exc){
								console.log(exc);
							}
						}
				});        
			});
	 },
	 
	/**
	*  update protocol from here
	*/
 	updateprotocol: function(req,res){
		var protocolname = req.param("protocolname");
		var tags = req.param("tags");
		var protocolmaterail = req.param("protocolmaterail");
		var protocolprocedure = req.param("protocolprocedure");
		var filename = req.param("filename");
		var filepath = req.param("filepath");
		var projectid =req.param("projectid");
		var projectname =req.param("projectname");
		var username = req.user.username;
		var protocolid = req.param("protocolid");
	 	
		var isDraftFlag = req.param("isDraft");
		var isDraft = false;
	      if(isDraftFlag == 1){
	        isDraft = false;
	      } else if(isDraftFlag == 0){
	        isDraft = true;
	      }

		var filesids = '';
			LabBook.findOne(protocolid).done(function(error, labBook) {

				LabBookVersion.create({
					projectid: projectid, 
					labbookid: labBook.id, 
					name : labBook.name,
					materials:labBook.materials, 
					procedure:labBook.procedure,
					description:labBook.description, 
					tags: labBook.tags,
					creater:labBook.creater,
					type:labBook.type, 
					createrid : labBook.createrid, 
					files : labBook.files, 
					labbooktype : labBook.labbooktype, 
					abstarct:labBook.abstarct, 
					highlight:labBook.highlight,
					isDeleted : labBook.isDeleted,
					isStared : labBook.isStared,
					isDraft : labBook.isDraft,
					isArchived : LabBook.isArchived
				})
				.done(function(err, protocolversion){
						if (err) {
							console.log(err);
							res.send(500, {error: "DB Error"});
						} else {
							username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
							
							function updateLabBook(){
								var obj = new Object();
								if(filesids == ''){
									obj = {
										projectid: projectid,
										name : protocolname,  
										tags: tags,
										materials:protocolmaterail, 
										procedure:protocolprocedure, 
										creater:username, 
										createrid : req.user.id,
										isDraft : isDraft
									};
								} else {
									obj = {
										projectid: projectid,
										name : protocolname, 
										materials:protocolmaterail, 
										procedure:protocolprocedure, 
										tags: tags,creater:username, 
										createrid : req.user.id, 
										files : filesids,
										creater:username,
										isDraft : isDraft
									}
								}
								LabBook.update({  id: protocolid }, obj,
									function(error, protocol) {
										if (error) {
											console.log("error from here******");
											res.send(500, {error: "DB Error"});
										} else {
											createActivity({projectname : projectname, projectid : projectid, user : req.user, action : "updated", type : "protocol", protocol : protocol[0]}, function(err, result){
												if(err) res.send(500, {error: "DB Error"});
												else res.json({success: true, protocol : protocol[0]});
											});								
										}
							  		}
							  	); 
							}

							function uploadLabFiles(){
								var i = -1;
								// Iterating files
								function next() {
									i++;
									if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
										console.log('in multiple');
										var file = req.files.projectfile[i];
										var filename = file.name;
										var dirPath = LABBOOK_UPLOAD + '/' +projectid;
										var filePath = dirPath + '/' + filename;
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
											  				LabBookFiles.create({filename: filename,filepath:filePath}).done(function(error, file) {
																if (error) {
																	res.send(500, { message: "DB Error", error : error});
																} else {
																	console.log(file);
																	filesids += file.id + ',';
																	next();
																}
															});							  			
											  			}
										  			}
												})
										  	}
										});
									}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
										var file = req.files.projectfile;
										var filename = file.name;
										var dirPath = LABBOOK_UPLOAD + '/' +projectid;
										var filePath = dirPath + '/' + filename;
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
											  				LabBookFiles.create({filename: filename,filepath:filePath }).done(function(error, file) {
																if (error) {
																	res.send(500, { message: "DB Error", error : error});
																} else {
																	filesids += file.id;
																	updateLabBook();
																}
															});							  			
											  			}
										  			}
												})
										  	}
										});
									} else {
										// Creating activity for multiple file uploades.
											updateLabBook();
									}
								}
								next();
							}
							try {
								uploadLabFiles()
							} catch(exc){
								console.log(exc);
							}
						}
				});        
			});
 	},
	 
	 
	 /**
	 *  update experiments
	 */
	 updateexperiment : function(req,res){
		 
		var expname = req.param("expname");
		var tags = req.param("tags");
		var expbg = req.param("expbg");
		var expresult = req.param("expresult");
		var expcon = req.param("expcon");
		var filename = req.param("filename");
		var filepath = req.param("filepath");
		var projectid =req.param("projectid");
		var projectname =req.param("projectname");
		var username = req.user.username;
		var expid = req.param("expid");
		 
		var isDraftFlag = req.param("isDraft");
		var isDraft = false;
	      if(isDraftFlag == 1){
	        isDraft = false;
	      } else if(isDraftFlag == 0){
	        isDraft = true;
	      }

		var filesids = '';
			LabBook.findOne(expid).done(function(error, labBook) {

				LabBookVersion.create({
					projectid: projectid, 
					labbookid: labBook.id, 
					name : labBook.name, 
					background : labBook.background, 
					result:labBook.result, 
					conclusion:labBook.conclusion,
					materials:labBook.materials, 
					procedure:labBook.procedure,
					description:labBook.description, 
					tags: labBook.tags,
					creater:labBook.creater,
					type:labBook.type, 
					createrid : labBook.createrid, 
					files : labBook.files, 
					labbooktype : labBook.labbooktype, 
					abstarct:labBook.abstarct, highlight:labBook.highlight,
					isDeleted : labBook.isDeleted,
					isStared : labBook.isStared,
					isDraft : labBook.isDraft,
					isArchived : LabBook.isArchived
				})
				.done(function(err, expversion){
						if (err) {
							console.log(err);
							res.send(500, {error: "DB Error"});
						} else {
							username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
							
							function updateLabBook(){
								var obj = new Object();
								if(filesids == ''){
									obj = {
										projectid: projectid,
										name : expname, 
										background:expbg, 
										result:expresult, 
										conclusion:expcon,  
										tags: tags,
										creater:username, 
										createrid : req.user.id,
										isDraft : isDraft
									};
								} else {
									obj = {
										projectid: projectid,
										name : expname, 
										background:expbg, 
										result:expresult, 
										conclusion:expcon, 
										tags: tags,
										creater:username, 
										createrid : req.user.id, 
										files : filesids,
										isDraft : isDraft
									}
								}
								LabBook.update({  id: expid }, obj,
									function(error, experiment) {
										if (error) {
											console.log("error from here******");
											res.send(500, {error: "DB Error"});
										} else {
											createActivity({projectname : projectname, projectid : projectid, user : req.user, action : "updated", type : "experiment", experiment : experiment[0]}, function(err, result){
												if(err) res.send(500, {error: "DB Error"});
												else res.json({success: true, experiment : experiment[0]});
											});								
										}
							  		}
							  	); 
							}

							function uploadLabFiles(){
								var i = -1;
								// Iterating files
								function next() {
									i++;
									if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
										console.log('in multiple');
										var file = req.files.projectfile[i];
										var filename = file.name;
										var dirPath = LABBOOK_UPLOAD + '/' +projectid;
										var filePath = dirPath + '/' + filename;
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
											  				LabBookFiles.create({filename: filename,filepath:filePath}).done(function(error, file) {
																if (error) {
																	res.send(500, { message: "DB Error", error : error});
																} else {
																	console.log(file);
																	filesids += file.id + ',';
																	next();
																}
															});							  			
											  			}
										  			}
												})
										  	}
										});
									}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
										var file = req.files.projectfile;
										var filename = file.name;
										var dirPath = LABBOOK_UPLOAD + '/' +projectid;
										var filePath = dirPath + '/' + filename;
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
											  				LabBookFiles.create({filename: filename,filepath:filePath }).done(function(error, file) {
																if (error) {
																	res.send(500, { message: "DB Error", error : error});
																} else {
																	filesids += file.id;
																	updateLabBook();
																}
															});							  			
											  			}
										  			}
												})
										  	}
										});
									} else {
										// Creating activity for multiple file uploades.
											updateLabBook();
									}
								}
								next();
							}
							try {
								uploadLabFiles()
							} catch(exc){
								console.log(exc);
							}
						}
				});        
			});
	 },
	 


	 /**
	 * create comments from here

 		Pet.query('SELECT pet.name FROM pet', function(err, results) {
			if (err) return res.serverError(err);
			return res.ok(results);
		});

	 */
	 
	 createcomment: function(req,res){
		//var projectid = req.param("projectid");
		var comm = req.param("comm");
		var actid = req.param("actid");
 		var username = req.user.username;
 		Comments.create({comments:comm,activityID:actid,creater:username}).done(function(error, comm) {
			if (error) {
				console.log("error from here===");
				res.send(500, {error: "DB Error"});
			} else {
				res.json({success: true});
				console.log("activity  inserted",comm.id);
							
			}
		});
 	},
	 
	 /**
	 * find commnets from here
	 */
	 
 	findcomments: function(req,res){
	 	var actID = req.param("actid");
	 	Comments.find({ activityID: actID}).done(function(err, comments) {
		  	// Error handling
		  	if (err) {
				return console.log(err);
		  		// Found multiple projects!
		  	} else {
				//console.log("Users found:", projects);
			 	res.send(comments);
		  	}
		});
	 },
	 
    /**
	  * find user header information like notification, email etc
	  */

	  getColaborations : function(req, res){
	  	var userEmail = req.param('email');

	  	if(userEmail){
	  		var userHeaderInfo = new Object();
	  		Colaborations.find({colaborator : userEmail, status : 1})
		  	.done(function(err, colaborations){
		  		if(err){
		  			res.send(500, {error: "DB Error"});
		  		} else if(colaborations.length > 0) {
		  			var j = -1;
		  			var nextCola = function(){
		  				j++;
		  				if(j < colaborations.length){
		  					delete colaborations[j].accepted;
					  		delete colaborations[j].createdAt;
					  		delete colaborations[j].updatedAt;

		  					User.findOne({id : colaborations[j].owner})
		  					.done(function(err, user){
		  						delete colaborations[j].owner;
		  						if(err){
		  							console.log("Error");
		  							colaborations[j].from = {};
		  							nextCola();
		  						} else if(user){
		  							delete user.provider ;
		  							delete user.uid ;
		  							delete user.createdAt ;
		  							delete user.updatedAt ;
		  							delete user.openid ;
		  							colaborations[j].from = user;
		  							Project.findOne({id : colaborations[j].projectid})
		  							.done(function(err, project){
		  								delete colaborations[j].projectid;
		  								if(err){
		  									colaborations[j].project = {};
		  									console.log("Error");
		  									nextCola();
		  								} else if(project){
		  									delete project.abstract;
		  									delete project.isPrivate ;
		  									delete project.isAdmin ;
		  									delete project.createdAt ;
		  									delete project.updatedAt;
		  									delete project.projectTypeID;
		  									delete project.projectType;
		  									colaborations[j].project = project;
		  									nextCola();
		  								} else {
		  									colaborations[j].project = {};
		  									console.log("Project Not Found");
		  									nextCola();
		  								}
		  							});
		  						} else {
		  							console.log("user Not found");
		  							colaborations[j].from = {};
		  							nextCola();
		  						}
		  					});
		  				} else {
		  					res.json({ colaborations : colaborations});
		  				}
		  			}
		  			nextCola();
		  		} else {
		  			res.json({ colaborations : colaborations});
		  		}
		  	})
	  	} else {
	  		res.json({message : "user not found"})
	  	}
	  },

	  colaborationReply : function(req, res){
	  	var activity = req.param('activity');
	  	var id = req.param('id');

	  	if(!activity){
	  		res.send(500, {error: "activity not found."});
	  	} else if(!id){
	  		res.send(500, {error: "id not found."});
	  	} else {
	  		Colaborations.findOne({id : id})
	  		.done(function(err, colaboration){
	  			if(err){
	  				res.send(500, {error: "DB error"});
	  			} else if(colaboration) {
	  				var isValidActivity = false;
	  				if(activity == 'accept'){
	  					colaboration.status = 2;
	  					isValidActivity = true;
	  				} else if(activity == 'reject'){
	  					colaboration.status = 3;
	  					isValidActivity = true;
	  				} else{
	  					isValidActivity = false;
	  				}

	  				if(isValidActivity){
	  					colaboration.save(function(err, colaboration){
	  						if(err){
	  							res.send(500, {error: "DB error"});
	  						} else {
	  							res.json({message : "success"});
	  						}
	  					});
	  				} else {
	  					res.send(500, {error: "not a valid activity."});
	  				}
	  			} else {
	  				res.send(500, {error: "colaboration not found"});
	  			}
	  		});
	  	}
	  },

	  /**
	   *	Add Multiple Files In Multiple Projects
	   *                   START
	   */
	  uploadFilesInMultipleProject : function(req, res){
	  	/**
	  	 * Upload Multiple Files In Project.
	  	 */
	  	function uploadProjectFiles(project){
			var i = -1;
			// Iterating files
			function next() {
				i++;
				if(req.files && req.files.projectfile && req.files.projectfile.length>i) {
					console.log('in multiple');
					var file = req.files.projectfile[i];
					var filename = file.name;
					var dirPath = UPLOAD_PATH + '/' +project.id;
					var filePath = dirPath + '/' + filename;
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
												next();
											}
										});							  			
						  			}
					  			}
							})
					  	}
					});
				}else if(req.files && req.files.projectfile && typeof req.files.projectfile.length=='undefined'){
					var file = req.files.projectfile;
					var filename = file.name;
					var dirPath = UPLOAD_PATH + '/' +project.id;
					var filePath = dirPath + '/' + filename;
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
												// Creating activity for single file upload.
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
				} else {
					// Creating activity for multiple file uploades.
					if(req.files && req.files.projectfile && req.files.projectfile.length>0){
						var user = req.user;
						activity = req.files.projectfile.length + " files added by <a href='#/people' ng-click='viewProfile("+user.id+")' class='activity_link'>" + user.username+"  </a> in project " + project.projectname;
						Projectactivity.create({projectid: project.id,activity:activity,creater:user.username})
						.done(function(error, activity) {
							if(error){
								console.log("error while creating activity");
							} 
						});
					} 
				}
			}
			next();
		};

		var projectErrorCount = 0;
		var projectSuccessCount = 0;		

		function projectsToUploadFiles() {
			var j = -1;
			// Iterating projects.
			function nextProject() {
				j++;
				if(j < req.param('projects').length || typeof req.param('projects').length == 'undefined'){
					Project.findOne({id : req.param('projects')[j]})
					.done(function(err, project){
						if(err){
							console.log(err);
							projectErrorCount++;
							nextProject();
						} else {
							//console.log("Uploading Files In Project........... " + project);
							try {
								// Calling function to upload files in related project .
								uploadProjectFiles(project);
							} catch(errorInFileUpload){
								console.log(errorInFileUpload);
							}
							nextProject();
						}
					});
				} else {
					res.send({message : "success", errorProjects : projectErrorCount, successProject : projectSuccessCount});
				}
			}
			nextProject();
		}

		// Executation start from here.
		try{
			projectsToUploadFiles();
		} catch(exceoption){
			console.log(exceoption);
		}
	  },
	  /**
	   *	Add Multiple Files In Multiple Projects
	   *                   End
	   */

	  /**
	   *	Add Multiple Users In Multiple Projects
	   *                   Start
	   */

	   addColaboratorInMultipeProject : function(req, res){
	   	var projectErrorCount = 0;
	   	var projectSuccessCount = 0;

	   	// Adding user in project
	   	function addUserInProject(project){
	   		var users = req.body.users.split(",");
			var i = -1;
			// Iterating users
			function next(){
				i++;
				if(users.length>i){
					Colaborations.create({
						owner : req.user.id, 
						projectid : project.id,
						colaborator : users[i].trim(),
						accepted : false,
						status : 1,
						message : req.body.message, 
						subject : req.body.subject
					})
					.done(function(err, colaboration){
						if(err){res.send({message : "err"+err});return;};
						createActivity({projectname : project.projectname, projectid : project.id, user : req.user, action : "added", type : "colaboration", colaborator : users[i].trim()}, next);
					});
				}
			}
			next();
	   	}
	   	// Iterating Projects
	   	function findProjects(projects){
	   		var z = -1;
	   		function nextProject(){
	   			z++;
	   			if(projects.length > z){
	   				Project.findOne({id : projects[z]})
	   				.done(function(err, project){
	   					if(err){
	   						console.log(err);
	   						projectErrorCount++;
	   						nextProject();
	   					} else {
	   						try{
		   						addUserInProject(project);
			   				} catch(exception){
			   					console.log(exception);
			   				}
			   				nextProject();
	   					}
	   				});
	   			} else {
	   				res.send({message : "success", errorProjects : projectErrorCount, successProject : projectSuccessCount});
	   			}
	   		}
	   		nextProject();
	   	}
	   	// Execution start from here
	   	try{
	   		if(req.param('projects') && req.param('projects').projects && req.param('projects').projects.length > 0){
	   			findProjects(req.param('projects').projects);
	   		} else {
	   			res.send({message : "no project found"});
	   		}
	   	} catch(exception){
	   		console.log(exception);
	   	}
	   },
	   /**
	   *	Add Multiple Users In Multiple Projects
	   *                   END
	   */

	   /**
	    * Deleting Attchements Start
	    */

	   deleteAttachements : function(req, res){
	   	var id = req.param('id');
	   	if(id && typeof id != 'undefined'){
	   		Attachment.destroy({id : id})
	   		.done(function(err, attachement){
	   			if(err){
					console.log(err);
					res.send({message : "error"});
	   			} else {
	   				console.log('mailid', attachement);
	   				Attachment.find({mailid:attachement[0].mailid})
	   				.done(function(err, attachements){
	   					if(err){
	   						console.log(err);
	   						res.send({message : "error"});
	   					} else {
	   						if(attachements.length > 0){
	   							console.log('if',attachements.length);
	   							res.send({message : attachements.length});
	   						} else {
	   							console.log('else',attachements.length);
	   							Mails.update({id : attachement[0].mailid}, {hasAttachments : false})
	   							.done(function(err, success){
	   								if(err){
	   									console.log(err);
	   									res.send({message : "error"});
	   								} else {
	   									res.send({message : attachements.length});
	   								}
	   							});
	   						}
	   					}
	   				});
	   			}
	   		});
	   	}
	   },
	   /**
	    * Deleting Attachements End
	    */

	    /**
	     *  Getting Mail Attachements Start
	     */

	     getMailAttachements : function(req, res){
	     	var mailId = req.param('id');
	     	if(mailId && typeof mailId != 'undefined'){
	     		Attachment.find({mailid : mailId})
	     		.done(function(err, attachements){
	     			if(err){
	     				console.log(err);
	     				res.send({message : "DB Error"});
	     			} else if(attachements.length > 0){
	     				var z = -1;
	     				var attachementArray = new Array();
	     				function nextAtt(){
	     					z++;
	     					if(z < attachements.length){
	     						 	fs.exists('./assets'+attachements[z].filepath,function(exists){
	     						 		if(exists){
	     						 			var stats = fs.statSync('./assets'+attachements[z].filepath);
		 									var fileSizeInBytes = stats["size"];
		 									var att = new Object();
		 									att.id = attachements[z].id;
		 									att.filename = attachements[z].filename;
		 									att.filepath = attachements[z].filepath;
		 									att.filesize = Math.round(fileSizeInBytes/1000);
		 									attachementArray.push(att);
		 									nextAtt();
	     						 		} else {
	     						 			nextAtt();
	     						 		}
	     						 	});
	     					} else {
	     						res.send({message : "success", attachements : attachementArray});
	     					}
	     				}
	     				nextAtt();
	     			} else {
	     				res.send({message : "success", attachements : attachementArray});
	     			}
	     		});
	     	} else {
	     		res.send({message : "mailid not found"});
	     	}
	     },
	     /**
	     *  Getting Mail Attachements End
	     */

	     /**
	     *  Downloading Attachements Start
	     */

	     downloadAttachements : function(req,res){


	     	var mailid = req.param('mailid');
	     	var id = req.param('id');

	     	if(id == 'all'){
	     		
	     		Attachment.find({mailid : mailid})
	     		.done(function(error, mailatt){
	     			if(error){
	     				throw error;
	     				res.send("please try again");
	     			} else {
	     				if(mailatt.length > 0){

	     					var zip = new JSZip();
	     					var z = -1;
	     					function next(){
	     						z++;
	     						if(mailatt.length > z){
	     							fs.readFile('./assets'+mailatt[z].filepath, function(err, strm){
										if(error){
											throw error;
											next();
										} else {
											var imgData = new Buffer(strm, 'binary').toString('base64');
											zip.file(mailatt[z].filename, imgData, {base64: true});
											next();
										}
									});
	     						} else {
	     							var dirPath = MAIL_ATTACHEMENTS_FOLDER_PATH + '/' + mailid;
									var filePath = dirPath + '/email_attachements_' + mailid + "-" + req.user.id + '.zip';
									try {
									  	mkdirp.sync(dirPath, 0755);					  	
									} catch (e) {
									  	console.log(e);
									}

	 	 							var buffer = zip.generate({type:"nodebuffer"});
									fs.writeFile(filePath, buffer, function(err) {
									  if (err) throw err;
									  else res.download(filePath);
									});
	     						}
	     					}
	     					next();
	     				} else {
	     					res.send("can not find attachements");
	     				}
	     			}
	     		});
	     	} else {
	     		Attachment.findOne({id : id})
	     		.done(function(error, attachement){
	     			if(error){
	     				throw error;
	     				res.send("please try again");
	     			} else if(attachement){
	     				res.download("./assets" + attachement.filepath);
	     			} else {
	     				res.send("can not find");
	     			}
	     		})
	     	}

	     // 	var attArray = req.param('attArray');
	     // 	if(attArray.length > 0){
	     // 		var z = -1;
	     // 		function nextDownload(){
	     // 			z++;
	     // 			if(attArray.length > z){
	     // 				  var download = function(uri, filename, callback){
						//   request.head(uri, function(err, res, body){
						//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
						//   });
						// };
						// console.log(attArray[z]);
						// Attachment.findOne({id : attArray[z]})
						// .done(function(err, attachement){
						// 	if(err){
						// 		console.log(err);
						// 		nextDownload();
						// 	} else {
						// 		console.log(attachement);
						// 		download(attachement.filepath, attachement.filename, function(){
						// 		  console.log('done');
						// 		  nextDownload();
						// 		});
						// 	}
						// });
	     // 			}
	     // 		}
	     // 		nextDownload();
	     // 	} else {
	     // 		res.send({message : "No Attachements"});
	     // 	}
	     },
	     /**
	     *  Downloading Attachements End
	     */
	 	

	     /**
	      * Deleting trash
	      */

	      deleteSelectedTrashMail : function(req, res){
	      	var mails = JSON.parse(req.param('mails'));

	      	if(mails.length > 0){

	      		function deleteTrash(mails){

	      			function deleteInboxTrash(id){
	      				SentMails.update({id : id}, {isDeleted : true})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      					}
	      				});
	      			}
	      			function deleteSentTrash(id){
	      				Mails.update({id : id}, {isDeleted : true})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      					}
	      				});
	      			}
	      			function deleteDraftTrash(id){
	      				Mails.update({id : id}, {isDeleted : true})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      					}
	      				});
	      			}


	      			var z = -1;
	      			function next(){
	      				z++;
	      				if(z < mails.length){
	      					if(mails[z].mail.trashType == 'inbox'){
	      						deleteInboxTrash(mails[z].details.id);
	      						next();
	      					} else if(mails[z].mail.trashType == 'sent'){
	      						deleteSentTrash(mails[z].mail.id);
	      						next();
	      					} else if(mails[z].mail.trashType == 'draft'){
	      						deleteDraftTrash(mails[z].mail.id);
	      						next();
	      					} else if(mails[z].mail.trashType == 'important'){
	      						deleteInboxTrash(mails[z].details.id);
	      						next();
	      					}
	      				} else {
	      					res.send({message : "success"});
	      				}
	      			}
	      			next();
	      		}

	      		try{
	      			deleteTrash(mails);
	      		} catch(exception){
	      			console.log(exception);
	      			res.send({message : exception});
	      		}
	      	} else {
	      		res.send({message : 'mails not found'});
	      	}
	      },

	      restoreSelectedTrashMail : function(req, res){

	      	var mails = JSON.parse(req.param('mails'));

	      	if(mails.length > 0){

	      		function restoreTrash(mails){

	      			function restoreInboxTrash(id){
	      				SentMails.update({id : id}, {isTrashed : false})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      					}
	      				});
	      			}
	      			function restoreSentTrash(id){
	      				Mails.update({id : id}, {isTrashed : false})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      					}
	      				});
	      			}
	      			function restoreDraftTrash(id){
	      				Mails.update({id : id}, {isTrashed : false})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      					}
	      				});
	      			}


	      			var z = -1;
	      			function next(){
	      				z++;
	      				if(z < mails.length){
	      					if(mails[z].mail.trashType == 'inbox'){
	      						restoreInboxTrash(mails[z].details.id);
	      						next();
	      					} else if(mails[z].mail.trashType == 'sent'){
	      						restoreSentTrash(mails[z].mail.id);
	      						next();
	      					} else if(mails[z].mail.trashType == 'draft'){
	      						restoreDraftTrash(mails[z].mail.id);
	      						next();
	      					} else if(mails[z].mail.trashType == 'important'){
	      						restoreInboxTrash(mails[z].details.id);
	      						next();
	      					}
	      				} else {
	      					res.send({message : "success"});
	      				}
	      			}
	      			next();
	      		}

	      		try{
	      			restoreTrash(mails);
	      		} catch(exception){
	      			console.log(exception);
	      			res.send({message : exception});
	      		}
	      	} else {
	      		res.send({message : 'mails not found'});
	      	}

	      },

	 	/**
	 	 * Deleting Inbox Mails
	 	 */
	 	deleteSelectedInboxMail : function(req, res){
	 		var mails = req.param('mails');
	 		var mailDeleteSuccessCount = 0;
	 		var mailDeleteErrorCount = 0;
	 		if(mails.mails && mails.mails.length >0){
	 			console.log(mails);
	 			mails = mails.mails;
	 			var z = -1;
	 			function deleteMails(){
	 				z++;
	 				if(z < mails.length){
	 					SentMails.update({mailid : mails[z], sentto : req.user.id}, {isTrashed : true})
	 					.done(function(err, sentmail){
	 						if(err){
	 							console.log(err);
	 							mailDeleteErrorCount++;
	 							deleteMails();
	 						} else {
	 							
	 							mailDeleteSuccessCount++;
	 							deleteMails();		
	 						}
	 					});
	 				} else {
	 					res.send({message : "success", deletedCount : mailDeleteSuccessCount, errorCount : mailDeleteErrorCount});
	 				}
	 			}
	 			deleteMails()
	 		} else {
	 			res.send({message : "mails not found"});
	 		}
	 	},

	 	/**
	 	 * Deleting Sent Mails
	 	 */
	 	 deleteSelectedSentMail : function(req, res){
	 	 	var mails = req.param('mails');
	 		var mailDeleteSuccessCount = 0;
	 		var mailDeleteErrorCount = 0;
	 		if(mails.mails && mails.mails.length >0){
	 			console.log(mails);
	 			mails = mails.mails;
	 			var z = -1;
	 			function deleteMails(){
	 				z++;
	 				if(z < mails.length){
	 					
						Mails.update({id : mails[z]}, {isTrashed : true})
 						.done(function(err, mail){
							if(err){
								console.log(err);
								mailDeleteErrorCount++;
								deleteMails();
							} else {
								mailDeleteSuccessCount++;
								deleteMails();
							}
						});
			 				
	 				} else {
	 					res.send({message : "success", deletedCount : mailDeleteSuccessCount, errorCount : mailDeleteErrorCount});
	 				}
	 			}
	 			deleteMails()
	 		} else {
	 			res.send({message : "mails not found"});
	 		}
	 	},
	 	deleteSelectedDraftMail : function(req, res){
	 		var mails = req.param('mails');
	 		var mailDeleteSuccessCount = 0;
	 		var mailDeleteErrorCount = 0;
	 		if(mails.mails && mails.mails.length >0){
	 			console.log(mails);
	 			mails = mails.mails;
	 			var z = -1;
	 			function deleteMails(){
	 				z++;
	 				if(z < mails.length){
	 					Mails.update({id : mails[z]}, {isTrashed : true})
	 					.done(function(err, mail){
	 						if(err){
	 							console.log(err);
	 							mailDeleteErrorCount++;
	 							deleteMails();
	 						} else {
	 							mailDeleteSuccessCount++;
	 							deleteMails();
	 						}
	 					});
	 				} else {
	 					res.send({message : "success", deletedCount : mailDeleteSuccessCount, errorCount : mailDeleteErrorCount});
	 				}
	 			}
	 			deleteMails()
	 		} else {
	 			res.send({message : "mails not found"});
	 		}
	 	},

	 	deleteInboxMail : function(req, res){
	 		var id = req.param('id');
	 		var userid = req.user.id;

	 		if(id && userid) {
	 			SentMails.update({id : id}, {isTrashed : true})
	 			.done(function(error, mail){
	 				if(error){
	 					console.log(error);
	 					res.send({message : 'error'});
	 				} else {
	 					res.send({message : 'success'});
	 				}
	 			});
	 		} else {
	 			res.send({message : 'error'});
	 		}
	 	},

	 	deleteSentMail : function(req, res){
	 		var id = req.param('id');
	 		var userid = req.user.id;

	 		if(id && userid) {
	 			Mails.update({id : id}, {isTrashed : true})
	 			.done(function(error, mail){
	 				if(error){
	 					console.log(error);
	 					res.send({message : 'error'});
	 				} else {
	 					res.send({message : 'success'});
	 				}
	 			});
	 		} else {
	 			res.send({message : 'error'});
	 		}
	 	},

	 	deleteTrashMail : function(req, res){
	 		var mail = req.param('mail');
	 		var userid = req.user.id;
	 		if(mail && userid){
	 			
	 			function deleteInboxTrash(id){
	      				SentMails.update({id : id}, {isDeleted : true})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      						res.send({message : 'error'});
	      					} else {
	      						res.send({message : 'success'});
	      					}
	      				});
	      		}

	      		function deleteSentTrash(id){
	      				Mails.update({id : id}, {isDeleted : true})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      						res.send({message : 'error'});
	      					} else {
	      						res.send({message : 'success'});
	      					}
	      				});
	      		}

	      		function deleteDraftTrash(id){
	      				Mails.update({id : id}, {isDeleted : true})
	      				.done(function(error, mail){
	      					if(error){
	      						console.log(error);
	      						res.send({message : 'error'});
	      					} else {
	      						res.send({message : 'success'});
	      					}
	      				});
	      		}

	 			function deleteMail(){
	 				if(mail.mail.trashType == 'inbox'){
		 				deleteInboxTrash(mail.details.id);
		 			} else if(mail.mail.trashType == 'sent') {
		 				deleteSentTrash(mail.mail.id);
		 			} else if(mail.mail.trashType == 'draft'){
		 				deleteDraftTrash(mail.mail.id);
		 			} else if(mail.mail.trashType == 'important'){
		 				deleteInboxTrash(mail.details.id);
		 			}
	 			}

	 			try{
	 				deleteMail();
	 			} catch(exception){
	 				console.log(exception);
	 				res.send({message : exception});
	 			}

	 		} else {
	 			res.send({message : 'error'});
	 		}
	 	},

	 	/**
	 	 * Getting Colaborators users
	 	 */
	 	getColaboraters : function(req, res){
	 		var projectid = req.param('projectid');
	 		if(projectid){
	 			Colaborations.find({projectid : projectid, status : 2})
	 			.done(function(err, colaborators){
	 				if(err){
	 					console.log(err);
	 					res.send({message : "error"});
	 				} else {
	 					var z = -1;
	 					function populateUserProfile(){
	 						 z++;
	 						 if(z < colaborators.length){
	 						 	User.findOne({email : colaborators[z].colaborator})
	 						 	.done(function(err, user){
	 						 		if(err){
	 						 			console.log(err);
	 						 			colaborators[z].colaborator = {};
	 						 			populateUserProfile();
	 						 		} else {
	 						 			colaborators[z].colaborator = user;
	 						 			populateUserProfile();
	 						 		}
	 						 	});
	 						 } else {
	 						 	console.log(colaborators);
	 							res.send({message : "success", colaborators : colaborators});
	 						 }
	 					}
	 					try{
	 						populateUserProfile();
	 					} catch(exception){
	 						console.log(exception);
	 					}
	 				}
	 			})
	 		} else {
	 			res.send({message : "error"});
	 		}
	 	},

	 	getAllCommentOnProject : function(req, res){
	 		var projectid = req.param('projectid');
	 		if(projectid){
	 			Projectactivity.find({projectid : projectid})
	 			.done(function(err, activities){
	 				if(err){
	 					console.log(err);
	 					res.send({message : "error"});
	 				} else {
	 					var z = -1;
	 					var totalComments = 0;
	 					function getCommentsOnActivity(){
	 						z++;
	 						if(z < activities.length){
	 							Comments.find({activityID : activities[z].id})
	 							.done(function(err, comments){
	 								if(err){
	 									console.log(err);
	 									getCommentsOnActivity();
	 								} else {
	 									totalComments += comments.length;
	 									activities.comments = comments;
	 									getCommentsOnActivity();
	 								}
	 							});
	 						} else {
	 							res.send({message : "success", activities : activities, totalComments : totalComments});
	 						}
	 					}
	 					getCommentsOnActivity();
	 				}
	 			});
	 		} else {
	 			res.send({message : "error"});
	 		}
	 	},

	 	/**
	 	 * Favourites project
	 	 */

	 	 addFavourites : function(req, res){
	 	 	var projectid = req.param('projectid');
	 	 	if(projectid){
	 	 		Favourites.create({projectid : projectid, userid : req.user.id})
	 	 		.done(function(err, fav){
	 	 			if(err){
	 	 				console.log(err);
	 	 				res.send(500, {message : 'Error DB'});
	 	 			} else if(fav){
	 	 				Project.findOne({id : projectid})
	 	 				.done(function(err, project){
	 	 					if(err){
	 	 						console.log(err);
	 	 						res.send(500, {message : "Error DB"});
	 	 					} else if(project){
	 	 						var creater = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
	 	 						var activity = "Project " + project.projectname + ' marked as favourites by ' + creater;
	 	 						Projectactivity.create({ projectid : projectid, creater : creater, activity : activity})
	 	 						.done(function(err, act){
	 	 							if(err){
	 	 								console.log(err);
	 	 								res.send(500, {message : "Error DB"});
	 	 							} else if(act){
	 	 								res.send({message : "success"});
	 	 							} else {
	 	 								res.send({message : "Activity can not created"});
	 	 							}
	 	 						});
	 	 					} else {
	 	 						res.send(500, {message : 'project not found'});
	 	 					}
	 	 				});
	 	 			} else {
	 	 				res.send(500, {message : 'Can not added, please try again.'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send(500, {message : 'project not found'});
	 	 	}
	 	 },

	 	 isFavourites : function(req, res){
	 	 	var projectid = req.param('projectid');
	 	 	var userid = req.user.id;
	 	 	if(projectid && userid){
	 	 		Favourites.findOne({projectid : projectid, userid : userid, isValid : true})
	 	 		.done(function(err, fav){
	 	 			if(err){
	 	 				console.log(err);
	 	 				res.send(500, {message : "Error DB"});
	 	 			} else if(fav){
	 	 				res.send({message:"success", favourites : true});
	 	 			} else {
	 	 				res.send({message:"success", favourites : false});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send(500, {message : 'something not found'});
	 	 	}
	 	 },

	 	 removeFavourites : function(req, res){
	 	 	var projectid = req.param('projectid');
	 	 	var userid = req.user.id;
	 	 	if(projectid && userid){
	 	 		Favourites.update({projectid : projectid, userid : userid, isValid : true}, {isValid : false})
	 	 		.done(function(err, fav){
	 	 			if(err){
	 	 				console.log(err);
	 	 				res.send(500, {message : "Error DB"});
	 	 			} else if(fav.length > 0) {
	 	 				res.send({message : "success"});
	 	 			} else {
	 	 				res.send(500, {message : 'fishing'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send(500, {message : 'something missing'});
	 	 	}
	 	 },

	 	 createLabComment : function(req,res){
	 	 	var id = req.param('id');
	 	 	var comm = req.param('comm');
	 	 	var userid = req.user.id;
	 	 	var projectid = req.param('projectid');
	 	 	if(id && comm && userid){
	 	 		var username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
	 	 		LabBookComments.create({
	 	 			labbookid : id, 
	 	 			createrid: userid, 
	 	 			creater : username,
	 	 			comment : comm,
	 	 			projectid : projectid
	 	 		})
	 	 		.done(function(err, comm){
	 	 			if(err){
	 	 				console.log(err);
	 	 				res.send({message : 'Error DB'});
	 	 			} else if(comm){
	 	 				res.send({message : 'success', comment : comm});
	 	 			} else {
	 	 				res.send({message : 'please try again.'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send({message : 'something is missing'});
	 	 	}
	 	 },

	 	 getLabBookComments : function(req, res){
	 	 	var projectid = req.param('projectid');
	 	 	if(projectid){
	 	 		LabBookComments.find({isDeleted : false})
		 	 	.done(function(error, comments){
		 	 		if(error){
		 	 			console.log(error);
		 	 			res.send({message:'Error DB'});
		 	 		} else {
		 	 			res.send({message : 'success', comments : comments});
		 	 		}
		 	 	});
	 	 	} else {
	 	 		res.send({message : 'project not found'});
	 	 	}
	 	 },

	 	 makeImportant : function(req, res){
	 	 	var id = req.param('id');
	 	 	var userid = req.user.id;
	 	 	if(id && userid){
	 	 		SentMails.update({id:id}, {isImportant : true})
	 	 		.done(function(error, mail){
	 	 			if(error){
	 	 				console.log(error);
	 	 				res.send({message : 'error'});
	 	 			} else {
	 	 				res.send({message : 'success'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send({message : 'not ok'});
	 	 	}
	 	 },

	 	 removeImportant : function(req, res){
	 	 	var id = req.param('id');
	 	 	var userid = req.user.id;
	 	 	if(id && userid){
	 	 		SentMails.update({id:id}, {isImportant : false})
	 	 		.done(function(error, mail){
	 	 			if(error){
	 	 				console.log(error);
	 	 				res.send({message : 'error'});
	 	 			} else {
	 	 				res.send({message : 'success'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send({message : 'not ok'});
	 	 	}
	 	 },

	 	 starsLabBook : function(req, res){
	 	 	var id = req.param('id');
	 	 	var userid = req.user.id;
	 	 	if(id && userid){
	 	 		LabBook.update({id : id}, {isStared : true})
	 	 		.done(function(error, lab){
	 	 			if(error){
	 	 				console.log(error);
	 	 				res.send({message : 'error'});
	 	 			} else if(lab){
	 	 				res.send({message : 'success', lab : lab});
	 	 			} else {
	 	 				res.send({message : 'can not update'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send({message : 'error'});
	 	 	}
	 	 },

	 	 removeStarsLabBook : function(req, res){
	 	 	var id = req.param('id');
	 	 	var userid = req.user.id;
	 	 	if(id && userid){
	 	 		LabBook.update({id : id}, {isStared : false})
	 	 		.done(function(error, lab){
	 	 			if(error){
	 	 				console.log(error);
	 	 				res.send({message : 'error'});
	 	 			} else if(lab){
	 	 				res.send({message : 'success', lab : lab});
	 	 			} else {
	 	 				res.send({message : 'can not update'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send({message : 'error'});
	 	 	}
	 	 },

	 	 archivedlab : function(req, res){
	 	 	var id = req.param("id");
	 	 	var type = req.param("type") == 1 ? true : false ;

	 	 	LabBook.update({id : id}, {isArchived : type})
	 	 	.done(function(error, lb){
	 	 		if(error){
	 	 			console.log(error);
	 	 			res.send({message : 'DB Error'});
	 	 		} else {
	 	 			res.send({message:'success'});
	 	 		}
	 	 	});
	 	 },

	 	 restoreLabBook : function(req, res){
	 	 	var version = req.param('versionid');
	 	 	var labid = req.param('labbookid');

	 	 	if(version && labid){
	 	 		LabBookVersion.findOne({id : version})
	 	 		.done(function(error, labitem){
	 	 			if(error){
	 	 				console.log(error);
	 	 				res.send({message : 'error 4'});
	 	 			} else if(labitem){
	 	 				LabBook.findOne({id : labid})
	 	 				.done(function(error, lab){
	 	 					if(error){
	 	 						console.log(error);
	 	 						res.send({message : 'error 3'});
	 	 					} else if(lab){
	 	 						delete labitem.id;
	 	 						username = "<a href='#/people' ng-click='viewProfile("+req.user.id+")' class='activity_link'> " + req.user.username+"  </a>";
	 	 						labitem.creater = username;
	 	 						labitem.createrid = req.user.id;
	 	 						LabBook.update({id : labid}, labitem)
	 	 						
	 	 						.done(function(error, l){
	 	 							if(error){
	 	 								console.log(error);
	 	 								res.send({message : 'error 2'})
	 	 							} else if(l){
	 	 								res.send({message : 'success'});
	 	 								// lab.labbookid = labid;
			 	 						// delete lab.id;
			 	 						// LabBookVersion.create(lab)
	 	 								// .done(function(error, succ){
	 	 								// 	if(error){
	 	 								// 		console.log(error);
	 	 								// 		res.send({message : 'error 1'});
	 	 								// 	} else if(succ){
	 	 								// 		res.send({message : 'success', item : succ});
	 	 								// 	} else{
	 	 								// 		res.send({message : 'success 1'});
	 	 								// 	}
	 	 								// });
	 	 							} else{
	 	 								res.send({message : 'success 2'});
	 	 							}
	 	 						});
	 	 					} else{
	 	 						res.send({message : "success 3"});
	 	 					}
	 	 				});
	 	 			} else{
	 	 				res.send({message : 'success 4'});
	 	 			}
	 	 		});
	 	 	} else{
	 	 		res.send({message : 'something not found'});
	 	 	}
	 	 },

	 	 searchProjectSuggestions : function(req, res){
	 	 	var projectId = req.param('projectId');
	 	 	var query = req.param('query').toLowerCase();
	 	 	if(projectId){
	 	 		var user = req.user;
	 	 		var suggestions = new Array();

	 	 		function addSuggession(data){
	 	 			var found = false;
	 	 			for(var v = 0; v < suggestions.length; v++){
	 	 				if(suggestions[v].value == data.value)
	 	 					found = true;
	 	 			}
	 	 			if(!found) 
	 	 				suggestions.push(data);
	 	 		}

	 	 		function splitTagsAndAdd(t){
	 	 			var tags = t.split(',');
	 	 			var z = -1;

	 	 			function nextTag(){
	 	 				z++;
	 	 				if(tags.length > z){
	 	 					if(tags[z] && tags[z].toLowerCase().indexOf(query) >= 0) {
	 	 						addSuggession({
		 	 						value : tags[z],
		 	 						data : tags[z]
	 	 						});
	 	 					}
	 	 					nextTag();
	 	 				}
	 	 			}
	 	 			nextTag();
	 	 		}

	 	 		Project.findOne({id : projectId})
	 	 		.done(function(error, project){
	 	 			if(error){
	 	 				console.log(error);
	 	 				res.json({
						    // Query is not required as of version 1.2.5
						    "query": "Unit",
						    "suggestions": suggestions
						});
	 	 			} else {
	 	 				if(project.projectname.toLowerCase().indexOf(query) >= 0){
	 	 					addSuggession({
	 	 						value : project.projectname,
	 	 						data : project.projectname
	 	 					});
	 	 				}


	 	 				LabBook.find({projectid : projectId, isDeleted : false})
			 	 		.done(function(error,labbooks){
			 	 			if(error){
			 	 				console.log(error);
			 	 				res.json({
								    // Query is not required as of version 1.2.5
								    "query": "Unit",
								    "suggestions": suggestions
								});
			 	 			} else {
			 	 				var z = -1;

			 	 				function nextItem(){
			 	 					z++;
			 	 					if(z < labbooks.length){
			 	 						if(labbooks[z].name && labbooks[z].name.toLowerCase().indexOf(query) >= 0){
			 	 							addSuggession({
			 	 								value : labbooks[z].name,
			 	 								data : labbooks[z].name
			 	 							});
			 	 						}

			 	 						if(labbooks[z].labbooktype && labbooks[z].labbooktype.toLowerCase().indexOf(query) >= 0){
			 	 							addSuggession({
			 	 								value : labbooks[z].name,
			 	 								data : labbooks[z].name
			 	 							});
			 	 						}
			 	 						if(labbooks[z].tags){
			 	 							splitTagsAndAdd(labbooks[z].tags);
			 	 						}
			 	 						nextItem();
			 	 					} else {
			 	 						LabBookVersion.find({projectid : projectId, isDeleted : false})
							 	 		.done(function(error,labbooksv){
							 	 			if(error){
							 	 				console.log(error);
							 	 				res.json({
												    // Query is not required as of version 1.2.5
												    "query": "Unit",
												    "suggestions": suggestions
												});
							 	 			} else {
							 	 				var z = -1;

							 	 				function nextItemV(){
							 	 					z++;
							 	 					if(z < labbooksv.length){
							 	 						if(labbooksv[z].name && labbooksv[z].name.toLowerCase().indexOf(query) >= 0){
							 	 							addSuggession({
							 	 								value : labbooksv[z].name,
							 	 								data : labbooksv[z].name
							 	 							});
							 	 						}

							 	 						if(labbooksv[z].tags){
							 	 							splitTagsAndAdd(labbooksv[z].tags);
							 	 						}
							 	 						nextItemV();
							 	 					} else {

							 	 						Discussion.find({projectid : projectId})
							 	 						.done(function(err, discussions){
							 	 							if(error) {
							 	 								console.log(error);
							 	 								res.json({
																    // Query is not required as of version 1.2.5
																    "query": "Unit",
																    "suggestions": suggestions
																});
							 	 							} else {
							 	 								var z = -1;
							 	 								function nextDis(){
							 	 									z++;
							 	 									
							 	 									if(z < discussions.length){
							 	 										
							 	 										if(discussions[z] && discussions[z].title.toLowerCase().indexOf(query) >= 0){
							 	 											addSuggession({
											 	 								value : discussions[z].title,
											 	 								data : discussions[z].title
											 	 							});
							 	 										}
							 	 										nextDis();

							 	 									} else {

							 	 										Project.findOne({id : projectId})
							 	 										.done(function(err, project){
							 	 											if(err){
							 	 												console.log(error);
							 	 												res.json({
																				    // Query is not required as of version 1.2.5
																				    "query": "Unit",
																				    "suggestions": suggestions
																				});
							 	 											} else {
							 	 												if(project.username && project.username.toLowerCase().indexOf(query) >=0){
							 	 													addSuggession({
													 	 								value : project.username,
													 	 								data : project.username
													 	 							});
							 	 												}

							 	 												Colaborations.find({projectid : projectId})
							 	 												.done(function(error, cols){
							 	 													if(error){
							 	 														console.log(error);
							 	 														res.json({
																						    // Query is not required as of version 1.2.5
																						    "query": "Unit",
																						    "suggestions": suggestions
																						});
							 	 													} else {
							 	 														var z = -1;
							 	 														function nextCola(){
							 	 															z++;
							 	 															if(z < cols.length){
							 	 																User.findOne({email : cols[z].colaborator})
							 	 																.done(function(error, user){
							 	 																	if(error){
							 	 																		console.log(error);
							 	 																		res.json({
																										    // Query is not required as of version 1.2.5
																										    "query": "Unit",
																										    "suggestions": suggestions
																										});
							 	 																	} else {
							 	 																		if(user.username.toLowerCase().indexOf(query) >= 0){
							 	 																			addSuggession({
																			 	 								value : user.username,
																			 	 								data : user.username
																			 	 							});
							 	 																		}
							 	 																		nextCola();
							 	 																	}
							 	 																});
							 	 															} else {
							 	 																res.json({
																								    // Query is not required as of version 1.2.5
																								    "query": "Unit",
																								    "suggestions": suggestions
																								});
							 	 															}
							 	 														}
							 	 														nextCola();
							 	 													}
							 	 												});
							 	 											}
							 	 										});
							 	 									}
							 	 								}
							 	 								nextDis();
							 	 							}
							 	 						});
							 	 					}
							 	 				}
							 	 				nextItemV();
							 	 			}
							 	 		});
			 	 					}
			 	 				}
			 	 				nextItem();
			 	 			}
			 	 		});
	 	 			}
	 	 		});
	 	 	} else {


	 	 		var user = req.user;
	 	 		var suggestions = new Array();

	 	 		function addSuggession(data){
	 	 			var found = false;
	 	 			for(var v = 0; v < suggestions.length; v++){
	 	 				if(suggestions[v].value == data.value)
	 	 					found = true;
	 	 			}
	 	 			if(!found) 
	 	 				suggestions.push(data);
	 	 		}

	 	 		function splitTagsAndAdd(t){
	 	 			var tags = t.split(',');
	 	 			var z = -1;

	 	 			function nextTag(){
	 	 				z++;
	 	 				if(tags.length > z){
	 	 					if(tags[z] && tags[z].toLowerCase().indexOf(query) >= 0) {
	 	 						addSuggession({
		 	 						value : tags[z],
		 	 						data : tags[z]
	 	 						});
	 	 					}
	 	 					nextTag();
	 	 				}
	 	 			}
	 	 			nextTag();
	 	 		}

	 	 		Project.find()
	 	 		.done(function(error, projects){
	 	 			if(error){
	 	 				console.log(error);
	 	 				res.json({
						    // Query is not required as of version 1.2.5
						    "query": "Unit",
						    "suggestions": suggestions
						});
	 	 			} else {
	 	 				var z = -1;
	 	 				function nextProj(){
	 	 					z++;
	 	 					if(z < projects.length){
	 	 						if(projects[z] && projects[z].projectname.toLowerCase().indexOf(query) >=0){
	 	 							addSuggession({
	 	 								value : projects[z].projectname,
	 	 								data : projects[z].projectname
	 	 							});
	 	 						}
	 	 							var projectId = projects[z].id;

				 	 				LabBook.find({projectid : projectId, isDeleted : false})
						 	 		.done(function(error,labbooks){
						 	 			if(error){
						 	 				console.log(error);
						 	 				res.json({
											    // Query is not required as of version 1.2.5
											    "query": "Unit",
											    "suggestions": suggestions
											});
						 	 			} else {
						 	 				var z = -1;

						 	 				function nextItem(){
						 	 					z++;
						 	 					if(z < labbooks.length){
						 	 						if(labbooks[z].name && labbooks[z].name.toLowerCase().indexOf(query) >= 0){
						 	 							addSuggession({
						 	 								value : labbooks[z].name,
						 	 								data : labbooks[z].name
						 	 							});
						 	 						}

						 	 						if(labbooks[z].labbooktype && labbooks[z].labbooktype.toLowerCase().indexOf(query) >= 0){
						 	 							addSuggession({
						 	 								value : labbooks[z].name,
						 	 								data : labbooks[z].name
						 	 							});
						 	 						}
						 	 						if(labbooks[z].tags){
						 	 							splitTagsAndAdd(labbooks[z].tags);
						 	 						}
						 	 						nextItem();
						 	 					} else {
						 	 						LabBookVersion.find({projectid : projectId, isDeleted : false})
										 	 		.done(function(error,labbooksv){
										 	 			if(error){
										 	 				console.log(error);
										 	 				res.json({
															    // Query is not required as of version 1.2.5
															    "query": "Unit",
															    "suggestions": suggestions
															});
										 	 			} else {
										 	 				var z = -1;

										 	 				function nextItemV(){
										 	 					z++;
										 	 					if(z < labbooksv.length){
										 	 						if(labbooksv[z].name && labbooksv[z].name.toLowerCase().indexOf(query) >= 0){
										 	 							addSuggession({
										 	 								value : labbooksv[z].name,
										 	 								data : labbooksv[z].name
										 	 							});
										 	 						}

										 	 						if(labbooksv[z].tags){
										 	 							splitTagsAndAdd(labbooksv[z].tags);
										 	 						}
										 	 						nextItemV();
										 	 					} else {

										 	 						Discussion.find({projectid : projectId})
										 	 						.done(function(err, discussions){
										 	 							if(error) {
										 	 								console.log(error);
										 	 								res.json({
																			    // Query is not required as of version 1.2.5
																			    "query": "Unit",
																			    "suggestions": suggestions
																			});
										 	 							} else {
										 	 								var z = -1;
										 	 								function nextDis(){
										 	 									z++;
										 	 									
										 	 									if(z < discussions.length){
										 	 										
										 	 										if(discussions[z] && discussions[z].title.toLowerCase().indexOf(query) >= 0){
										 	 											addSuggession({
														 	 								value : discussions[z].title,
														 	 								data : discussions[z].title
														 	 							});
										 	 										}
										 	 										nextDis();

										 	 									} else {
										 	 										User.find()
										 	 										.done(function(error, users){
										 	 											if(error){
										 	 												console.log(error);
										 	 												res.json({
																							    // Query is not required as of version 1.2.5
																							    "query": "Unit",
																							    "suggestions": suggestions
																							});
										 	 											} else {
										 	 												var z = -1;

										 	 												function nextUser(){
										 	 													z++;
										 	 													if(z < users.length){
										 	 														if(users[z].username.toLowerCase().indexOf(query) >= 0){
										 	 															addSuggession({
																		 	 								value : users[z].username,
																		 	 								data : users[z].username
																		 	 							});
										 	 														}
										 	 														nextUser();
										 	 													} else {
										 	 														nextProj();
										 	 													}
										 	 												}
										 	 												nextUser();
										 	 											}
										 	 										});
										 	 									}
										 	 								}
										 	 								nextDis();
										 	 							}
										 	 						});
										 	 					}
										 	 				}
										 	 				nextItemV();
										 	 			}
										 	 		});
						 	 					}
						 	 				}
						 	 				nextItem();
						 	 			}
						 	 		});
	 	 					} else {
	 	 						res.json({
								    // Query is not required as of version 1.2.5
								    "query": "Unit",
								    "suggestions": suggestions
								});
	 	 					}
	 	 				}
	 	 				nextProj();
	 	 			}
	 	 		});
	 	 	}
	 	 },

	 	 search : function(req, res){
	 	 	var projectId = req.param('projectId');

	 	 	var query = req.param('q').toLowerCase();

	 	 	var projectResult = new Array();
 	 		var userResult = new Array();
 	 		var labbookResult = new Array();
 	 		var discussionResult = new Array();
 	 		var labbookVersionResult = new Array();

	 	 	if(projectId && projectId != 'undefined'){

			 	 		function searchInDiscussionP(){
			 	 		Discussion.find({projectid : projectId})
			 	 		.done(function(error, diss){
			 	 			if(error){
			 	 				console.log(error);
			 	 				// do somenthing
			 	 			} else {
			 	 				var z = -1;
			 	 				function nextDiss(){
			 	 					z++;
			 	 					if(diss.length > z){
			 	 						if(diss[z].title.toLowerCase().indexOf(query) >= 0){
			 	 							discussionResult.push(diss[z]);
			 	 						}
			 	 						nextDiss();
			 	 					} else {
			 	 						var object = new Object();
				 	 					object.projectResult = projectResult;
				 	 					object.labbookResult = labbookResult.concat(labbookVersionResult);
				 	 					object.userResult = userResult;
				 	 					object.discussionResult = discussionResult;

				 	 					res.send({message : 'success', result : object});
			 	 					}
			 	 				}
			 	 				nextDiss();
			 	 			}
			 	 		});
			 	 	}

			 	 	function searchInLabBooksVersionP(){
			 	 		LabBook.find({projectid : projectId, isDeleted : false})
			 	 		.done(function(error, labbooks){
			 	 			if(error){
			 	 				console.log(error);
			 	 				// do somethings
			 	 			} else {
			 	 				var z = -1;
			 	 				function nextLab(){
			 	 					z++;
			 	 					if(labbooks.length > z){
			 	 						if(labbooks[z].name.toLowerCase().indexOf(query) >= 0 || labbooks[z].tags.toLowerCase().indexOf(query) >= 0){
			 	 							labbookVersionResult.push(labbooks[z]);
			 	 						}
			 	 						nextLab();
			 	 					} else {
			 	 						searchInDiscussionP();
			 	 					}
			 	 				}
			 	 				nextLab();
			 	 			}
			 	 		});
			 	 	}


			 	 	function searchInLabBooksP(){
			 	 		LabBook.find({projectid : projectId, isDeleted : false})
			 	 		.done(function(error, labbooks){
			 	 			if(error){
			 	 				console.log(error);
			 	 				// do somethings
			 	 			} else {
			 	 				var z = -1;
			 	 				function nextLab(){
			 	 					z++;
			 	 					if(labbooks.length > z){
			 	 						if(labbooks[z].name.toLowerCase().indexOf(query) >=0 || labbooks[z].tags.toLowerCase().indexOf(query) >= 0){
			 	 							labbookResult.push(labbooks[z]);
			 	 						}
			 	 						nextLab();
			 	 					} else {
			 	 						searchInLabBooksVersionP();
			 	 					}
			 	 				}
			 	 				nextLab();
			 	 			}
			 	 		});
			 	 	}

			 	 	function searchInColaborationP(){
			 	 		Colaborations.findOne({projectid : projectId})
			 	 		.done(function(error, colas){
			 	 			if(error){
			 	 				console.log();
			 	 				// do something
			 	 			} else {
			 	 				var k = -1;
			 	 				function nextCola(){
			 	 					k++;
			 	 					if(colas.length < k){

			 	 						User.find({email : colas[k].email})
							 	 		.done(function(error, users){
							 	 			if(error){
							 	 				console.log(error);
							 	 				// do something
							 	 			} else {
							 	 				var z = -1;
							 	 				function nextUser(){
							 	 					z++;
							 	 					if(z < users.length){
							 	 						if(users[z].username.toLowerCase().indexOf(query) >= 0){
							 	 							userResult.push(users[z]);
							 	 						}
							 	 						nextUser();
							 	 					} else {
							 	 						//do something
							 	 						nextCola();
							 	 					}
							 	 				}
							 	 				nextUser();
							 	 			}
							 	 		});
			 	 					} else {
			 	 						searchInLabBooksP();
			 	 					}
			 	 				}
			 	 				nextCola();
			 	 			}
			 	 		});
			 	 	}


			 	 	function searchUser(){
			 	 		Project.findOne({id : projectId})
			 	 		.done(function(error, project){
			 	 			if(error){
			 	 				console.log();
			 	 				// do something
			 	 			} else {
			 	 				User.find({username : project.username})
					 	 		.done(function(error, users){
					 	 			if(error){
					 	 				console.log(error);
					 	 				// do something
					 	 			} else {
					 	 				var z = -1;
					 	 				function nextUser(){
					 	 					z++;
					 	 					if(z < users.length){
					 	 						if(users[z].username.toLowerCase().indexOf(query) >= 0){
					 	 							userResult.push(users[z]);
					 	 						}
					 	 						nextUser();
					 	 					} else {
					 	 						//do something
					 	 						searchInColaborationP();
					 	 					}
					 	 				}
					 	 				nextUser();
					 	 			}
					 	 		});
			 	 			}
			 	 		});
			 	 	}

			 	 	searchUser();

	 	 	} else {
		 	 		
		 	 		function searchInProject(){
		 	 			Project.find()
			 	 		.done(function(error, projects){
			 	 			if(error){
			 	 				console.log(error);
			 	 				// do somethings
			 	 			} else {
			 	 				var z = -1;
			 	 				function nextProject(){
			 	 					z++;
			 	 					if(projects.length > z){
			 	 						if(projects[z]){
				 	 						if(projects[z].projectname.toLowerCase().indexOf(query) >= 0){
				 	 							projectResult.push(projects[z]);
				 	 						}
				 	 					}
				 	 					nextProject();
			 	 					} else {
				 	 					
				 	 					var object = new Object();
				 	 					object.projectResult = projectResult;
				 	 					object.labbookResult = labbookResult.concat(labbookVersionResult);
				 	 					object.userResult = userResult;
				 	 					object.discussionResult = discussionResult;

				 	 					res.send({message : 'success', result : object});

				 	 				}
			 	 				}
			 	 				nextProject();
			 	 			}
			 	 		});
			 	 	}


			 	 		function searchInDiscussion(){
			 	 		Discussion.find()
			 	 		.done(function(error, diss){
			 	 			if(error){
			 	 				console.log(error);
			 	 				// do somenthing
			 	 			} else {
			 	 				var z = -1;
			 	 				function nextDiss(){
			 	 					z++;
			 	 					if(diss.length > z){
			 	 						if(diss[z].title.toLowerCase().indexOf(query) >= 0){
			 	 							discussionResult.push(diss[z]);
			 	 						}
			 	 						nextDiss();
			 	 					} else {
			 	 						searchInProject();
			 	 					}
			 	 				}
			 	 				nextDiss();
			 	 			}
			 	 		});
			 	 	}


			 	 	function searchInColaboration(){
			 	 		Colaborations.find()
			 	 		.done(function(error, colas){

			 	 		});
			 	 	}


			 	 	function searchInLabBooksVersion(){
			 	 		LabBook.find({isDeleted : false})
			 	 		.done(function(error, labbooks){
			 	 			if(error){
			 	 				console.log(error);
			 	 				// do somethings
			 	 			} else {
			 	 				var z = -1;
			 	 				function nextLab(){
			 	 					z++;
			 	 					if(labbooks.length > z){
			 	 						if(labbooks[z].name.toLowerCase().indexOf(query) >= 0 || labbooks[z].tags.toLowerCase().indexOf(query) >= 0){
			 	 							labbookVersionResult.push(labbooks[z]);
			 	 						}
			 	 						nextLab();
			 	 					} else {
			 	 						searchInDiscussion();
			 	 					}
			 	 				}
			 	 				nextLab();
			 	 			}
			 	 		});
			 	 	}


			 	 	function searchInLabBooks(){
			 	 		LabBook.find({isDeleted : false})
			 	 		.done(function(error, labbooks){
			 	 			if(error){
			 	 				console.log(error);
			 	 				// do somethings
			 	 			} else {
			 	 				var z = -1;
			 	 				function nextLab(){
			 	 					z++;
			 	 					if(labbooks.length > z){
			 	 						if(labbooks[z].name.toLowerCase().indexOf(query) >=0 || labbooks[z].tags.toLowerCase().indexOf(query) >= 0){
			 	 							labbookResult.push(labbooks[z]);
			 	 						}
			 	 						nextLab();
			 	 					} else {
			 	 						searchInLabBooksVersion();
			 	 					}
			 	 				}
			 	 				nextLab();
			 	 			}
			 	 		});
			 	 	}



			 	 	function searchInUser(){
			 	 		User.find()
			 	 		.done(function(error, users){
			 	 			if(error){
			 	 				console.log(error);
			 	 				// do something
			 	 			} else {
			 	 				var z = -1;
			 	 				function nextUser(){
			 	 					z++;
			 	 					if(z < users.length){
			 	 						if(users[z].username.toLowerCase().indexOf(query) >= 0){
			 	 							userResult.push(users[z]);
			 	 						}
			 	 						nextUser();
			 	 					} else {
			 	 						//do something
			 	 						searchInLabBooks();
			 	 					}
			 	 				}
			 	 				nextUser();
			 	 			}
			 	 		});
			 	 	}

			 	 	searchInUser();

	 	 		}
	 	 },

	 	 exportLabbook : function(req, res){
	 	 	var id = req.param('projectid');
	 	 	var user = req.user;
	 	 	if(id && user){
	 	 		console.log(id);
	 	 		
	 	 		try{
	 	 			var zip = new JSZip();
	 	 			var notes = zip.folder("notes");
	 	 			var experiments = zip.folder("experiments");
	 	 			var protocols = zip.folder("protocols");
	 	 			var litratures = zip.folder("literatures");
	 	 		} catch(e){
	 	 			console.log(e);
	 	 			res.send("error while creating zip");
	 	 		}
	 	 		function createZip(){
	 	 			LabBook.find({projectid : id})
	 	 			.done(function(error, lbs){
	 	 				if(error){
	 	 					console.log(error);
	 	 					res.send("error while reading lab books");
	 	 				} else if(lbs){
	 	 					var z = -1;
	 	 					function labItem(){
	 	 						z++;
	 	 						if(z < lbs.length){
	 	 							
	 	 							if(lbs[z].files != null && lbs[z].files && lbs[z].files != 'undefined'){

	 	 								var files = new Array();
	 	 								files = lbs[z].files.split(',');

	 	 								v = -1;
	 	 								function nextFile(){
	 	 									v++;
	 	 									if(v < files.length){
	 	 										if(files[v]){
		 	 										LabBookFiles.findOne({id:files[v]})
		 	 										.done(function(error, data){
		 	 											if(error){
		 	 												throw error;
		 	 												nextFile();
		 	 											}else if(data){
		 	 												
	 	 													fs.readFile('./assets'+data.filepath, function(err, strm){
	 	 														if(error){
	 	 															throw error;
	 	 															nextFile();
	 	 														} else {
	 	 															var imgData = new Buffer(strm, 'binary').toString('base64');
	 	 															if(lbs[z].labbooktype == 'note'){
	 	 																notes.file(data.filename, imgData, {base64: true});
	 	 															} else if(lbs[z].labbooktype == 'litrature') {
	 	 																litratures.file(data.filename, imgData, {base64: true});
	 	 															} else if(lbs[z].labbooktype == 'protocol') {
	 	 																protocols.file(data.filename, imgData, {base64: true});
	 	 															} else if(lbs[z].labbooktype == 'experiment') {
	 	 																experiments.file(data.filename, imgData, {base64: true});
	 	 															}
	 	 															nextFile();
	 	 														}
	 	 													});
		 	 												
		 	 											} else {
		 	 												nextFile();
		 	 											}
		 	 										});
		 	 									 } else {
		 	 									 	nextFile();
		 	 									 }
		 	 									
	 	 									} else {
	 	 										labItem();
	 	 									}
	 	 								}
	 	 								nextFile();
	 	 							} else {
	 	 								labItem();
	 	 							}

	 	 						} else {

									var dirPath = ZIP_FOLDER_PATH + '/' +id;
									var filePath = dirPath + '/lab_book' + id + "-" + req.user.id + '.zip';
									try {
									  	mkdirp.sync("./assets"+dirPath, 0755);					  	
									} catch (e) {
									  	console.log(e);
									}

	 	 							var buffer = zip.generate({type:"nodebuffer"});
									fs.writeFile("./assets"+filePath, buffer, function(err) {
									  if (err) throw err;
									  else res.download("./assets" + filePath);
									});
	 	 						}
	 	 					}
	 	 					labItem();
	 	 				} else {
	 	 					res.send("no lab books");
	 	 				}
	 	 			});
	 	 		}


	 	 		createZip();

	 	 	} else {
	 	 		res.send("unauthorized request");
	 	 	}
	 	 },

	 	 createTask : function(req, res){

	 	 	var projectid = req.param('projectid');
	 	 	var title = req.param('title');
	 	 	var description = req.param('description');
	 	 	var assignedto = req.param('assignedto');
	 	 	var startdate = req.param('startdate').trim();
	 	 	var enddate = req.param('enddate').trim();
	 	 	var createrid = req.user.id;

	 	 	var obj = new Object();

	 	 	if(projectid){
	 	 		obj = {
			 	 			projectid : projectid,
			 	 			title : title,
			 	 			description : description,
			 	 			startdate : startdate,
			 	 			enddate : enddate,
			 	 			createrid : createrid
			 	 		}
	 	 	} else {
	 	 		obj = {
			 	 			title : title,
			 	 			description : description,
			 	 			startdate : startdate,
			 	 			enddate : enddate,
			 	 			createrid : createrid
			 	 		}
	 	 	}

	 	 	if(createrid){
	 	 		Tasks.create(obj)
	 	 		.done(function(error, task){
	 	 			if(error){
	 	 				console.log("Error = ", error);
	 	 				throw error;
	 	 				res.send({message : "DB Error"});
	 	 			} else if(task){

	 	 				TaskAssignments.create({
	 	 					taskid : task.id,
	 	 					assignedto : assignedto == '' ? req.user.id : assignedto,
	 	 					createrid : req.user.id
	 	 				})
	 	 				.done(function(error, createdtask){
	 	 					if(error){
	 	 						console.log("Error = ", error);
	 	 						throw error;
	 	 						res.send({message : 'DB Error'});
	 	 					} else if(createdtask) {
	 	 						res.send({message : 'success', task : task});
	 	 					} else {
	 	 						res.send({message : 'task not assigned.'});
	 	 					}
	 	 				});
	 	 			} else {
	 	 				res.send({message : 'task not created'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send({message : "please login to continue."});
	 	 	}
	 	 },

	 	 getCreatedTasks : function(req, res){

	 	 	var userid = req.user.id;
	 	 	Tasks.find({createrid : userid, isDeleted : false})
	 	 	.sort({id : 'desc'})
	 	 	.done(function(error, tasks){
	 	 		if(error){
	 	 			throw error;
	 	 			console.log(error);
	 	 			res.send({message : 'DB Error'});
	 	 		} else {


	 	 			function findUser(id, cb){
	 	 				User.findOne({id : id})
						.done(function(error, user){
							if(error){
								throw error;
								cb(error, null);
							} else if(user){
								cb(null, user);
							} else {
								cb(null, null);
							}
						});
	 	 			}

	 	 			function findProject(id, cb){
	 	 				Project.findOne({id : id})
	 	 				.done(function(error, project){
	 	 					if(error){
	 	 						throw error;
	 	 						cb(error, null);
	 	 					} else if(project){
	 	 						cb(null, project);
	 	 					} else {
	 	 						return {};
	 	 					}
	 	 				});
	 	 			}

	 	 			var k = -1;
	 	 			function nextTask(){
	 	 				k++;
	 	 				if(tasks.length > k){
	 	 					TaskAssignments.findOne({taskid : tasks[k].id})
	 	 					.done(function(error, ts){
	 	 						if(error){
	 	 							throw error;
	 	 							tasks[k].assignedto = {};
	 	 							tasks[k].detail = {};
	 	 							nextTask();
	 	 						} else if(ts) {
	 	 							tasks[k].detail = ts;
	 	 							if(ts.assignedto == userid){
	 	 								tasks[k].assignedto = req.user;
	 	 								findProject(tasks[k].projectid, function(error, project){
 											if(error){
 												throw error;
 												console.log(error);
 												tasks[k].project = {};
 												nextTask();
 											} else if(project) {
 												tasks[k].project = project;
 												nextTask();
 											} else {
 												tasks[k].project = {};
 												nextTask();
 											}
 										});
	 	 							} else {
	 	 								findUser(ts.assignedto, function(error, user){
	 	 									if(error){
	 	 										throw error;
	 	 										console.log(error);
	 	 										tasks[k].assignedto = {};
	 	 										nextTask();
	 	 									} else if(user) {
	 	 										tasks[k].assignedto = user;
	 	 										findProject(tasks[k].projectid, function(error, project){
	 	 											if(error){
	 	 												throw error;
	 	 												console.log(error);
	 	 												tasks[k].project = {};
	 	 												nextTask();
	 	 											} else if(project) {
	 	 												tasks[k].project = project;
	 	 												nextTask();
	 	 											} else {
	 	 												tasks[k].project = {};
	 	 												nextTask();
	 	 											}
	 	 										});
	 	 									} else {
	 	 										tasks[k].assignedto = {};
	 	 									}
	 	 								});
	 	 							}
	 	 						} else {
	 	 							tasks[k].assignedto = {};
	 	 							nextTask();
	 	 						}
	 	 					});

	 	 				} else {
	 	 					res.send({message : 'success', createdTasks : tasks});
	 	 				}
	 	 			}
	 	 			nextTask();
	 	 		}
	 	 	});

	 	 },

	 	 markTaskAsDoneUndone : function(req, res){
	 	 	var assid = req.param('assid');
	 	 	var value = req.param('value');

	 	 	var update = new Object();
	 	 	if(value){
	 	 		update = {
	 	 			isCompleted : true, 
	 	 			taskcompleted : 100, 
	 	 			status : 'Completed'
	 	 		}
	 	 	} else {
	 	 		update = {
	 	 			isCompleted : false, 
	 	 			taskcompleted : 0, 
	 	 			status : 'Uncompleted'
	 	 		}
	 	 	}

	 	 	TaskAssignments.update({id : assid}, update)
	 	 	.done(function(error, task){
	 	 		if(error){
	 	 			throw error;
	 	 			console.log(error);
	 	 			res.send({message : 'Error'});
	 	 		} else {
	 	 			res.send({message : 'success'});
	 	 		}
	 	 	});
	 	 },

	 	 updateTask : function(req, res){
	 	 	var projectid = req.param('projectid');
	 	 	var title = req.param('title');
	 	 	var description = req.param('description');
	 	 	var assignedto = req.param('assignedto');
	 	 	var startdate = req.param('startdate').trim();
	 	 	var enddate = req.param('enddate').trim();
	 	 	var createrid = req.user.id;
	 	 	var id = req.param('id');
	 	 	var obj = new Object();

	 	 	console.log('projectid',projectid);
	 	 	if(projectid){
	 	 		obj = {
			 	 			projectid : projectid,
			 	 			title : title,
			 	 			description : description,
			 	 			startdate : startdate,
			 	 			enddate : enddate,
			 	 			createrid : createrid
			 	 		}
	 	 	} else {
	 	 		obj = {
			 	 			title : title,
			 	 			description : description,
			 	 			startdate : startdate,
			 	 			enddate : enddate,
			 	 			createrid : createrid
			 	 		}
	 	 	}

	 	 	if(createrid){
	 	 		Tasks.update({id : id}, obj)
	 	 		.done(function(error, task){
	 	 			if(error){
	 	 				console.log("Error = ", error);
	 	 				throw error;
	 	 				res.send({message : "DB Error"});
	 	 			} else if(task){

	 	 				TaskAssignments.update({taskid : task.id},{
	 	 					assignedto : assignedto != '' ? assignedto : req.user.id,
	 	 					createrid : req.user.id
	 	 				})
	 	 				.done(function(error, createdtask){
	 	 					if(error){
	 	 						console.log("Error = ", error);
	 	 						throw error;
	 	 						res.send({message : 'DB Error'});
	 	 					} else if(createdtask) {
	 	 						res.send({message : 'success', task : task});
	 	 					} else {
	 	 						res.send({message : 'task not assigned.'});
	 	 					}
	 	 				});
	 	 			} else {
	 	 				res.send({message : 'task not updated'});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send({message : "please login to continue."});
	 	 	}
	 	 },

	 	 deleteTask : function(req, res){
	 	 	var id = req.param('id');
	 	 	if(id){
	 	 		Tasks.update({id : id}, {isDeleted : true})
	 	 		.done(function(error, task){
	 	 			if(error){
	 	 				throw error;
	 	 				console.log(error);
	 	 				res.send({message : 'DB Error'});
	 	 			} else {
	 	 				TaskAssignments.update({taskid : id}, {isDeleted : true})
	 	 				.done(function(error, ts){
	 	 					if(error){
	 	 						throw error;
	 	 					}
	 	 					res.send({message : 'success'});
	 	 				});
	 	 			}
	 	 		});
	 	 	} else {
	 	 		res.send({message : 'parameter not found'});
	 	 	}
	 	 },


		createTaskCommnets : function(req, res){
       TaskComment.create({taskid : req.body.taskid, comment : req.body.comm, creatername : req.user.firstname, createrid : req.user.id}).done(function(err, comment){
	         if(err){
	           	res.send({message : "success"});
	           	return;
	         }
	         res.send({message : "success", comment : comment});        
       });                
		},

		getTaskCommnets : function(req, res){
       TaskComment.find({taskid : req.body.taskid}).done(function(err, comments){
         if(err){
           	res.send({message : "success"});
           	return;
         }
         res.send({message : "success", comments : comments});        
       });
		},

		getMyTask : function(req, res){
			var myTask = new Array();
			TaskAssignments.find({assignedto : req.user.id, isDeleted : false})
			.done(function(error, asstsk){
				if(error){
					throw error;
					console.log(error);
					res.send({message : 'DB Error' });
				} else if(asstsk.length > 0){

					var k = -1;
					function next(){
						k++;
						if(asstsk.length > k){
							Tasks.findOne({id : asstsk[k].taskid, isDeleted : false})
							.done(function(err, task){
								if(error){
									throw error;
									console.log(error);
									res.send({message : 'DB Error'});
								} else if(task) {
									task.assignedto = req.user;
									task.detail = asstsk[k];
									Project.findOne({id : task.projectid})
									.done(function(error, project){
										if(error){
											throw error;
											console.log(error);
											res.send({message : 'DB Error'});
										} else if(project){
											task.project = project;
											User.findOne({id:task.createrid})
											.done(function(error, creater){
												if(error){
													throw error;
													console.log(error);
													res.send({message : 'DB Error'});
												} else if(creater){
													task.assignedby = creater;
													myTask.push(task);
													next();
												} else {
													next();
												}
											});
										}
									})
								} else {
									next();
								}
							});
						} else {
							res.send({message : 'success', myTask : myTask});
						}
					}
					next();
				} else {
					res.send({message : 'success', myTask : myTask});
				}
			});
		},

		getUnSeenTasks : function(req, res){
			TaskAssignments.find({assignedto : req.user.id, isSeen : false, isDeleted : false})
			.done(function(error, tasks){
				if(error){
					console.log(error);
					throw error;
					res.send({message : 'DB Error'});
				} else {
					res.send({message : 'success', unSeenTasks : tasks});
				}
			});
		},

		markIsSeenTask : function(req, res){
			var id = req.param('id');
			if(id){
				TaskAssignments.update({id : id}, {isSeen : true})
				.done(function(error, task){
					if(error){
						throw error;
						console.log(error);
						res.send({message : 'DB Error'});
					} else if(task){
						res.send({message : 'success'});
					} else {
						re.send({message : 'task not found'});
					}
				})
			} else {
				res.send('parameter not found');
			}
		},

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AuthController)
     */
    _config: {}


};
