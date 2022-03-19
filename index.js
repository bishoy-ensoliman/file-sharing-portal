// Initialize Firebase
var config = {
	apiKey: "AIzaSyAv_libssMPKv4KY6X-DV88VO3BUlNNqEw",
	authDomain: "filesharing-d9bff.firebaseapp.com",
	databaseURL: "https://filesharing-d9bff.firebaseio.com",
	storageBucket: "filesharing-d9bff.appspot.com",
	messagingSenderId: "680015692690"
};
firebase.initializeApp(config);

function logout(myip){
	document.getElementById("login").style.display = "none";
	document.getElementById("loader-wrapper").style.display = "block";
	return firebase.database().ref('/Auth/').once('value').then(function(snapshot) {
		  var count = snapshot.val().Count.count;		  
		  if(snapshot.val()){	
				for (var i = 0; i < count; i++) {
					if(snapshot.child(''+i).val()){
						console.log(snapshot.child(''+i).val().ip);
						console.log(myip);
						if(snapshot.child(''+i).val().ip == myip){
							firebase.database().ref('/Auth/'+i).remove();
							sessionStorage.removeItem('ID');							
							document.getElementById("loader-wrapper").style.display = "none";
							document.getElementById("login").style.display = "block";
						}	
					}						
				}
		  	}
		});
}

function login(email,password,ip,serverip){
	document.getElementById("login").style.display = "none";
	document.getElementById("loader-wrapper").style.display = "block";
	return isAdmin(email,password,ip,serverip);
}

function validateLogin(ip,serverip){
	var email = document.getElementById("email").value;
	if(validemail(email)){
		var password = document.getElementById("password").value;
		if(password.length >= 6){
			login(email,password,ip,serverip);
		}
		else{
			alert("Password must be more than 5 characters!");
		}				
	}
	else{
		alert("Invalid Email!");
	}
}

function validateLogintest(email,password,ip,serverip){
	if(validemail(email)){
		if(password.length >= 6){
			return login(email,password,ip,serverip);
		}
		else{
			return false;
		}				
	}
	else{
		return false;
	}
}

function updateStatus(){
	var origin = document.location.origin;
	var relurl = document.location.href.replace(origin,'');
	if(sessionStorage.getItem('ID') != null){
		if(sessionStorage.getItem('ID') == -1 && (relurl == '/SEproject/' || relurl == '/SEproject/index.php' || relurl == '/SEproject/instructor_show_files.html' || relurl == '/SEproject/instructor_upload_file.html')){
			document.location.href = 'admin.html';
		}
		else if(sessionStorage.getItem('ID') >= 0 && (relurl == '/SEproject/' 
			|| relurl == '/SEproject/index.php' || relurl == '/SEproject/admin.html' 
			|| relurl == '/SEproject/admin_access_course.html' 
			|| relurl == '/SEproject/admin_access_file.html' 
			|| relurl == '/SEproject/admin_access_inst.html' 
			|| relurl == '/SEproject/admin_access_notification.html' 
			|| relurl == '/SEproject/admin_access_student.html' 
			|| relurl == '/SEproject/admin_delete.html' 
			|| relurl == '/SEproject/admin_insert.html' || relurl == '/SEproject/admin_update.html')){
			document.location.href = 'instructor_show_files.html';
		}
	}
	else if(relurl != '/SEproject/' && relurl != '/SEproject/index.php' && relurl != '/SEproject/test.php'){
		alert("You are not allowed to enter !!!");
		document.location.href = 'index.php';
	}
}

updateStatus();

function checkAuthdata(email,pass,ip,serverip,usertype,webpage){
	return firebase.database().ref('/Auth/').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){	
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().ip == ip){						
						//if(document.location.href == 'http://'+snapshot.child(''+i).val().server+'/SEproject/index.php' || document.location.href == 'http://'+snapshot.child(''+i).val().server+'/SEproject/authentication.php' || document.location.href == 'http://'+snapshot.child(''+i).val().server+'/SEproject/'){
						if(document.location.href != 'http://'+snapshot.child(''+i).val().server+'/SEproject/test.php')
							document.location.href = webpage;
						//}
						return;
					}	
				}						
			}
			writeAuthData(email,pass,ip,serverip,usertype,webpage,count);
	  	}	  	
	});
}

function writeAuthData(email,pass,ip,serverip,usertype,webpage,count){
	firebase.database().ref('/Auth/'+count).set({
		ip:ip,
	    email:email,
	    type:usertype,
	    server:serverip
	});
	firebase.database().ref('/Auth/').once('value').then(function(snapshot) {
		var count = snapshot.val().Count.count;
		if(count){
			firebase.database().ref('/Auth/Count/').set({
				count:count+1
			});
		}
		else{
			firebase.database().ref('/Auth/Count/').set({
				count:1
			});
		}
		//if(document.location.href == 'http://'+serverip+'/SEproject/index.php' || document.location.href == 'http://'+serverip+'/SEproject/authentication.php' || document.location.href == 'http://'+serverip+'/SEproject/'){
		if(document.location.href != 'http://'+serverip+'/SEproject/test.php')
			document.location.href = webpage;
		//}
	});
}

