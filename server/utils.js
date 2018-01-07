
var url = require('url');

exports.getParamPairs = function(req){
	var requestUrl = url.parse(req.url),
		requestQuery = requestUrl.query,
		requestParams = requestQuery.split('&');
	params = {};
	for (i = 0; i <= requestParams.length; i++) {
		param = requestParams[i];
		if (param) {
			var p = param.split('=');
			if (p.length != 2) continue;
			params[p[0]] = decodeURIComponent(p[1]);
		}
	}
	return params;
};
