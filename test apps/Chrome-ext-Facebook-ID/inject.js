var myUsername = document.getElementsByClassName("_2dpe _1ayn")[0].href;

console.log('My Username: ' + myUsername);

var isPage = document.getElementsByClassName("_58gj fsxxl fwn fcw").length > 0;
var isGroup = (document.getElementsByClassName('_55pe')[0].innerText =="Joined");
var isProfile;
try{
    isProfile = (document.getElementById('fb-timeline-cover-name').innerText.length > 0);
}catch(err){}

console.log("Is a page: "+isPage);
if(!isGroup){
	if(isProfile){
	  var name = document.getElementById('fb-timeline-cover-name').innerText;
	  console.log("Name: "+name);
	}else if(isPage){
	  var pageName = document.getElementsByClassName('_58gi _5rqs')[0].innerText; //replaced '_58gi _5rqs' with '_58gi' , first one only for verified pages
	  console.log("Page Name: "+pageName);
	}
}

if(isGroup){	//testing adding element to group name
	document.getElementsByTagName('h2')[0].innerHTML = document.getElementsByTagName('h2')[0].innerHTML + '<a class="_5r2h" href="/groups/208051486009709/" dir="">Element Add Test</a>';
	console.log('is a group');
}else{
	console.log('not a group');
}

if(isProfile){
	document.getElementById('fb-timeline-cover-name').innerHTML = 
		document.getElementById('fb-timeline-cover-name').innerHTML +
		'<span class="_5rqt"><span class="_5rqu"><span data-hover="tooltip" data-tooltip-position="right" class="_56_f _5dzy _5d-1 _5d-3" id="u_jsonp_2_7" aria-label="Verified Page"></span></span></span>'
}