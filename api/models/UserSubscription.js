



module.exports = {
	attributes : {
		userid : {
			type : 'integer',
			required : true
		},
		subscriptionid : {
			type : 'integer',
			required : true
		},
		status : {
			type : 'boolean',
			required : true,
			defaultsTo : true
		},
		isDisabled : {
			type : 'boolean',
			defaultsTo : false
		},
		isDeleted : {
			type : 'boolean',
			defaultsTo : false
		}
	}
}