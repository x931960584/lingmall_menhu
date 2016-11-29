define(["app"],function(app){
	app.constant("lmrege",{
		username : /([[^\w]|[^0-9]|[^\u4E00-\u9FA5]]){4,20}/,
		email : /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
		password : /^\w{6,20}$/,
		mobile:/^\d{11,14}$/,
		unlawful : /[.]|[%]|[*]|[#]|[!]|[@]|[$]|[&]|[?]|[']|["]|[+]/
	});
});