function isAdmin(email,pass,ip,serverip){
	return firebase.database().ref('/Admin/').once('value').then(function(snapshot) {
		var userData = snapshot.val();
	    if(userData){				
			if(userData.email == email){
				if(userData.password == pass){
					var id = -1;
					sessionStorage.setItem('ID',id+'');
					console.log("going to checkAuthdata");
					checkAuthdata(email,pass,ip,serverip,'admin','admin.html');
					return true;
				}
				else{
					alert("Invalid password!");
					document.getElementById("loader-wrapper").style.display = "none";
					document.getElementById("login").style.display = "block";					
					return false;
				}				
			}
	  	}
	  	isInst(email,pass,ip,serverip);
	  	return false;
	});
}

function isInst(email,pass,ip,serverip){
	return firebase.database().ref('/Instructor').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){	
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().email == email){
						if(snapshot.child(''+i).val().password == pass){
							var id = snapshot.child(''+i).val().id;
							sessionStorage.setItem('ID',id+'');
							checkAuthdata(email,pass,ip,serverip,'inst','instructor_show_files.html');
							return true;
						}
						else{
							alert("Invalid password!");
							document.getElementById("loader-wrapper").style.display = "none";
							document.getElementById("login").style.display = "block";
							return false;
						}						
					}	
				}						
			}
			alert("Unknown User!!!");
			document.getElementById("loader-wrapper").style.display = "none";
			document.getElementById("login").style.display = "block";
			return false;
		}
	});
}

function askForInsertData(){
	var selectBox = document.getElementById("selectTable");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(selectedValue == 'Student'){
    	printStudentInsert();
    	document.getElementById("insertButton").style.display = "block";
    	return 'studentInsert';
    }
    else if(selectedValue == 'Instructor'){
    	printInstructorInsert();
    	document.getElementById("insertButton").style.display = "block";
    	return 'instInsert';
    }
    else if(selectedValue == 'Course'){
    	printCourseInsert();
    	return 'courseInsert';
    }
    else{
    	document.getElementById("insertButton").style.display = "none";
    	document.getElementById("insertData").innerHTML = '';
    	return 'pleaseSelect';
    }
    return 'invalidOption';
}

function printStudentDelete(){
	var inData = "Check the option you want to delete by: <br>";
		inData+= '<p><input type="checkbox" id="delfn" style="width:10%;clear:none;"/>Full name: <input type="text" id="fullname"></p>';//fullname,email,pass,dept,sem,specialcourses,unreadnotifications
	    inData+= '<p><input type="checkbox" id="delemail" style="width:10%;clear:none;"/>Email: <input type="email" id="email"></p>';//check if unique and is a valid mail
	    inData+= '<p><input type="checkbox" id="deldept" style="width:10%;clear:none;"/>Department: <select id="selectDept"><option value="CSE" selected>Computer & Systems</option><option value="CEE">Communication & Electronics</option><option value="EPE">Electrical Power</option><option value="ME">Mechanical</option></select></p>';
		inData+= '<p><input type="checkbox" id="delsem" style="width:10%;clear:none;"/>Semester: \
		<select id="selectSem">\
		<option value="1" selected>First Semester</option>\
		<option value="2" >Second Semester</option>\
		<option value="3" >Third Semester</option>\
		<option value="4" >Fourth Semester</option>\
		<option value="5" >Fifth Semester</option>\
		<option value="6" >Sixth Semester</option>\
		<option value="7" >Seventh Semester</option>\
		<option value="8" >Eighth Semester</option>\
		</select></p>';
		document.getElementById("insertData").innerHTML = inData;
}

function printInstructorDelete(){
	var inData = "Check the option you want to delete by: <br>";
		inData+= '<p><input type="checkbox" id="delfn" style="width:10%;clear:none;"/>Full name: <input type="text" id="fullname"></p>';//fullname,email,pass,dept,sem,specialcourses,unreadnotifications
	    inData+= '<p><input type="checkbox" id="delemail" style="width:10%;clear:none;"/>Email: <input type="email" id="email"></p>';//check if unique and is a valid mail
	    document.getElementById("insertData").innerHTML = inData;
}

function printCourseDelete(){
	var inData = "Check the option you want to delete by: <br>";
		inData+= '<p><input type="checkbox" id="delfn" style="width:10%;clear:none;"/>Course name: <input type="text" id="fullname"></p>';
	    inData+= '<p><input type="checkbox" id="deldept" style="width:10%;clear:none;"/>Department: <select id="selectDept"><option value="CSE" selected>Computer & Systems</option><option value="CEE">Communication & Electronics</option><option value="EPE">Electrical Power</option><option value="ME">Mechanical</option></select></p>';
		inData+= '<p><input type="checkbox" id="delsem" style="width:10%;clear:none;"/>Semester: \
		<select id="selectSem">\
		<option value="1" selected>First Semester</option>\
		<option value="2" >Second Semester</option>\
		<option value="3" >Third Semester</option>\
		<option value="4" >Fourth Semester</option>\
		<option value="5" >Fifth Semester</option>\
		<option value="6" >Sixth Semester</option>\
		<option value="7" >Seventh Semester</option>\
		<option value="8" >Eighth Semester</option>\
		</select>';
		inData+= '<p id="instructor"></p>';
		document.getElementById("insertData").innerHTML = inData;
		getInstDel();
}

