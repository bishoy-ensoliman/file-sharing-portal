var MAXFILESIZE = 50*1024*1024;

function printuploadData(){
	printCoursesByInst(sessionStorage.getItem('ID'));
	document.getElementById("filesCount").innerHTML ="";
	document.getElementById("progBarContainer").style.display = "none";
}

function printCoursesByInst(instId){
	firebase.database().ref('/Course/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var found = false;
	  		var inData = 'Choose Course: <select id="selectCourse">';
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().instId == instId){
						found = true;
						inData +='<option value="'+snapshot.child(''+i).val().id+'" >'+snapshot.child(''+i).val().name+'</option>';
					}
				}
			}	
			inData += "</select>";
			document.getElementById("courses").innerHTML = inData;	
			if(found){
				document.getElementById("insertContainer").style.display = "block";
				document.getElementById("uploadButton").disabled = false;
			}
			else{
				alert("No courses are registered with you!");
			}
			document.getElementById("loader-wrapper").style.display = "none";
	  	}
	});
}

var totalNumFiles=0;
var goodFiles=0;

function upload(){
	var selectCourse = document.getElementById("selectCourse");
    var selectedCourse = selectCourse.options[selectCourse.selectedIndex].value;
    var selectCategory = document.getElementById("selectCategory");
    var selectedCategory = selectCategory.options[selectCategory.selectedIndex].value;
	var x = document.getElementById("filestoupload");
	if ('files' in x) {
	    if (x.files.length == 0) {
	        alert("Select one or more files.");
	    } else {
	    	document.getElementById("progBarContainer").style.display = "block";
	    	totalNumFiles = x.files.length;
	    	goodFiles = 0;
	    	var j=0;
	    	var uploadfiles=[];
	        for (var i = 0; i < x.files.length; i++) {
	            var file = x.files[i];
	            if(file){
	            	if ('size' in file) {
		            	if(file.size <= MAXFILESIZE){
		            		if ('name' in file) {
				                goodFiles++;
				                uploadfiles[j] = file;
				                j++;
				            }
		            	}
		            	else{
		            		//if(totalNumFiles > 1){
		            		totalNumFiles--;
		            		//}
		            		alert(file.name + " size exceeded " + MAXFILESIZE/(1024*1024) + " MB. \nAnd wont be uploaded!");
		            		document.getElementById("filesCount").innerHTML ="";
		            	}		                
	            	}
	            }
	        }
	        category = selectedCategory;
	        courseId = selectedCourse;
        	checkFileExist(uploadfiles,selectedCourse,selectedCategory);
	    }
	}
	else{
		alert("No Selected Files!");
	}
}

var uploadTask;

function pause(){
	document.getElementById("pause").disabled = true;
	document.getElementById("resume").disabled = false;
	document.getElementById("cancel").disabled = false;
	document.getElementById("filesCount").innerHTML = "uploading paused";
	uploadTask.pause();
}

function resume(){
	document.getElementById("pause").disabled = false;
	document.getElementById("resume").disabled = true;
	document.getElementById("cancel").disabled = false;
	document.getElementById("filesCount").innerHTML = "uploading resumed...";
	uploadTask.resume();
}

function cancel(){
	document.getElementById("pause").disabled = true;
	document.getElementById("resume").disabled = true;
	document.getElementById("cancel").disabled = true;
	document.getElementById("filesCount").innerHTML = "uploading this file is cancelled!";
	document.getElementById("progBar").style.width = 0 + "%";
	document.getElementById("prog").innerHTML = 0 + "%";
	uploadTask.cancel();
}

var category;
var courseId;
var fileCounter;
var filestoUpload = [];
function checkFileExist(uploadfiles,courseId,category){
	firebase.database().ref('/File').once('value').then(function(snapshot) {
		var count = snapshot.val().Count.count;
		fileCounter = count;
		if(snapshot.val()){	
			var found = false;
			var uploadfilesLength = totalNumFiles;
			var k=0;
			for(var j=0;j<uploadfilesLength;j++){
				for (var i = 0; i < count; i++) {
					if(snapshot.child(''+i).val()){
						if(snapshot.child(''+i).val().name == uploadfiles[j].name 
							&& snapshot.child(''+i).val().courseId == courseId 
							&& snapshot.child(''+i).val().category == category){
							found = true;
							alert("File already exists!");
							if(totalNumFiles > 1){
								document.getElementById("progBarContainer").style.display = "none";
								totalNumFiles--;
							}
							else{
								document.getElementById("progBarContainer").style.display = "block";
								document.getElementById("progBar").style.width = 100 + "%";
								document.getElementById("prog").innerHTML = 100 + "%";
								document.getElementById("filesCount").innerHTML ="All Files already exist!";
							}						
							
							goodFiles--;
							break;					
						}	
					}						
				}
				if(!found){
					filestoUpload[k] = uploadfiles[j];
					k++;
				}
			}
			if(k>0){
				document.getElementById("progBarContainer").style.display = "block";
				document.getElementById("filesCount").innerHTML = "Uploading...";
				ordertoUpload(k-1);
			}
		}
	});
}

