module.exports = {
	attributes : {
		taskid : {
			type : 'integer',
			required : true,
		},
		createrid : {
			type : 'integer',
			required : 'true'
		},
		assignedto : {
			type : 'integer',
			required : true
		},
		status : {
			type : 'string',
			defaultsTo : 'Awating'
		},
		isDeleted : {
			type : 'boolean',
			defaultsTo : false
		},
		isCompleted : {
			type : 'boolean',
			defaultsTo : false
		},
		taskcompleted : {
			type : 'integer',
			defaultsTo : 0
		},
		isSeen : {
			type : 'boolean',
			defaultsTo : false
		}
	}
};