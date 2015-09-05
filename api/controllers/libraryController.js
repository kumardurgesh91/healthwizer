
/**
 * library controller
 */

 module.exports = {
 	libItem : function(req, res){
 		var libItemName = req.param("libItemName");
 		var libItemType = req.param("libItemType");
 		var libItemId = req.param("libItemId");
 		var username = req.param("username");

 		if(username){
 			if(libItemId == ''){
 			/**
 			 * Create new library item
 			 */

 			libraryItem.create({type : libItemType, name : libItemName, creater : username})
 			.done(function(err, libItem){
 				if(err){
 					console.log(err);
 					res.send(500,{error : error});
 				} else {
 					console.log("library item created");
 					res.send({message : "success", libItem : libItem});
 				}
 			});
 			 
 		} else {
			/**
			 * Update existing library item
			 */

       if(libItemId != 'undefined' && libItemId){
        libraryItem.findOne()
        .where({id:libItemId})
        .exec(function(err, item){
          if(err){
            console.log(err);
            res.send(500,{error : err});
          } else if(item) {
            item.name = libItemName;
            item.save(function(err, item){
              if(err){
                console.log(err);
                res.send(500,{error : "item not saved"});
              } else {
                res.send({message : "success", libItem : item});
              }
            });
          } else {
            res.send(500,{error : "item not found"});
          }
        });
       } else {
        res.send(500,{error : "item id not found"});
       }
 		}
 		} else {
 			res.send(500,{error : "username not found, please login to continue"});
 		}
 	},

  addProjectLibraryItem : function(req, res){
    var libItemName = req.param("libItemName");
    var libItemType = req.param("libItemType");
    var libItemId = req.param("libItemId");
    var username = req.param("username");
    var projectid = req.param("projectid");

    if(username){
      if(libItemId == ''){
      /**
       * Create new library item
       */

      libraryItem.create({type : libItemType, name : libItemName, creater : username, projectid : projectid})
      .done(function(err, libItem){
        if(err){
          console.log(err);
          res.send(500,{error : error});
        } else {
          console.log("library item created");
          res.send({message : "success", libItem : libItem});
        }
      });
       
    } else {
      /**
       * Update existing library item
       */

       if(libItemId != 'undefined' && libItemId){
        libraryItem.findOne()
        .where({id:libItemId})
        .exec(function(err, item){
          if(err){
            console.log(err);
            res.send(500,{error : err});
          } else if(item) {
            item.name = libItemName;
            item.save(function(err, item){
              if(err){
                console.log(err);
                res.send(500,{error : "item not saved"});
              } else {
                res.send({message : "success", libItem : item});
              }
            });
          } else {
            res.send(500,{error : "item not found"});
          }
        });
       } else {
        res.send(500,{error : "item id not found"});
       }
    }
    } else {
      res.send(500,{error : "username not found, please login to continue"});
    }
  },

 	getLibItems : function(req, res){
 		var username = req.param("username");
 		if(username){
 			libraryItem.find()
 			.where({creater : username, projectid : 0})
 			.exec(function(err, libraryItems){
 				if(err){
 					console.log(err);
 					res.send(500,{error : error});
 				} else {
 					res.send({message : "success", libraryItems : libraryItems});
 				}
 			});
 		} else {
 			res.send(500,{error : "username not found, please login to continue"});
 		}
 	},
  deleteLibItem : function(req, res){
    var username = req.param("username");
    var libItemId = req.param("libItemId");

    if(username && libItemId){
      libraryItem.findOne()
      .where({id : libItemId})
      .exec(function(err, item){
        if(err){
          console.log(err);
          res.send(500,{error : err});
        } else if(item){
          libraryItem.destroy({id : libItemId}).exec(function(err, item){
            if(err){
              console.log(err);
              res.send(500,{error : err});
            } else {
              res.send({message : "success"});
            }
          });
        } else {
          res.send(500,{error : "Item not found"});
        }
      });
    } else if(!libItemId) {
      res.send(500,{error : "library item id not found to delete"});
    } else if(!username){
      res.send(500,{error : "username not found, please login to continue"});
    } else {
      res.send(500,{error : "unknown error"});
    }
  },

  getProjectLibItems : function(req, res){
    var projectid = req.param("projectid");
    if(projectid){
      libraryItem.find()
      .where({projectid : projectid})
      .exec(function(err, projectLibraryItems){
        if(err){
          console.log(err);
          res.send(500,{error : error});
        } else {
          res.send({message : "success", projectLibraryItems : projectLibraryItems});
        }
      });
    } else {
      res.send(500,{error : "projectid not found"});
    }
  }
 };

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