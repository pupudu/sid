var myUsername = document.getElementsByClassName("_2dpe _1ayn")[0].href;

console.log('My Username: ' + myUsername);

var isPage = document.getElementsByClassName("_58gj fsxxl fwn fcw").length > 0;

console.log("Is a page: "+isPage);

if(!isPage){
  var name = document.getElementById('fb-timeline-cover-name').innerText;
  console.log("Name: "+name);
}else{
  var pageName = document.getElementsByClassName('_58gi _5rqs')[0].innerText;
  console.log("Page Name: "+pageName);
}
