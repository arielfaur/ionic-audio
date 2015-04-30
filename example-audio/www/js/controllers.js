angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MusicCtrl', function($scope) {
  $scope.track = {
      url: 'https://s3.amazonaws.com/ionic-audio/Message+in+a+bottle.mp3',
      artist: 'The Police',
      title: 'Message in a bottle',
      art: 'img/The_Police_Greatest_Hits.jpg'
  };
});
