// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnTVyPLECD5tvGBTLadH49ce4_8W4EaxY",
    authDomain: "ip2-2-birdseyeview.firebaseapp.com",
    databaseURL: "https://ip2-2-birdseyeview-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ip2-2-birdseyeview",
    storageBucket: "ip2-2-birdseyeview.appspot.com",
    messagingSenderId: "762366039906",
    appId: "1:762366039906:web:c968c4bb429c6053263e3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {
  getDatabase, ref, child, get, update
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

import {
  getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import {
  getStorage, listAll, getDownloadURL, ref as sRef
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

// check page loaded
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);

// get firebase data 
const db = getDatabase();

const playerRef = ref(db, "PlayerInfo");

const playerStats = ref(db, "PlayerStats");

const storage = getStorage(app);

const listRef = sRef(storage, "/");

var currentUserID = "";

//getting player statistics
function getPlayerStats() {  
  get(playerStats).then((snapshot) => {
    if (snapshot.exists()) {
      try {
        var content = "";
        snapshot.forEach((childSnapshot) => {         
          
          //get current user id and display the relevant info
          if(childSnapshot.key == auth.currentUser.uid)
          {
            // display number of wins
            var totalPoints = document.getElementById("totalPoints");
            totalPoints.innerHTML = childSnapshot.val().totalPoints;
            
            var updatedOnFB = childSnapshot.val().updatedOn;
            var convertedUpdatedOn = convertTimeStampFormat(updatedOnFB); //converted time stamp

            var updatedOn = document.getElementById("updatedOn"); // updated on
            updatedOn.innerHTML = convertedUpdatedOn;
            
            var fastestTimeToCompleteAll = document.getElementById("fastestTime"); // fastest time
            var fastestTime = childSnapshot.val().fastestTimeToCompleteAll;

            var convertFloatToTime = NumToTime(fastestTime);
            fastestTimeToCompleteAll.innerHTML = convertFloatToTime;

            var currentPoints = document.getElementById("pointsLeftToReachReward"); // points left to rch
            var pointsLeft = childSnapshot.val().totalPoints;
            currentPoints.innerHTML = pointsLeft;

            var pointsLeftt = document.getElementById("pointsLeft");
            pointsLeftt.innerHTML = childSnapshot.val().pointsLeftToReachReward;

            if(childSnapshot.val().pointsLeftToReachReward == '0')
            {
              var congratsMsgg = document.getElementById("congratsMsg");
              congratsMsgg.innerHTML = "Congrats!";
              alert("Congratulations for earning 500 points! \n \nYou will receive an email with the reward details in the upcoming days. \n \nLooking forward to creating more memories with you!");
            }

            var calculateToPercent = (childSnapshot.val().totalPoints / 500) * 100;
            var slider = document.getElementById("myRange").value = calculateToPercent;

            var incorrectAns = document.getElementById("incorrectAns"); // incorrect answer
            incorrectAns.innerHTML = childSnapshot.val().numberOfIncorrectAnswers;
          };
        });

      } catch (error) {
        console.log("Error getPlayerData" + error);
      }
    }
  })
}

function NumToTime(totalSeconds)  // convert float from C# to time stamp in Javascript
{
  totalSeconds = Number(totalSeconds);

  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor(totalSeconds % 3600 / 60);
  var seconds = Math.floor(totalSeconds % 3600 % 60);

  var hDisplay = hours > 0 ? hours + (hours == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = minutes > 0 ? minutes + (minutes == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = seconds > 0 ? seconds + (seconds == 1 ? " second" : " seconds") : "";

  return hDisplay + mDisplay + sDisplay;  
}

//getting player profile info
function getPlayerData() {
  
  get(playerRef).then((snapshot) => {
    if (snapshot.exists()) {
      try {
        var content = "";
        snapshot.forEach((childSnapshot) => {         
          //console.log("GetPlayerData: childKey " + childSnapshot.key);
          //console.log(auth.currentUser.uid);
          if(childSnapshot.key == auth.currentUser.uid)
          {
            currentUserID = childSnapshot.key;

            currentEmail = childSnapshot.val().email;

            var currentUsername = document.getElementById("currentUsername"); //get username
            currentUsername.innerHTML = childSnapshot.val().username;

            var currentEmail = document.getElementById("currentEmail"); // get email
            currentEmail.innerHTML = childSnapshot.val().email;

            var currentActive = document.getElementById("currentActive"); // get playerActive

            if(childSnapshot.val().isActive == true)
            {
              currentActive.innerHTML = "Active";
            }
            
            if(childSnapshot.val().isActive == false)
            {
              currentActive.innerHTML = "Inactive";
            }

            // covert Firebase Timestamp to date             
            var createdOnFB = childSnapshot.val().createdOn;
            var convertedCreatedOn = convertTimeStampFormat(createdOnFB); //converted time stamp

            var createdOn = document.getElementById("createdOn"); // created on
            createdOn.innerHTML = convertedCreatedOn;
          };
        });

      } catch (error) {
        console.log("Error getPlayerData" + error);
      }
    }
  })
}

const auth = getAuth();
//retrieve element from form
var frmCreateUser = document.getElementById("frmCreateUser");

//we create a button listener to listen when someone clicks
  frmCreateUser.addEventListener("submit", function(e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    signInUser(email, password);
    console.log("email" + email + "password" + password);

    


  });

//check which page user lands
if(sPage == "index.html")
{
  //we create a button listener to listen when someone clicks
    /*
  frmCreateUser.addEventListener("submit", function(e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    signInUser(email, password);
    console.log("email" + email + "password" + password);

    


  });
  */
}else if(sPage == "profile.html")
{
    var profilesArray=[]
    profilesArray.push("img/bird Avatar.jpg");
    profilesArray.push("img/parrotAvatar.jpg");
    profilesArray.push("img/penguinAvatar.jpg");
    profilesArray.push("img/toucanAvatar.jpg");
    //randomising user profile image
    var userAvatarImg = document.getElementById("userImg");
    var ranNum = Math.floor(Math.random() * profilesArray.length) + 1;
    console.log(ranNum);
    userAvatarImg.src = profilesArray[ranNum-1];


  // slider 
  var sliderFixed = document.getElementById("myRange").disabled = true;

  getPlayerData();
  getPlayerStats(); 
  toggleInput();
  toggleEditEmail();

}else if(sPage == "myphotos.html")
{
  /* -start- get images */
  listAll(listRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      console.log(`Folder name: ${folderRef._location.path_}`);
      listFilesInFolder(folderRef)
    });
    }).catch((error) => {
    console.log(error);
  })

  let num = 1;
  function listFilesInFolder(listRef)
  {  
    listAll(listRef)
      .then((res)=>{
        res.items.forEach((itemRef) => {  

          getDownloadURL(itemRef).then((url) =>{

            var photo = `photo${num}`;
            var photoContainer = document.getElementById(photo);
            photoContainer.src = url;     
            var numPhotos = document.getElementById("numPhotos");
            numPhotos.innerHTML = num;    
            num ++;
          })       
        });
      });   
  }
  /* -end- get images */
  storeImgToSend();
 
function storeImgToSend(selectedId)
{
  const mediaArray = [];
 
  var selectedImgNum = 0;
  document.querySelectorAll('img').forEach(occurence => {
    occurence.addEventListener('click', (e) => {
      console.log('An image was clicked');
     
        let selectedId = e.target.id;
        var curElement = document.getElementById(selectedId);
        if (curElement.style.opacity == "0.5") {
          var x = 0;
          while(x< mediaArray.length)
          {
            let removedImage = document.getElementById(selectedId);
            let removedImageURL = removedImage.src;
            if(removedImageURL == mediaArray[x]){
              delete mediaArray[x];
              
              console.log("deleted");
              selectedImgNum--;
            }
            x++;
          }
          curElement.style.opacity = 1;
          

        } else {
          if(selectedImgNum < 4)
          {
            curElement.style.opacity = 0.5;
            console.log(selectedId);
            let image = document.getElementById(selectedId);
            let imageURL = image.src;
            mediaArray.push(imageURL);
            console.log(mediaArray);
            selectedImgNum++;
          }
         
        }
    });
  });
  
    var i =0;

    var WAShareBtn = document.getElementById("WABtn");
  
    WAShareBtn.addEventListener("click", function(){

    console.log(mediaArray);
    let text = document.getElementById("captionImg").value;
   
    var sendLink = "whatsapp://send?text="+ text+ "\n" + " ";
    while(i<mediaArray.length)
    {
      if(mediaArray[i] != "" && mediaArray[i] != null)
      {
        sendLink += " " + encodeURIComponent(mediaArray[i])
        
      }     
      
      i++;
    }
    // let sharehref = `whatsapp://send?text=${encodeURIComponent(imageSrc)}`;

    if(selectedImgNum != 0 )
    {
      window.open
      (sendLink)
    }
    else
    {
      showValidation();
    }
  })


    var emailShareBtn = document.getElementById("emailBtn");
    
    emailShareBtn.addEventListener("click", function(event){

    console.log(mediaArray);
    let text = document.getElementById("captionImg").value;
  
    var sendLink = "mailto:?subject=Pictures from Birds Eye View with Jurong Bird Park&body=" + text;
    while(i<mediaArray.length)
    {
      if(mediaArray[i] != "" && mediaArray[i] != null)
      {
        sendLink += " " + encodeURIComponent(mediaArray[i])
        
      }     
      
      i++;
    }
    

    if(selectedImgNum != 0 )
    {
      console.log("sendEmail");
      emailShareBtn.href = sendLink;
      
    }
    else
    {
      event.preventDefault();
      showValidation();
    }
  })
  }
}

