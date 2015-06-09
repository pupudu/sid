$(function(){

  var $list =  $('#list');
  // $list.html("Loading ......");
  var my_id = $('#friends').attr('data-id');

  console.log('ID: '+my_id);

  var temp = {
    id: my_id
  };

  console.log('temp: '+temp);

  $.ajax ({
    type: 'GET',
    url: '/facebook/friends',
    data: temp,
    success: function(friends){
      $list.html("");
      console.log('success', friends);
      $.each(friends, function(i, friend){
        console.log('Friend: ', friend);
        $list.append("<li><img src=https://graph.facebook.com/v2.3/"+friend.id+"/picture>"+friend.name+"</li>");

        // $bearsList.append(Mustache.render(orderTemplate, bear));
      });
    },
    error: function(){
      $list.html("Error Occured");
      alert('Error loading data');
    }
  });

});
