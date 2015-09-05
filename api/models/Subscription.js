



module.exports = {
	attributes : {
		text : {
			type : 'string',
			required : true
		},
		isDisabled: {
			type : 'boolean',
			defaultsTo : false
		},
		isDeleted : {
			type : 'boolean',
			defaultsTo : false
		}
	}
}