function showValidation()
{
  var errorMsg = document.getElementById("errorEmpty");
  errorMsg.innerHTML = "Please select an image to share.";
  $('#errorEmpty').fadeIn();
  setTimeout(function(){$('#errorEmpty').fadeOut();}, 5000);
}

// log out function
function logOut()
{
  signOut(auth).then(() => 
  {
    console.log("Log out successful");

  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`);
  })
}

// log in authentication
function signInUser(email, password) {

  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    //signedin
    const user = userCredential.user;

    console.log("finding user ... " + JSON.stringify(userCredential));
    console.log("User is now logged in ");    
    
    window.location.href = "profile.html";  

  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    var errorMsgContent = document.getElementById("errorContentMsg");
    errorMsgContent.innerHTML = "Invalid Email/Password/Username. Please try again.";
    errorMsgContent.style.color = "red";
    var validationMsgContent = document.getElementById("validationMsg");
    validationMsgContent.innerHTML = "";
    console.log(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`);
  });

}

// convert Firebase time stamp to current date/year
function convertTimeStampFormat(timestamp)
{
  const date = new Date(timestamp*1000);
  var s = date.toLocaleDateString("en-SG");

  return s;
}

//only recall forget password function in login page
if(sPage == "index.html")
{
  const forgetPs = document.getElementById("forgotPwd");
  
  forgetPs.addEventListener("click", function(){
    
    var userEmail = document.getElementById("email").value;
    if(userEmail != null || userEmail != "")
    {
        sendPasswordResetEmail(auth, userEmail)
      .then(() => {
        var errorMsgContent = document.getElementById("errorContentMsg");
        errorMsgContent.innerHTML = "Reset email has been send!";
        errorMsgContent.style.color = "green";

        var validationMsgContent = document.getElementById("validationMsg");
        validationMsgContent.innerHTML = "";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        var validationMsgContent = document.getElementById("validationMsg");
        validationMsgContent.innerHTML = "Please enter a valid email address.";
        
      });
  
    } else 
    {
      var validationMsgContent = document.getElementById("validationMsg");
      validationMsgContent.innerHTML = "Please enter a valid email address.";
    }
  })
}

