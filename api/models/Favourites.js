
module.exports = {
	attributes : {
		projectid : {
			type : 'integer',
			required : true
		},
		userid : {
			type : 'integer',
			required : true
		},
		isValid : {
			type : 'boolean',
			defaultsTo : true
		}
	}
}