function specificCourseDelete(){
	var delfn = document.getElementById("delfn").checked;
	var delsem = document.getElementById("delsem").checked;
	var deldept = document.getElementById("deldept").checked;
	var fullname = document.getElementById("fullname").value;
	var selectDept = document.getElementById("selectDept");
    var dept = selectDept.options[selectDept.selectedIndex].value;
    var selectSem = document.getElementById("selectSem");
    var sem = selectSem.options[selectSem.selectedIndex].value;
    if(delfn || delsem || deldept){
		delCoursebyAllAttr(delfn,delsem,deldept,fullname,dept,sem);	
    }
    else{
    	alert("Please Select an Option");
    }
}

function delCoursebyAllAttr(delfn,delsem,deldept,fullname,dept,sem){
	var ans = confirm("Delete Selected Courses and All its Files");
	if(ans){
		firebase.database().ref('/Course/').once('value').then(function(snapshot) {
		  	var count = snapshot.val().Count.count;
		  	if(snapshot.val()){
		  		var coursesId;
		  		var selectedCorses = 0;
				for (var i = 0; i < count; i++) {
					if(snapshot.child(''+i).val()){
						if(((delfn && snapshot.child(''+i).val().name == fullname)|| !delfn) 
							&& ((deldept && snapshot.child(''+i).val().dept == dept) || !deldept)
							&& ((delsem && snapshot.child(''+i).val().sem == sem) || !delsem)){
								coursesId[selectedCorses] = i;
								selectedCorses++;
								firebase.database().ref('/Course/'+i).remove();
						}
					}			
				}
				for(var i = 0; i < selectedCorses ; i++){
					deleteselectedSpecialCourse(coursesId[i]);
					delSelFilesandNotif(coursesId[i]);
				}
				alert(selectedCorses + " Courses were deleted");			
		  	}
		});
	}	
}

function deleteselectedSpecialCourse(courseId){
	firebase.database().ref('/Student/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					var special = snapshot.child(''+i).val().specialcoursesid.split(",");
					var newSpecial = "";
					for(var j=0;j<special.length;j++){
						if(special[j] != courseId && special[j] != '-'){
							newSpecial += special[j]+",";
						}
					}
					if(newSpecial.length > 0 && newSpecial[newSpecial.length-1] == ","){
						newSpecial = newSpecial.substring(0,newSpecial.length-1);
					}
					if(newSpecial.length == 0){
						newSpecial = "-";
					}
					firebase.database().ref('/Student/'+i).update({
						"specialcoursesid": newSpecial
					});
				}			
			}				
	  	}
	});
}

function delSelFilesandNotif(courseId){
	firebase.database().ref('/File/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().courseId == courseId){
						firebase.storage().ref(snapshot.child(''+i).val().path).delete().then(function() {
						  // File deleted successfully
						  firebase.database().ref('/File/'+i).remove();
						}).catch(function(error) {
						  // Uh-oh, an error occurred!
						  alert(error);
						});						
					}
				}			
			}				
	  	}
	});

	firebase.database().ref('/Notification/').once('value').then(function(snapshot) {
		var notifIds;
		var selNotifs = 0;
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().courseId == courseId){
						notifIds[selNotifs] = i;
						selNotifs++;
						firebase.database().ref('/Notification/'+i).remove();
					}
				}			
			}
			for(var i=0;i<selNotifs;i++){
				delUnreadNotifs(notifIds[i]);
			}				
	  	}
	});
}

function delUnreadNotifs(notifId){
	firebase.database().ref('/Student/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					var notifs = snapshot.child(''+i).val().unreadnotificationsid.split(",");
					var unreadnotifs = "";
					for(var j=0;j<notifs.length;j++){
						if(notifs[j] != notifId && notifs[j] != '-'){
							unreadnotifs += notifs[j]+",";
						}
					}
					if(unreadnotifs.length > 0 && unreadnotifs[unreadnotifs.length-1] == ","){
						unreadnotifs = unreadnotifs.substring(0,unreadnotifs.length-1);
					}
					if(unreadnotifs.length == 0){
						unreadnotifs = "-";
					}
					firebase.database().ref('/Student/'+i).update({
						"unreadnotificationsid": unreadnotifs
					});
				}			
			}				
	  	}
	});
}

function deleteAllStudents(){
	//delete all students make student count = 0
	var ans = confirm("Are you sure you want to delete all Students ?");
	if (ans == true) {
		firebase.database().ref('/Student').remove();
		firebase.database().ref('/Student/Count').set({
		    count:0
		});
		alert("All Students deleted");
	}
}

function specificStudentDelete(){
	var delfn = document.getElementById("delfn").checked;
	var delsem = document.getElementById("delsem").checked;
	var delemail = document.getElementById("delemail").checked;
	var deldept = document.getElementById("deldept").checked;
	var email = document.getElementById("email").value;
	var fullname = document.getElementById("fullname").value;
	var selectDept = document.getElementById("selectDept");
    var dept = selectDept.options[selectDept.selectedIndex].value;
    var selectSem = document.getElementById("selectSem");
    var sem = selectSem.options[selectSem.selectedIndex].value;
    if(delfn || delsem || delemail || deldept){
		delStudentbyAllAttr(delfn,delsem,delemail,deldept,fullname,email,dept,sem);	
    }
    else{
    	alert("Please Select an Option");
    }
}

function delStudentbyAllAttr(delfn,delsem,delemail,deldept,fullname,email,dept,sem){
	firebase.database().ref('/Student/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var counter = 0;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(((delfn && snapshot.child(''+i).val().name == fullname)|| !delfn) 
						&& ((delemail && snapshot.child(''+i).val().email == email) || !delemail)
						&& ((deldept && snapshot.child(''+i).val().dept == dept) || !deldept)
						&& ((delsem && snapshot.child(''+i).val().sem == sem) || !delsem)){
							firebase.database().ref('/Student/'+i).remove();
							counter++;
					}
				}			
			}				
			alert(counter + " Students were deleted");
	  	}
	});	
}

