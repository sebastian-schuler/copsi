// Electron
const electron = require('electron');
const {ipcRenderer,shell,Menu} = electron;

// Server Display Elemente
const divServerUserList = document.getElementById('divServerUserList');
const navServerChannelList = document.getElementById('channelList');
const ulServerListLeft = document.getElementById('serverListeLinks');

// Variablen
let currentSelectedServer = '';
let serverDataObject;

// IPC 


ipcRenderer.on('server:connected',function(e){

  console.log('connected');

});

ipcRenderer.on('user:personal-user-info',function(e,serverData){

  currentSelectedServer = serverData[0].id;
  serverDataObject = serverData;

  setServerList(serverData);

  serverChanged(currentSelectedServer);

});

/*
//////////////////////////// Interface Creation Functions ////////////////////////////////////////
*/

function clearServerInterface(){
  navServerChannelList.innerHTML = '';
  divServerUserList.innerHTML = '';
}

function setServerList(serverData){

  for(var i=0;i<serverData.length;i++){

    var aServerShort = document.createElement('a');
    aServerShort.classList.add('sm-server-shortname');
    aServerShort.innerText = serverData[i].shortName;
    var test = serverData[i].id;
    aServerShort.onclick = function() {serverChanged(test);};
    //console.log(serverData[i].id);
    //aServerShort.addEventListener("click", function() {
     // serverChanged(serverData[i].id)
  //}, false);
   
    var div = document.createElement('div');
    div.classList.add('sm-server-shortname-container');
    div.appendChild(aServerShort);

    var spanServerShort = document.createElement('span');
    spanServerShort.classList.add('icon');
    spanServerShort.classList.add('is-medium');
    spanServerShort.appendChild(div);

    var liServerShort = document.createElement('li');
    liServerShort.appendChild(spanServerShort);

    var divServerShort = document.createElement('div');
    divServerShort.classList.add('sm-team-icons');

    if(serverData[i].id == currentSelectedServer){
      divServerShort.classList.add('sm-activated');
    }
    divServerShort.appendChild(liServerShort);
    ulServerListLeft.appendChild(divServerShort);
  }
}

// Ändere den Server Titel oben links über der Channelübersicht
function setServerTitle(title){
  document.getElementById('hServerTitle').innerText = title;
}

// 
function setServerChannels(channels){

  // Für jeden Channel
  for(var i=0;i<channels.length;i++){
    
    // Wenn der Channel eine Kategorie ist
    if(channels[i].isCategory){

      var pCategoryName = document.createElement('p');
      pCategoryName.classList.add('menu-label');
      pCategoryName.innerText = channels[i].name;
      navServerChannelList.appendChild(pCategoryName);

      if(channels[i].childChannels != null && channels[i].childChannels.length != 0){

        // Unter Channel für Kategorie
        var tmpChildChannels = channels[i].childChannels;
        var ulChildChannels = document.createElement('ul');
        ulChildChannels.classList.add('menu-list');
        for(var j=0;j<tmpChildChannels.length;j++){

          // Icon
          var iChildChannelIcon = document.createElement('i');
          iChildChannelIcon.classList.add('fas');
          // Icon Code vom Channel Objekt
          iChildChannelIcon.classList.add(tmpChildChannels[j].picture);

          // Span
          var spanChildChannel = document.createElement('span');
          spanChildChannel.classList.add('is-small');
          spanChildChannel.classList.add('icon');
          spanChildChannel.appendChild(iChildChannelIcon);

          // Tmp Div Container
          var tmpDiv = document.createElement('div');
          tmpDiv.appendChild(spanChildChannel);

          // Link
          var aChildChannelLink = document.createElement('a');
          aChildChannelLink.href = '#';
          aChildChannelLink.innerHTML = tmpDiv.innerHTML + ' ' + tmpChildChannels[j].name;

          // List Element
          var liChildChannel = document.createElement('li');
          liChildChannel.appendChild(aChildChannelLink);

          // An Liste anhängen
          ulChildChannels.appendChild(liChildChannel);
        }
      

      // An Kategorie anhängen
      navServerChannelList.appendChild(ulChildChannels);
    }

      // Wenn der Channel ein einfacher Channel ist
    }else{

      // TODO kp vielleicht kommt hier was hin. channel außerhalb einer kategorie

    }

  }

}

// 
function setServerUserList(currentServerData){

  // Für Jede Rolle ein Abteil
  for(var i=0;i<currentServerData.roles.length;i++){

    // P Element mit Rollen Name
    var txtRoleLabel = document.createElement('p');
    // Set ID
    txtRoleLabel.classList.add('menu-label');
    txtRoleLabel.innerText = currentServerData.roles[i].name;
    txtRoleLabel.id = 'ServerRoleListP_'+currentServerData.roles[i].id;
    divServerUserList.appendChild(txtRoleLabel);

    // Liste der User mit der aktuellen Rolle
    var ulUsersOfRole = document.createElement('ul');
    ulUsersOfRole.classList.add('menu-list');
    ulUsersOfRole.id = 'ServerRoleListUl_'+currentServerData.roles[i].id;

    divServerUserList.appendChild(ulUsersOfRole);
  }

   // Für jeden User
   for(var j=0;j<currentServerData.users.length;j++){

    // Icon
    var iUserIcon = document.createElement('i');
    iUserIcon.classList.add('fas');
    iUserIcon.classList.add('fa-fish');

    // Icon Container
    var spanUserLabelIcon = document.createElement('span');
    spanUserLabelIcon.classList.add('icon');
    spanUserLabelIcon.classList.add('is-small');
    spanUserLabelIcon.appendChild(iUserIcon);
    
    // tmp div um inner Html zu bekommen
    var tmpDivIcon = document.createElement('div');
    tmpDivIcon.appendChild(spanUserLabelIcon);

    // Text und Link
    var aUserLink = document.createElement('a');
    // TODO Verlinkung lol
    aUserLink.href = '/bulma-admin-dashboard-template/forms.html';
    aUserLink.innerHTML = tmpDivIcon.innerHTML+' '+currentServerData.users[j].nickname;
    //aUserLink.innerText = currentServerData.users[j].nickname;
    //aUserLink.appendChild(spanUserLabelIcon);

    // Listen Element
    var liUser = document.createElement('li');
    liUser.appendChild(aUserLink);
    document.getElementById('ServerRoleListUl_'+currentServerData.users[j].role).appendChild(liUser);
  }
}

function createMessage(msg, user){

    var divBox = document.createElement('div');
    divBox.classList.add('box');

    var article = document.createElement('article');
    article.classList.add('media');

    divBox.appendChild(article);

    var divImage = document.createElement('div');
    divImage.classList.add('media-left');

    var figure = document.createElement('figure');
    figure.classList.add('image');
    figure.classList.add('is-64x64');
    divImage.appendChild(figure);

    var image = document.createElement('img');
    image.src=user.profilePicture;
    divImage.appendChild(image);
}

/*
//////////////////////////// User Interaction Functions ////////////////////////////////////////
*/

function serverChanged(selectedServer){

  clearServerInterface();
  // TODO hin und her klicken geht nicht lol
  
  console.log("hmm");
  console.log(selectedServer);

  // Gehe durch Server Liste um aktuell selektierten zu finden
  for(var i=0;i<serverDataObject.length;i++){
    if(serverDataObject[i].id === selectedServer){
      setServerTitle(serverDataObject[i].shortName);
      setServerChannels(serverDataObject[i].channels);
      setServerUserList(serverDataObject[i]);
    }
  }
}