// toggle username edit field
function toggleInput()
{
  const editBtnUserName = document.getElementById("editBtnName");

  editBtnUserName.addEventListener("click", function(){
    
    var inputNewName = document.getElementById("inputNewUsername");

    var inputNameField = document.getElementById("newInputName");
    inputNameField.value = "";

    var errorMsg = document.getElementById("errorName");
    errorMsg.innerHTML = "";
    
    if(inputNewName.style.display === "none")
    {
      inputNewName.style.display = "block";
      updateUsername();
    }
    else
    {
      inputNewName.style.display = "none";
    }

  })
}

// toggle email edit field
function toggleEditEmail()
{
  const editBtnEmail = document.getElementById("editBtnEmail");

  editBtnEmail.addEventListener("click", function(){
    
    var inputNewEmail = document.getElementById("inputNewEmail");

    var inputEmailField = document.getElementById("newInputEmail");
    inputEmailField.value = "";

    var errorMsg = document.getElementById("errorEmail");
    errorMsg.innerHTML = "";
    
    if(inputNewEmail.style.display === "none")
    {
      inputNewEmail.style.display = "block";
      updateNewEmail();
    }
    else
    {
      inputNewEmail.style.display = "none";
    }

  })
}

// update username upon submission
function updateUsername()
{
  var submitNewUsernameBtn = document.getElementById('submitNewName');

  submitNewUsernameBtn.addEventListener('click', function(){

    const newInputName = document.getElementById('newInputName').value;
    
    if(newInputName !== "")
    {
      if(newInputName.length >= 3)
      {
        writeUserName(newInputName);
        
        var errorMsg = document.getElementById("errorName");
        errorMsg.innerHTML = "";

        var successMsg = document.getElementById('successConfirmation');
        $('#successConfirmation').fadeIn();
        successMsg.innerHTML = 'Updated Successfully!';
        setTimeout(function(){$('#successConfirmation').fadeOut();}, 5000);

        var newName = document.getElementById('currentUsername');
        newName.innerHTML = newInputName;

        document.getElementById("inputNewUsername").style.display = "none";

      }
      else
      {
        var errorMsg = document.getElementById("errorName");
        errorMsg.innerHTML = "Minimum Length is 3 Characters. Please Try Again.";
      }
    }
    else
    {
      var errorMsg = document.getElementById("errorName");
      errorMsg.innerHTML = "Please Input Your New Username.";
    }

  }) 
}