function deleteAllInsts(){	//important delete courses and files of that instructor or not
	var ans = confirm("Are you sure you want to delete All Instructors, All Courses they teach and All Files they uploaded ?");
	if (ans == true) {
	    firebase.database().ref('/Instructor').remove();
		firebase.database().ref('/Instructor/Count').set({
		    count:0
		});
		alert("All Instructors deleted");
		delCoursesAndAllFiles();		
	}	
}

function specificInstructorDelete(){
	var delfn = document.getElementById("delfn").checked;
	var delemail = document.getElementById("delemail").checked;
	var email = document.getElementById("email").value;
	var fullname = document.getElementById("fullname").value;	
	if(delfn || delemail){
		firebase.database().ref('/Instructor/').once('value').then(function(snapshot) {
		  	var count = snapshot.val().Count.count;
		  	if(snapshot.val()){
		  		var instIds;
				var selectedinst = 0;
				for (var i = 0; i < count; i++) {
					if(snapshot.child(''+i).val()){
						if(((delfn && snapshot.child(''+i).val().name == fullname)|| !delfn) 
							&& ((delemail && snapshot.child(''+i).val().email == email) || !delemail)){
								instIds[selectedinst] = i;
								selectedinst++;
						}
					}			
				}
				for(var i=0; i<selectedinst; i++){
			  		delInstWithoutCourses(instIds[i]);
			  	}				
		  	}		  	
		});
	}
	else{
		alert("Please Select an Option");
	}
	
}

function delInstWithoutCourses(instId){
	firebase.database().ref('/Course').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var found = false;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().instId == instId){
						found = true;
						break;
					}
				}			
			}
			if(!found){
				firebase.database().ref('/Instructor/' + instId).remove();
				alert("Instructor with ID: " + instId + " was deleted");
			}
			else{
				alert("Instructor with ID: " + instId + " teaches at least one course and can't be deleted!");
			}
	  	}
	});
}

function deleteAllCourses(){
	var ans = confirm("Are you sure you want to delete All Courses and All uploaded files?");
	if (ans == true) {
		delCoursesAndAllFiles();
	}
}

function delCoursesAndAllFiles(){
	firebase.database().ref('/Course').remove();
	firebase.database().ref('/Course/Count').set({
	    count:0
	});
	delFilesandNotifs();
	firebase.database().ref('/Student/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var found = false;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					firebase.database().ref('/Student/'+i).update({
						"specialcoursesid" : '-',
						"unreadnotificationsid" : '-'
					});
				}			
			}				
	  	}
	  	alert("All Courses and Files Deleted");
	});

}

function orderToDelete(i){
	console.log("called: "+i);
	if(i<0){
		firebase.database().ref('/File').remove();
		firebase.database().ref('/Notification').remove();
		firebase.database().ref('/File/Count').set({
		    count:0
		});
		firebase.database().ref('/Notification/Count').set({
		    count:0
		});
		alert("Storage Cleaned");
		return;
	}
	//console.log(firebase.storage().ref().child(delPaths[i]).fullPath);

	firebase.storage().ref().child(delPaths[i]).delete().then(function() {
	  // File deleted successfully
	  orderToDelete(i-1);
	}).catch(function(error) {
	  // Uh-oh, an error occurred!
	  alert(error);
	});
	// firebase.storage().ref().child(delPaths[i]).delete();
	// orderToDelete(i-1);
}

var delPaths=[];

function delFilesandNotifs(){
	firebase.database().ref('/File/').once('value').then(function(snapshot) {
	  	if(snapshot.val()){
	  		var count = snapshot.val().Count.count;	  		
	  		var k=0;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					//delete file by id/name
					delPaths[k] = snapshot.child(''+i).val().path;
					k++;
				}			
			}
			if(k>0){
				orderToDelete(k-1);
			}						
	  	}		
	});
}

function deleteAllFiles(){
	//delete all file entries make file count = 0
	//delete all notifications make notification count = 0
	//loop on all students make unread notification = ''
	//delete files from storage
	var ans = confirm("Are you sure you want to delete All Files and their Notifications ?");
	if (ans == true) {
		delFilesandNotifs();
		firebase.database().ref('/Student/').once('value').then(function(snapshot) {
		  	var count = snapshot.val().Count.count;
		  	if(snapshot.val()){
		  		var found = false;
				for (var i = 0; i < count; i++) {
					if(snapshot.child(''+i).val()){
						firebase.database().ref('/Student/'+i).update({
							"unreadnotificationsid" : '-'
						});
					}			
				}				
		  	}
		  	//alert("All Files deleted");
		});		
	}
}

