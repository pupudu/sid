var myUsername = document.getElementsByClassName("_2dpe _1ayn")[0].href;

console.log('My Username: ' + myUsername);

var isPage = document.getElementsByClassName("_58gj fsxxl fwn fcw").length > 0;
var isGroup = (document.getElementsByClassName('_55pe')[0].innerText =="Joined");

console.log("Is a page: "+isPage);
if(!isGroup){
if(!isPage){
  var name = document.getElementById('fb-timeline-cover-name').innerText;
  console.log("Name: "+name);
}else{
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
