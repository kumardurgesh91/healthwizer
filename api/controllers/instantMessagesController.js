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


module.exports = {

	getInstantMessages : function(req, res){
			var senderid = req.user.id;
			var recieverid = req.body.chatUserId;
			var userpair= "";
			if(senderid<recieverid){
				userpair = senderid+" - "+recieverid;
			}else{
				userpair = recieverid+" - "+senderid;
			}
			InstantMessage.find({userpair : userpair}).done(function(err, chat){
				if(chat)
					res.send({message : "success", chat : chat});
				else
					res.send({message : "success", chat : []});
			});
	},

	sendInstantMessages : function(req, res){
			var senderid = req.user.id;
			var recieverid = req.body.chatUserId;
			var userpair= "";
			if(senderid<recieverid){
				userpair = senderid+" - "+recieverid;
			}else{
				userpair = recieverid+" - "+senderid;
			}				
			InstantMessage.create({message : req.body.message, senderid : senderid, recieverid : recieverid, userpair : userpair}).done(function(err, message){
				if(err){
					res.send({message : "failure"});
					return;
				}else{
					InstantMessage.find({userpair : userpair}).done(function(err, chat){
						if(chat)
							res.send({message : "success", chat : chat});
						else
							res.send({message : "success", chat : []});
					});
				}
			});
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}


};