function deleteData(){
	var selectBox = document.getElementById("selectTable");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(selectedValue == 'Student' || selectedValue == 'Instructor' || selectedValue == 'Course'){
    	var selectdelOpt = document.getElementById("selectDeleteoption");
    	var selectedopt = selectdelOpt.options[selectdelOpt.selectedIndex].value;
    	if(selectedValue == 'Student'){
    		if(selectedopt == 'specific'){
	    		specificStudentDelete();
    		}
    		else{
    			deleteAllStudents();
    		}
	    }
	    else if(selectedValue == 'Instructor'){
	    	if(selectedopt == 'specific'){
	    		specificInstructorDelete();
	    	}
	    	else{
    			deleteAllInsts();
    		}
	    }
	    else if(selectedValue == 'Course'){
	    	if(selectedopt == 'specific'){
	    		specificCourseDelete();
	    	}
	    	else{
    			deleteAllCourses();
    		}
	    }
    }
    else if(selectedValue == 'allFiles'){
		deleteAllFiles();
    }
}

function askForDeleteData(){
	var selectBox = document.getElementById("selectTable");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(selectedValue == 'Student' || selectedValue == 'Instructor' || selectedValue == 'Course'){
    	document.getElementById("deleteOption").style.display = "block";
    	var selectdelOpt = document.getElementById("selectDeleteoption");
    	var selectedopt = selectdelOpt.options[selectdelOpt.selectedIndex].value;
    	if(selectedValue == 'Student'){
    		if(selectedopt == 'specific'){
	    		printStudentDelete();
    		}
    		else{
    			document.getElementById("insertData").innerHTML = '';
    		}
	    }
	    else if(selectedValue == 'Instructor'){
	    	if(selectedopt == 'specific'){
	    		printInstructorDelete();
	    	}
	    	else{
    			document.getElementById("insertData").innerHTML = '';
    		}
	    }
	    else if(selectedValue == 'Course'){
	    	if(selectedopt == 'specific'){
	    		printCourseDelete();
	    	}
	    	else{
    			document.getElementById("insertData").innerHTML = '';
    		}	    	
	    }
	    document.getElementById("deleteButton").style.display = "block";
    }
    else if(selectedValue == 'allFiles'){
    	document.getElementById("deleteButton").style.display = "block";
    	document.getElementById("insertData").innerHTML = '';
    	document.getElementById("deleteOption").style.display = "none";
    }
    else{
    	document.getElementById("deleteButton").style.display = "none";
    	document.getElementById("insertData").innerHTML = '';
    	document.getElementById("deleteOption").style.display = "none";
    }
}

function getCoursesByDept(dept,id){	
	var selectBox = document.getElementById("selectSem");
    var selectedSem = selectBox.options[selectBox.selectedIndex].value;
	firebase.database().ref('/Course').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var restinData = 'Special Courses: <select id="selectSpecial'+id+'">';
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().dept == dept && snapshot.child(''+i).val().sem != selectedSem){
						restinData+='<option value="'+snapshot.child(''+i).val().id+'" >'+snapshot.child(''+i).val().name+'</option>';
					}
				}			
			}
			restinData+='</select>';
			document.getElementById(id).innerHTML = restinData;
	  	}
	});
	
}

function getInst(){
	firebase.database().ref('/Instructor').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){
	  		var found = false;	
	  		var restinData = 'Instructor: <select id="selectInst">';
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					found = true;
					restinData+='<option value="'+snapshot.child(''+i).val().id+'" >'+snapshot.child(''+i).val().id+': '+snapshot.child(''+i).val().name+'</option>';
				}
			}
			if(found){
				document.getElementById("insertButton").style.display = "block";
			}
			restinData+='</select>';
			document.getElementById("instructor").innerHTML = restinData;
	  	}
	});
}

var instFoundDel = false;


function getInstDel(){
	firebase.database().ref('/Instructor').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){
	  		instFoundDel = false;	
	  		var restinData = '<input type="checkbox" id="delinst" style="width:10%;clear:none;"/>Instructor: <select id="selectInst">';
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					instFoundDel = true;
					restinData+='<option value="'+snapshot.child(''+i).val().id+'" >'+snapshot.child(''+i).val().id+': '+snapshot.child(''+i).val().name+'</option>';
				}
			}
			restinData+='</select>';
			if(instFoundDel){
				document.getElementById("instructor").innerHTML = restinData;
			}
	  	}
	});
}

function changeavailableCoursesInsert(){
	var selectBox = document.getElementById("selectDept");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(document.getElementById("sp1").checked){
    	getCoursesByDept(selectedValue,"courses");
    }
    if(document.getElementById("sp2").checked){
    	getCoursesByDept(selectedValue,"courses1");
    }
}

function printStudentInsert(){
	var inData = '<p>Full name: <input type="text" id="fullname"></p>';//fullname,email,pass,dept,sem,specialcourses,unreadnotifications
	    inData+= '<p>Email: <input type="email" id="email"></p>';//check if unique and is a valid mail
	    inData+= '<p>Password: <input type="password" id="password"></p>';//chack if more than 6 chars
	    inData+= '<p>Confirm Password: <input type="password" id="confirmpass"></p>';//check if it equals the other password
	    inData+= '<p>Department: <select id="selectDept" onchange="changeavailableCoursesInsert()"><option value="CSE" selected>Computer & Systems</option><option value="CEE">Communication & Electronics</option><option value="EPE">Electrical Power</option><option value="ME">Mechanical</option></select></p>';
		inData+= '<p>Semester: \
		<select id="selectSem" onchange="changeavailableCoursesInsert()">\
		<option value="1" selected>First Semester</option>\
		<option value="2" >Second Semester</option>\
		<option value="3" >Third Semester</option>\
		<option value="4" >Fourth Semester</option>\
		<option value="5" >Fifth Semester</option>\
		<option value="6" >Sixth Semester</option>\
		<option value="7" >Seventh Semester</option>\
		<option value="8" >Eighth Semester</option>\
		</select>\
		</p><input type="checkbox" id="sp1" style="width:10%;clear:none;" onclick="sp1checked()">Special Course 1</input><p id="courses"></p><input type="checkbox" id="sp2" style="width:10%;clear:none;" onclick="sp2checked()">Special Course 2</input><p id="courses1"></p>';
		document.getElementById("insertData").innerHTML = inData;
		

}