// update email upon submission
function updateNewEmail()
{
  var submitNewEmailBtn = document.getElementById('submitNewEmail');

  submitNewEmailBtn.addEventListener('click', function(){

    const newInputEmaill = document.getElementById('newInputEmail').value;

    if(newInputEmaill !== "")
    {
      ValidateEmail(newInputEmaill);
    }
    else
    {
      var errorMsg = document.getElementById("errorEmail");
      errorMsg.innerHTML = "Please Input Your New Email.";
    }

  })
}

// validate the new email input
function ValidateEmail(inputEmail)
{
  var mailformat = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if(inputEmail.match(mailformat))
  {
    writeUserEmail(inputEmail);

    var errorMsg = document.getElementById("errorEmail");
    errorMsg.innerHTML = "";

    var successMsg = document.getElementById('successConfirmationEmail');
    $('#successConfirmationEmail').fadeIn();
    successMsg.innerHTML = 'Updated Successfully!';
    setTimeout(function(){$('#successConfirmationEmail').fadeOut();}, 5000);

    var newEmail = document.getElementById('currentEmail');
    newEmail.innerHTML = inputEmail;

    document.getElementById("inputNewEmail").style.display = "none";

  }
  else
  {
    var errorMsg = document.getElementById("errorEmail");
    errorMsg.innerHTML = "You Have Entered an Invalid Email. Please Try Again.";
  }
}

/* to update username to firebase */
function writeUserName(newUserName) {

  update(ref(db, 'PlayerInfo/' + currentUserID), {
    username: newUserName,
  });  
}

/* to update email to firebase */
function writeUserEmail(newEmail) {

  update(ref(db, 'PlayerInfo/' + currentUserID), {
    email: newEmail,
  });    

  updateEmail(auth.currentUser, newEmail).then(() => {

    console.log("Success! Updated Email at Auth Firebase");
    // Success: update email at auth firebase

  }).catch((error) => {
    console.log(error.message);
  })
}