function ordertoUpload(i){
	if(i<0){
		alert("Files Uploaded Successfully");
		return;
	}
	uploadFile(filestoUpload[i]).then(function(metadatas) {
	  	ordertoUpload(i-1);
	}).catch(function(error) {
	  // If any task fails, handle this
	  alert(error);
	});
}

var counter =0;
var progress = 0;

function uploadFile(file){
	var count = fileCounter;
	var path = count+"/"+file.name;
	uploadTask = firebase.storage().ref(path).put(file);
	document.getElementById("pause").disabled = false;
	document.getElementById("resume").disabled = false;
	document.getElementById("cancel").disabled = false;
	// Listen for state changes, errors, and completion of the upload.
	var unsubscribe = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
	  function(snapshot) {
	    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	    //var progress = Math.round((((snapshot.bytesTransferred/snapshot.totalBytes) * ((1)/totalNumFiles)) * 100 )+((goodFiles-1)*100/totalNumFiles));
	    progress += ((snapshot.bytesTransferred/snapshot.totalBytes)/totalNumFiles)*100;
	    document.getElementById("progBar").style.width = Math.round(progress) + "%";
	    document.getElementById("prog").innerHTML = Math.round(progress) + "%";
	    switch (snapshot.state) {
		    case firebase.storage.TaskState.PAUSED: // or 'paused'
		      console.log('Upload is paused');
		      break;
		    case firebase.storage.TaskState.RUNNING: // or 'running'
			    document.getElementById("filesCount").innerHTML ="Uploading... "+file.name;
			    document.getElementById("pause").disabled = false;
				document.getElementById("resume").disabled = true;
				document.getElementById("cancel").disabled = false;
		      break;
		}		    
	  }, function(error) {
	  	alert(error);
	}, function() {
		var downloadURL = uploadTask.snapshot.downloadURL;
		//console.log(parseInt(courseId)+1000009);
		addFile(count,file.name,path,parseInt(courseId),category,downloadURL);
		firebase.database().ref('/File/Count/').set({
			count:count+1
		});
		firebase.database().ref('/Notification/Count/').set({
			count:count+1
		});
		fileCounter++;
		counter++;
		if(counter == totalNumFiles){
			document.getElementById("pause").disabled = true;
			document.getElementById("resume").disabled = true;
			document.getElementById("cancel").disabled = true;
			document.getElementById("filesCount").innerHTML = "Successfully uploaded All " + (counter) + " files from "+ totalNumFiles + " files. Done.";
			counter = 0;
			progress = 0;
		}
		else{
			document.getElementById("filesCount").innerHTML = "Successfully uploaded " + (counter) + " files from "+ totalNumFiles +" files. Uploading...";
		}
		unsubscribe();
		//uploadTask.off();
	});	
	return uploadTask.then(true, false);
}

function addFile(id,name,path,courseId,category,downloadURL){
	firebase.database().ref("/File/"+id).set({
		id:id,
	    name:name,
	    path:path,
	    courseId:courseId,
	    category:category,
	    downloadURL:downloadURL
	});
	firebase.database().ref("/Notification/"+id).set({
		id:id,
	    filename:name,
	    courseId:courseId,
	    category:category,
	    downloadURL:downloadURL
	});
	addNotificationToStudents(id,courseId);
}

function addNotifs(notifId,unreadnotificationsid,i){
	if(unreadnotificationsid == '-'){
		firebase.database().ref('/Student/'+i).update({
			"unreadnotificationsid" : notifId+""
		});
	}
	else{
		var notifs = "" + unreadnotificationsid + "," + notifId;
		firebase.database().ref('/Student/'+i).update({
			"unreadnotificationsid" : notifs
		});
	}
}

function addNotificationToStudents(notifId,courseId){
	firebase.database().ref('/Student/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					var special = snapshot.child(''+i).val().specialcoursesid.split(",");
					for(var j=0;j<special.length;j++){
						if(special[j] == courseId){
							addNotifs(notifId,snapshot.child(''+i).val().unreadnotificationsid,i);
							break;
						}
					}
					getStudentCourses(courseId,snapshot.child(''+i).val().dept,snapshot.child(''+i).val().sem,notifId,snapshot.child(''+i).val().unreadnotificationsid,i);
				}			
			}				
	  	}
	});
}

function getStudentCourses(courseId,dept,sem,notifId,unreadnotificationsid,i){
	firebase.database().ref('/Course/'+courseId).once('value').then(function(snapshot) {
	  	if(snapshot.val()){	
			if(snapshot.val().dept == dept && snapshot.val().sem == sem){
				addNotifs(notifId,unreadnotificationsid,i);
			}				
	  	}
	});
}