function sp1checked(){
	if(document.getElementById("sp1").checked){
		var selectDept = document.getElementById("selectDept");
    	var selectedDept = selectDept.options[selectDept.selectedIndex].value;
    	getCoursesByDept(selectedDept,"courses");
    }
    else{
    	document.getElementById('courses').innerHTML = '';
    }
}

function sp2checked(){
	if(document.getElementById("sp2").checked){
		var selectDept = document.getElementById("selectDept");
    	var selectedDept = selectDept.options[selectDept.selectedIndex].value;
    	getCoursesByDept(selectedDept,"courses1");
    }
    else{
    	document.getElementById('courses1').innerHTML = '';
    }
}

function printInstructorInsert(){
	var inData = '<p>Full name: <input type="text" id="fullname"></p>';
	    inData+= '<p>Email: <input type="email" id="email"></p>';//check if unique and is a valid mail
	    inData+= '<p>Password: <input type="password" id="password"></p>';//chack if more than 6 chars
	    inData+= '<p>Confirm Password: <input type="password" id="confirmpass"></p>';//check if it equals the other password
	document.getElementById("insertData").innerHTML = inData;
}

function printCourseInsert(){
	var inData = '<p>Course name: <input type="text" id="fullname"></p>';
	    inData+= '<p>Department: <select id="selectDept"><option value="CSE" selected>Computer & Systems</option><option value="CEE">Communication & Electronics</option><option value="EPE">Electrical Power</option><option value="ME">Mechanical</option></select></p>';
		inData+= '<p>Semester: \
		<select id="selectSem">\
		<option value="1" selected>First Semester</option>\
		<option value="2" >Second Semester</option>\
		<option value="3" >Third Semester</option>\
		<option value="4" >Fourth Semester</option>\
		<option value="5" >Fifth Semester</option>\
		<option value="6" >Sixth Semester</option>\
		<option value="7" >Seventh Semester</option>\
		<option value="8" >Eighth Semester</option>\
		</select>';
		inData+= '<p id="instructor"></p>';
		document.getElementById("insertData").innerHTML = inData;
		getInst();
}

function insert(){
	var selectBox = document.getElementById("selectTable");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(selectedValue == 'Student'){
    	insertStudent();
    }
    else if(selectedValue == 'Instructor'){
    	insertInstructor();
    }
    else if(selectedValue == 'Course'){
    	insertCourse();
    }
    // selectBox.value = "Please choose table";
    // selectBox.onchange();
}

function validemail(email){
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function addInstructorData(usertype,uid){
	firebase.database().ref(usertype + uid).set({
			id:uid,
		    email:document.getElementById("email").value,
		    name:document.getElementById("fullname").value,
		    password:document.getElementById("password").value
		});
}

function addStudentData(usertype,uid){
	var selectDept = document.getElementById("selectDept");
   	var selectedDept = selectDept.options[selectDept.selectedIndex].value;
   	var selectSem = document.getElementById("selectSem");
   	var selectedSem = selectSem.options[selectSem.selectedIndex].value;
   	var selectedSp1;
   	var selectedSp2;
   	var special;
   	if(document.getElementById("sp1").checked){
   		var selectSp1 = document.getElementById("selectSpecialcourses");
   		selectedSp1 = selectSp1.options[selectSp1.selectedIndex].value;
   	}
   	if(document.getElementById("sp2").checked){
   		var selectSp2 = document.getElementById("selectSpecialcourses1");
   		selectedSp2 = selectSp2.options[selectSp2.selectedIndex].value;
   	}
   	var addStudent = true;
   	if(selectedSp1 != null && selectedSp2 != null){
   		if(selectedSp1 != selectedSp2){
   			special = selectedSp1+","+selectedSp2;
   		}
   		else{
   			addStudent = false;
   			alert("Two Special Courses can't be the same!");
   		}
   	}
   	else if(selectedSp1 != null && selectedSp2 == null){
   		special = selectedSp1+'';
   	}
   	else if(selectedSp1 == null && selectedSp2 != null){
   		special = selectedSp2+'';
   	}
   	else{
   		special = '-';
   	}
   	if(addStudent){
   		firebase.database().ref(usertype + uid).set({
   			id:uid,
		    email:document.getElementById("email").value,
		    name:document.getElementById("fullname").value,
		    password:document.getElementById("password").value,
		    dept:selectedDept,
		    sem:selectedSem,
		    specialcoursesid:special,
		    unreadnotificationsid:'-'
		});
		alert("User added Successfully");
   	}
}

function checkOnInstructor(email){
	firebase.database().ref('/Instructor/').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){
	  		var found = false;	
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().email == email){
						found = true;
					}	
				}						
			}
			if(!found){
				firebase.database().ref('/Instructor/Count').set({
				    count:count+1
				});
				addInstructorData('/Instructor/',count);				
				alert("User added Successfully");
			}
			else{
				alert("Email already exists!");
			}
	  	}
	});
}

