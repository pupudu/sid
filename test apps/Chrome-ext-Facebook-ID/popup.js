document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
 
    chrome.tabs.getSelected(null, function(tab) {
      d = document;
 
      var f = d.createElement('form');
      f.action = 'https://gtmetrix.com/analyze.html?bm';
      f.method = 'post';
	  
      var i = d.createElement('input');
      i.type = 'hidden';
      i.name = 'url';
      i.value = tab.url;
	  if(i.value.includes("facebook")){
		
		var x='document.body.style.backgroundColor="red";document.getElementsByClassName("_2dpb")[0].innerHTML;';
		/*chrome.tabs.duplicate(tab.id);*/
		chrome.tabs.executeScript(tab.id,{
			code:x;
		  },function(d){
			alert(d);
		  });
		  /*chrome.tabs.executeScript(tab.id,function(){
			 document.body.style.backgroundColor="red"
		  });*/
	  }else{
		alert("Incorrect Page");
	  }
	  
	  /*chrome.permissions.request({
          permissions: ['webRequest']
        }, function(granted) {
          // The callback argument will be true if the user granted the permissions.
          if (granted) {
            alert("granted");
          } else {
            alert("deined");
          }
        });*/
	  
	  
	  /*
      f.appendChild(i);
      d.body.appendChild(f);
      f.submit();*/
    });
	
	
  }, false);
  /*chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red";alert("dodan");'
  });
});*/
}, false);