function checkOnInstructortest(email){
	return firebase.database().ref('/Instructor/').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){
	  		var found = false;	
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().email == email){
						found = true;
					}	
				}						
			}
			if(!found){
				// firebase.database().ref('/Instructor/Count').set({
				//     count:count+1
				// });
				// addInstructorData('/Instructor/',count);				
				// alert("User added Successfully");
			}
			else{
				//alert("Email already exists!");
			}
			return found;
	  	}
	});
}

function checkOn(email){
	//check if mail found
	return firebase.database().ref('/Student/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var found = false;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().email == email){
						found = true;
					}
				}			
			}
			if(!found){
				firebase.database().ref('/Student/Count').set({
				    count:count+1
				});
				addStudentData('/Student/',count);
			}
			else{
				alert("Email already exists!");

			}
			return found;			
	  	}
	});
	
}

function checkOntest(email){
	//check if mail found
	return firebase.database().ref('/Student/').once('value').then(function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var found = false;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().email == email){
						found = true;
					}
				}			
			}
			if(!found){
				// firebase.database().ref('/Student/Count').set({
				//     count:count+1
				// });
				// addStudentData('/Student/',count);
			}
			else{
				alert("Email already exists!");
			}
			return found;			
	  	}
	});
	
}

function insertStudent(){
	if(document.getElementById("fullname").value != ""){
		var email = document.getElementById("email").value;
		if(validemail(email)){
			var password = document.getElementById("password").value;
			if(password.length >= 6){
				var confirmPass = document.getElementById("confirmpass").value;
				if(confirmPass == password){										
					checkOn(email);					
				}
				else{
					alert("Confirm Password doesn't match with password!");
				}
			}
			else{
				alert("Password must be more than 5 characters!");
			}				
		}
		else{
			alert("Invalid Email!");
		}
	}
	else{
		alert("Full Name can't be empty!");
	}
}

function insertStudentTest(name,email,password,confirmPass){
	if(name != ""){
		if(validemail(email)){
			if(password.length >= 6){
				if(confirmPass == password){										
					return checkOntest(email);					
				}
				else{
					//alert("Confirm Password doesn't match with password!");
					return false;
				}
			}
			else{
				//alert("Password must be more than 5 characters!");
				return false;
			}				
		}
		else{
			//alert("Invalid Email!");
			return false;
		}
	}
	else{
		//alert("Full Name can't be empty!");
		return false;
	}
}

function insertInstructor(){
	if(document.getElementById("fullname").value != ""){
		var email = document.getElementById("email").value;
		if(validemail(email)){
			var password = document.getElementById("password").value;
			if(password.length >= 6){
				var confirmPass = document.getElementById("confirmpass").value;
				if(confirmPass == password){										
					checkOnInstructor(email);					
				}
				else{
					alert("Confirm Password doesn't match with password!");
				}
			}
			else{
				alert("Password must be more than 5 characters!");
			}				
		}
		else{
			alert("Invalid Email!");
		}
	}
	else{
		alert("Full Name can't be empty!");
	}	
}

function insertInstructorTest(name,email,password,confirmPass){
	if(name != ""){
		if(validemail(email)){
			if(password.length >= 6){
				if(confirmPass == password){										
					return checkOnInstructortest(email);					
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}				
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}	
}

function insertCourse(){
	if(document.getElementById("fullname").value != ""){
		addCourse();
	}
	else{
		alert("Course Name can't be empty!");
	}	
}

function addCourse(){
	var selectDept = document.getElementById("selectDept");
   	var selectedDept = selectDept.options[selectDept.selectedIndex].value;
	firebase.database().ref('/Course/').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){
	  		var found = false;	
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().name == document.getElementById("fullname").value && snapshot.child(''+i).val().dept == selectedDept){
						found = true;
					}	
				}						
			}
			if(!found){
				firebase.database().ref('/Course/Count').set({
				    count:count+1
				});
				addCourseData('/Course/',count);				
				alert("Course added Successfully");
			}
			else{
				alert("Course already exists!");
			}
	  	}
	});
}

function addCourseTest(name,dept){
	return firebase.database().ref('/Course/').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){
	  		var found = false;	
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().name == name && snapshot.child(''+i).val().dept == dept){
						found = true;
					}	
				}						
			}
			if(!found){
				// firebase.database().ref('/Course/Count').set({
				//     count:count+1
				// });
				// addCourseData('/Course/',count);				
				// alert("Course added Successfully");
			}
			else{
				// alert("Course already exists!");
			}
			return found;
	  	}
	});
}

function addCourseData(usertype,uid){
	var selectDept = document.getElementById("selectDept");
   	var selectedDept = selectDept.options[selectDept.selectedIndex].value;
   	var selectSem = document.getElementById("selectSem");
   	var selectedSem = selectSem.options[selectSem.selectedIndex].value;
   	var selectInst = document.getElementById("selectInst");
   	var selectedInst = selectInst.options[selectInst.selectedIndex].value;
   	var inst = parseInt(selectedInst);
   	firebase.database().ref(usertype + uid).set({
		id:uid,
	    name:document.getElementById("fullname").value,
	    dept:selectedDept,
	    sem:selectedSem,
	    instId:inst
	});
}

function getCourseTable(){	
	firebase.database().ref('/Course').on('value',function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var tableData = "<tr><th>Course ID</th><th>Course Name</th><th>Instructor ID</th><th>Semester</th><th>Department</th></tr>";
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					tableData += "<tr><td>"+snapshot.child(''+i).val().id+"</td><td>"+snapshot.child(''+i).val().name+"</td><td>"+snapshot.child(''+i).val().instId+"</td><td>"+snapshot.child(''+i).val().sem+"</td><td>"+snapshot.child(''+i).val().dept+"</td></tr>";
				}			
			}
			document.getElementById("table").innerHTML = tableData;
	  	}
	}, function (error) {
	  console.log("The read failed: " + errorObject.code);
	  alert(error);
	});	
}

function getFileTable(){	
	firebase.database().ref('/File').on('value',function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var tableData = "<tr><th>File ID</th><th>File Name</th><th>File Path</th><th>Course ID</th><th>Category</th><th>Download URL</th></tr>";
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					tableData += "<tr><td>"+snapshot.child(''+i).val().id+"</td><td>"+snapshot.child(''+i).val().name+"</td><td>"+snapshot.child(''+i).val().path+"</td><td>"+snapshot.child(''+i).val().courseId+"</td><td>"+snapshot.child(''+i).val().category+"</td><td>"+snapshot.child(''+i).val().downloadURL+"</td></tr>";
				}			
			}
			document.getElementById("table").innerHTML = tableData;
	  	}
	}, function (error) {
	  console.log("The read failed: " + errorObject.code);
	  alert(error);
	});	
}

function getInstTable(){	
	firebase.database().ref('/Instructor').on('value',function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var tableData = "<tr><th>Instructor ID</th><th>Instructor Name</th><th>Email</th><th>Password</th></tr>";
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					tableData += "<tr><td>"+snapshot.child(''+i).val().id+"</td><td>"+snapshot.child(''+i).val().name+"</td><td>"+snapshot.child(''+i).val().email+"</td><td>"+snapshot.child(''+i).val().password+"</td></tr>";
				}			
			}
			document.getElementById("table").innerHTML = tableData;
	  	}
	}, function (error) {
	  console.log("The read failed: " + errorObject.code);
	  alert(error);
	});
}

function getNotfTable(){
	firebase.database().ref('/Notification').on('value',function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var tableData = "<tr><th>Notification ID</th><th>File Name</th><th>Course ID</th><th>Category</th><th>Download URL</th></tr>";
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					tableData += "<tr><td>"+snapshot.child(''+i).val().id+"</td><td>"+snapshot.child(''+i).val().filename+"</td><td>"+snapshot.child(''+i).val().courseId+"</td><td>"+snapshot.child(''+i).val().category+"</td><td>"+snapshot.child(''+i).val().downloadURL+"</td></tr>";
				}			
			}
			document.getElementById("table").innerHTML = tableData;
	  	}
	}, function (error) {
	  console.log("The read failed: " + errorObject.code);
	  alert(error);
	});
}

function getStudentTable(){	
	firebase.database().ref('/Student').on('value', function(snapshot) {
	  	var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		var tableData = "<tr><th>Student ID</th><th>Student Name</th><th>Email</th><th>Password</th><th>Department</th><th>Semester</th><th>Special Courses ID</th><th>Unread Notifications ID</th></tr>";
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					tableData += "<tr><td>"+snapshot.child(''+i).val().id+"</td><td>"
					+snapshot.child(''+i).val().name+"</td><td>"+snapshot.child(''+i).val().email
					+"</td><td>"+snapshot.child(''+i).val().password+"</td><td>"+snapshot.child(''+i).val().dept
					+"</td><td>"+snapshot.child(''+i).val().sem+"</td><td>"+snapshot.child(''+i).val().specialcoursesid+"</td><td>"+snapshot.child(''+i).val().unreadnotificationsid+"</td></tr>";
				}			
			}
			document.getElementById("table").innerHTML = tableData;
	  	}
	}, function (error) {
	  console.log("The read failed: " + errorObject.code);
	  alert(error);
	});
}

function getUploadTable(){
	firebase.database().ref('/Course').once('value').then( function(snapshot) {
  		var count = snapshot.val().Count.count;
	  	if(snapshot.val()){
	  		document.getElementById("table").innerHTML = '';
	  		document.getElementById("table").innerHTML += "<tr><th>File ID</th><th>File Name</th><th>File Path</th><th>Course ID</th><th>Category</th><th>Download URL</th></tr>";
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(snapshot.child(''+i).val().instId == sessionStorage.getItem('ID')){
						getFilebyCourseId(snapshot.child(''+i).val().id);						
					}
				}		
			}
	  	}
	});
}

function getFilebyCourseId(courseId){
	return firebase.database().ref('/File').once('value').then( function(snapshot) {
	  		var count = snapshot.val().Count.count;
		  	if(snapshot.val()){
		  		for (var j = 0; j < count; j++) {
					if(snapshot.child(''+j).val()){
						if(snapshot.child(''+j).val().courseId == courseId){
							document.getElementById("table").innerHTML += "<tr><td>"+snapshot.child(''+j).val().id+"</td><td>"+snapshot.child(''+j).val().name+"</td><td>"+snapshot.child(''+j).val().path+"</td><td>"+snapshot.child(''+j).val().courseId+"</td><td>"+snapshot.child(''+j).val().category+"</td><td>"+snapshot.child(''+j).val().downloadURL+"</td></tr>";
						}
					}		
				}
		  	}
		});
}