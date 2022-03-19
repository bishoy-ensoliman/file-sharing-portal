function askForUpdateData(){
	var selectBox = document.getElementById("selectTable_2");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(selectedValue == 'Student' || selectedValue == 'Instructor' || selectedValue == 'Course'){

    	if(selectedValue == 'Student'){


    		printStudentUpdate();
    		document.getElementById("nextButton").style.display = "block";

    	}
    	else if(selectedValue == 'Instructor'){
    		printInstructorUpdate();
    		document.getElementById("nextButton").style.display = "block";

    	}
    	else if(selectedValue == 'Course'){
    		printCourseUpdate();
    		document.getElementById("nextButton").style.display = "block";


    	}

    	else{
	    	document.getElementById("nextButton").style.display = "none";
	    	document.getElementById("insertData").innerHTML = '';
    	}
    }
	
}


function printStudentUpdate(){
	var inData = "Check the option you want to update by: <br>";
		inData+= '<p><input type="checkbox" id="updateid" style="width:10%;clear:none;"/>ID: <input type="text" id="id"></p>';
	    inData+= '<p><input type="checkbox" id="updateemail" style="width:10%;clear:none;"/>Email: <input type="email" id="email"></p>';//check if unique and is a valid mail
	    /*inData+= '<p><input type="checkbox" id="updatedept" style="width:10%;clear:none;"/>Department: <select id="selectDept"><option value="CSE" selected>Computer & Systems</option><option value="CEE">Communication & Electronics</option><option value="EPE">Electrical Power</option><option value="ME">Mechanical</option></select></p>';
		inData+= '<p><input type="checkbox" id="updatesem" style="width:10%;clear:none;"/>Semester: \
		<select id="selectSem">\
		<option value="1" selected>First Semester</option>\
		<option value="2" >Second Semester</option>\
		<option value="3" >Third Semester</option>\
		<option value="4" >Fourth Semester</option>\
		<option value="5" >Fifth Semester</option>\
		<option value="6" >Sixth Semester</option>\
		<option value="7" >Seventh Semester</option>\
		<option value="8" >Eighth Semester</option>\
		</select>\
		</p><input type="checkbox" id="sp" style="width:10%;clear:none;" onclick="getCourses()">Special Course </input><p id="courses"></p>';*/
		document.getElementById("insertData").innerHTML = inData;


}

function printInstructorUpdate(){
	var inData = "Check the option you want to update by: <br>";
		inData+= '<p><input type="checkbox" id="updateid" style="width:10%;clear:none;"/>ID: <input type="text" id="id"></p>';//fullname,email,pass,dept,sem,specialcourses,unreadnotifications
	    inData+= '<p><input type="checkbox" id="updateemail" style="width:10%;clear:none;"/>Email: <input type="email" id="email"></p>';//check if unique and is a valid mail

	    document.getElementById("insertData").innerHTML = inData;

}

function printCourseUpdate(){
	var inData = "Check the option you want to update by: <br>";
		inData+= '<p><input type="checkbox" id="updateid" style="width:10%;clear:none;"/>ID: <input type="text" id="id"></p>';
	 //    inData+= '<p><input type="checkbox" id="updatedept" style="width:10%;clear:none;"/>Department: <select id="selectDept"><option value="CSE" selected>Computer & Systems</option><option value="CEE">Communication & Electronics</option><option value="EPE">Electrical Power</option><option value="ME">Mechanical</option></select></p>';
		// inData+= '<p><input type="checkbox" id="updatesem" style="width:10%;clear:none;"/>Semester: \
		// <select id="selectSem">\
		// <option value="1" selected>First Semester</option>\
		// <option value="2" >Second Semester</option>\
		// <option value="3" >Third Semester</option>\
		// <option value="4" >Fourth Semester</option>\
		// <option value="5" >Fifth Semester</option>\
		// <option value="6" >Sixth Semester</option>\
		// <option value="7" >Seventh Semester</option>\
		// <option value="8" >Eighth Semester</option>\
		// </select>';
		// inData+= '<p id="instructor"></p>';
		 document.getElementById("insertData").innerHTML = inData;
		// getInst();

}


function takeNewData(){


	var selectBox = document.getElementById("selectTable_2");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(selectedValue == 'Student' || selectedValue == 'Instructor' || selectedValue == 'Course'){
    	if(selectedValue == 'Student'){

    		studentUpdateCheck();
    	}
    	else if(selectedValue == 'Instructor'){
    		instructorUpdateCheck();
    	}
    	else if(selectedValue == 'Course'){
    		courseUpdateCheck();
    	}

    }
}

function studentUpdateCheck(){

	var updateid = document.getElementById("updateid").checked;
	var updateemail = document.getElementById("updateemail").checked;
	/*var updatedept = document.getElementById("updatedept").checked;
	var updatesem = document.getElementById("updatesem").checked;
	var updatesp= document.getElementById("sp").checked;*/


    if(updateid || updateemail){
    	//document.getElementById("updateButton").style.display = "block";
		printStudentNewUpdate();	
    }
    else{
    	alert("Please Select an Option");
    }

}



function printStudentNewUpdate(){
	var updateid = document.getElementById("updateid").checked;
	var updateemail = document.getElementById("updateemail").checked;

	var oldid = document.getElementById("id").value;
	var oldemail = document.getElementById("email").value;
	var found=false;

	if(updateid && oldid==""){
		alert("Empty ID");
	}

	else if(updateemail && oldemail=="" ){
		alert("Empty Email");
	}

	else if(updateemail && oldemail!="" ){
		if(!validemail(oldemail))
			alert("Not Valid Email");
	}


	else{
		firebase.database().ref('/Student/').once('value').then(function(snapshot) {
		var count = snapshot.val().Count.count;
		if(snapshot.val()){
			var counter = 0;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(((updateid && snapshot.child(''+i).val().id == oldid)|| !updateid) 
						&& ((updateemail && snapshot.child(''+i).val().email == oldemail) || !updateemail)){
							found=true;
							document.getElementById("insertData").style.display = "none";
							document.getElementById("nextButton").style.display = "none";
							var inData = "Fill only the new values you want to update and check if you want to change Department or Semester<br>";
								inData+= '<p>Full name: <input type="text" id="newfullname"></p>';//fullname,email,pass,dept,sem,specialcourses,unreadnotifications
							    inData+= '<p>Email: <input type="email" id="newemail"></p>';//check if unique and is a valid mail
							    inData+= '<p>Password: <input type="password" id="newpassword"></p>';//chack if more than 6 chars
							    inData+= '<p>Confirm Password: <input type="password" id="newconfirmpass"></p>';//check if it equals the other password
							    inData+= '<p>Department:\
							    <select id="newselectDept" >\
							    <option value="CSE">Computer & Systems</option>\
							    <option value="CEE">Communication & Electronics</option>\
							    <option value="EPE">Electrical Power</option>\
							    <option value="ME">Mechanical</option></select></p>';
							 
								inData+= '<p>Semester: \
								<select id="newselectSem" >\
								<option value="1" selected>First Semester</option>\
								<option value="2" >Second Semester</option>\
								<option value="3" >Third Semester</option>\
								<option value="4" >Fourth Semester</option>\
								<option value="5" >Fifth Semester</option>\
								<option value="6" >Sixth Semester</option>\
								<option value="7" >Seventh Semester</option>\
								<option value="8" >Eighth Semester</option>\
								</select></p>\
								<input type="checkbox" id="sp" style="width:10%;clear:none;" onclick="spchecked()">Special Courses</input>\
								<p id="courses1">Special Course 1</p>\
								<p id="courses2">Special Course 2</p>';
								document.getElementById("updateData").innerHTML = inData;
								document.getElementById("newselectDept").value= snapshot.child(''+i).val().dept;
								document.getElementById("newselectSem").value= snapshot.child(''+i).val().sem;
								document.getElementById("updateButton").style.display = "block";



								break;

					}
				}

			}
			if(!found)
				alert("not found");
		}
	});
	}

	
}



function instructorUpdateCheck(){
	var updateid = document.getElementById("updateid").checked;
	var updateemail = document.getElementById("updateemail").checked;

	if(updateid || updateemail ){
    	document.getElementById("nextButton").style.display = "none";
    	document.getElementById("updateButton").style.display = "block";
		printInstructorNewUpdate();	
    }
    else{
    	alert("Please Select an Option");
    }

}

function printInstructorNewUpdate(){
	document.getElementById("insertData").style.display = "none";
	var inData = "Fill only the new values you want to update: <br>";
		inData+= '<p>Full name: <input type="text" id="newfullname"></p>';
	    inData+= '<p>Email: <input type="email" id="newemail"></p>';//check if unique and is a valid mail
	    inData+= '<p>Password: <input type="password" id="newpassword"></p>';//chack if more than 6 chars
	    inData+= '<p>Confirm Password: <input type="password" id="newconfirmpass"></p>';//check if it equals the other password
	document.getElementById("updateData").innerHTML = inData;
}


function courseUpdateCheck(){
	var updateid = document.getElementById("updateid").checked;
	// var updatedept = document.getElementById("updatedept").checked;
	// var updatesem = document.getElementById("updatesem").checked;
	// var updateinst = document.getElementById("updateinst").checked;

	if(updateid ){
    	document.getElementById("nextButton").style.display = "none";
		printCourseNewUpdate();	
    }
    else{
    	alert("Please Select an Option");
    }

}

function printCourseNewUpdate(){
	document.getElementById("insertData").style.display = "none";
	var inData = "Fill only the new values you want to update and check if you want to change Department, Semester or Instructor <br>";
		inData+= '<p>Course name: <input type="text" id="newfullname"></p>';
	    inData+= '<p><input type="checkbox" id="newupdatedept" style="width:10%;clear:none;"/>Department: <select id="newselectDept" onchange="changeavailableCoursesInsert()"><option value="CSE" selected>Computer & Systems</option><option value="CEE">Communication & Electronics</option><option value="EPE">Electrical Power</option><option value="ME">Mechanical</option></select></p>';
		inData+= '<p><input type="checkbox" id="newupdatesem" style="width:10%;clear:none;"/>Semester: \
		<select id="newselectSem">\
		<option value="1" selected>First Semester</option>\
		<option value="2" >Second Semester</option>\
		<option value="3" >Third Semester</option>\
		<option value="4" >Fourth Semester</option>\
		<option value="5" >Fifth Semester</option>\
		<option value="6" >Sixth Semester</option>\
		<option value="7" >Seventh Semester</option>\
		<option value="8" >Eighth Semester</option>\
		</select>';
		inData+= '<p id="instructor_2"></p>';
		document.getElementById("updateData").innerHTML = inData;
		getInstUpdate();

}


function updateData(){
	var selectBox = document.getElementById("selectTable_2");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(selectedValue == 'Student' || selectedValue == 'Instructor' || selectedValue == 'Course'){
    	if(selectedValue == 'Student'){
    		updateStudent();
    	}
    	else if(selectedValue == 'Instructor'){
    		updateInstructor();
    	}
    	else if(selectedValue == 'Course'){
    		updateCourse();
    	}

    }

}

function updateStudent(){
	var trueEntries=true;

	var newemail = document.getElementById("newemail").value;
	var newpassword= document.getElementById("newpassword").value;
	var newconfirmpass=document.getElementById("newconfirmpass").value;
	
    if(newemail != ""){
    	if(!validemail(newemail)){
    		alert("Invalid Email!");
    		trueEntries=false;
    	}

    }
    if(newpassword.length>=6){
    	if(newpassword!= newconfirmpass){
    		alert("Confirm Password doesn't match with password!");
    		trueEntries=false;

    	}

    }
    else if(newpassword !=""){
    	alert("Password must be more than 5 characters!");
    	trueEntries=false;
    }

    if(trueEntries){

    	checkOnStudent(newemail);
	}

}

function updateInstructor(){
	var trueEntries=true;

	var newemail = document.getElementById("newemail").value;
	var newpassword= document.getElementById("newpassword").value;
	var newconfirmpass=document.getElementById("newconfirmpass").value;
	
    if(newemail != ""){
    	if(!validemail(newemail)){
    		alert("Invalid Email!");
    		trueEntries=false;
    	}

    }
    if(newpasswordlength>=6){
    	if(newpassword!= newconfirmpass){
    		alert("Confirm Password doesn't match with password!");
    		trueEntries=false;

    	}

    }
    else if(newpassword !=""){
    	alert("Password must be more than 5 characters!");
    	trueEntries=false;
    }

    if(trueEntries){

    	checkOnInstructor(newemail);
	}	

}

function updateCourse(){
	//alert("hnaaaaaa")
	var updateid = document.getElementById("updateid").checked;
	// var updatedept = document.getElementById("updatedept").checked;
	// var updatesem = document.getElementById("updatesem").checked;
	// var updateinst = document.getElementById("updateinst").checked;

	var oldid = document.getElementById("id").value;
	// var oldselectDept = document.getElementById("selectDept");
 //    var olddept = oldselectDept.options[oldselectDept.selectedIndex].value;
 //    var oldselectSem = document.getElementById("selectSem");
 //    var oldsem = oldselectSem.options[oldselectSem.selectedIndex].value;
 //    var oldselectinst = document.getElementById("selectInst");
 //    var oldinst = oldselectinst.options[oldselectinst.selectedIndex].value;

    var newfullname = document.getElementById("newfullname").value;
	var newselectDept = document.getElementById("newselectDept");
    var newdept = newselectDept.options[newselectDept.selectedIndex].value;
    var newselectSem = document.getElementById("newselectSem");
    var newsem = newselectSem.options[newselectSem.selectedIndex].value;
    var newselectinst = document.getElementById("newselectInst");
    var newinst = newselectinst.options[newselectinst.selectedIndex].value;

    var newupdatedept=document.getElementById("newupdatedept").checked;
    var newupdatesem=document.getElementById("newupdatesem").checked;
    var newupdateinst=document.getElementById("newupdateinst").checked;

   

    firebase.database().ref('/Course/').once('value').then(function(snapshot) {
		var count = snapshot.val().Count.count;
		if(snapshot.val()){
			var counter = 0;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(((updateid && snapshot.child(''+i).val().id == oldid)|| !updateid)){

							if(newfullname!="")
								firebase.database().ref('/Course/'+i).update({
									"name" : newfullname
								});
							if(newupdatedept)
								firebase.database().ref('/Course/'+i).update({
									"dept" : newdept
								});
							if(newupdatesem)
								firebase.database().ref('/Course/'+i).update({
									"sem" : newsem
								});
							if(newupdateinst)
								firebase.database().ref('/Course/'+i).update({
									"instId" : newinst
								});
							counter++;
						}
				}			
			}				
			alert(counter + " Courses were updated");
		}
	});



}

function getInst(){
	firebase.database().ref('/Instructor').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){
	  		var found = false;	
	  		var restinData = '<p><input type="checkbox" id="updateinst" style="width:10%;clear:none;"/>';
	  		restinData+='Instructor: <select id="selectInst">';
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					found = true;
					restinData+='<option value="'+snapshot.child(''+i).val().id+'" >'+snapshot.child(''+i).val().id+': '+snapshot.child(''+i).val().name+'</option>';
				}
			}
			if(found){
    			document.getElementById("nextButton").style.display = "block";
			}
			restinData+='</select>';
			document.getElementById("instructor").innerHTML = restinData;

	  	}
	});
}

function getInstUpdate(){
	firebase.database().ref('/Instructor').once('value').then(function(snapshot) {
	  var count = snapshot.val().Count.count;
	  if(snapshot.val()){
	  		var found = false;	
	  		var restinData = '<p><input type="checkbox" id="newupdateinst" style="width:10%;clear:none;"/>';
	  		restinData+='Instructor: <select id="newselectInst">';
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					found = true;
					restinData+='<option value="'+snapshot.child(''+i).val().id+'" >'+snapshot.child(''+i).val().id+': '+snapshot.child(''+i).val().name+'</option>';
				}
			}
			if(found){
    			document.getElementById("updateButton").style.display = "block";
			}
			restinData+='</select>';
			document.getElementById("instructor_2").innerHTML = restinData;

	  	}
	});
}

function getCourses(){
	if(document.getElementById("sp").checked){
		firebase.database().ref('/Course').once('value').then(function(snapshot) {
		  	var count = snapshot.val().Count.count;
		  	if(snapshot.val()){
		  		var restinData = 'Special Courses: <select id="selectSpecialCourses">';
				for (var i = 0; i < count; i++) {
					if(snapshot.child(''+i).val()){
						restinData+='<option value="'+snapshot.child(''+i).val().id+'" >'+snapshot.child(''+i).val().name+'</option>';
					}
				}
				restinData+='</select>';
				document.getElementById("courses").innerHTML = restinData;
			}
		});
    }
    else{
    	document.getElementById("courses").innerHTML = '';
    }

}


function validemail(email){
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function checkOnStudent(email){
	if(email=="")
		updateStudentData();
	else{
	//check if mail found
		alert("hnaaaa");
		firebase.database().ref('/Student/').once('value').then(function(snapshot) {
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
					updateStudentData();
				}
				else{
					alert("Email already exists!");
				}
				
		  	}
		});
	}
	
}

function checkOnInstructor(email){
	if(email=="")
		updateInstructorData();
	else{
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
					updateInstructorData();				
				}
				else{
					alert("Email already exists!");
				}
		  	}
		});
	}


}

function updateStudentData(){
	var updateid = document.getElementById("updateid").checked;
	var updateemail = document.getElementById("updateemail").checked;
	
	var oldid = document.getElementById("id").value;
	var oldemail = document.getElementById("email").value;


    var newfullname = document.getElementById("newfullname").value;
	var newemail = document.getElementById("newemail").value;
	var newpassword= document.getElementById("newpassword").value;
	var newconfirmpass=document.getElementById("newconfirmpass").value;
	var newselectDept = document.getElementById("newselectDept");
    var newdept = newselectDept.options[newselectDept.selectedIndex].value;
    var newselectSem = document.getElementById("newselectSem");
    var newsem = newselectSem.options[newselectSem.selectedIndex].value;

    var newspupdate=document.getElementById("sp").checked;
    var newsp1,newsp2;

    if(newspupdate){

	    var newselectSp1 = document.getElementById("selectSpecialcourses1");
	    var newsp1 = newselectSp1.options[newselectSp1.selectedIndex].value;
	    
	    var newselectSp2 = document.getElementById("selectSpecialcourses2");
	    var newsp2= newselectSp2.options[newselectSp2.selectedIndex].value;
	 }

    
    var special;


    

    // var newupdatedept=document.getElementById("newupdatedept").checked;
    // var newupdatesem=document.getElementById("newupdatesem").checked;


	firebase.database().ref('/Student/').once('value').then(function(snapshot) {
		var count = snapshot.val().Count.count;
		if(snapshot.val()){
			var counter = 0;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(((updateid && snapshot.child(''+i).val().id == oldid)|| !updateid) 
						&& ((updateemail && snapshot.child(''+i).val().email == oldemail) || !updateemail)){

							if(newfullname!="")
								firebase.database().ref('/Student/'+i).update({
									"name" : newfullname
								});
							if(newemail!="")
								firebase.database().ref('/Student/'+i).update({
									"email" : newemail,
								});
							if(newpassword!="")
								firebase.database().ref('/Student/'+i).update({
									"password" : newpassword
								});
							if(newspupdate){
								if(newsp1 != "-" && newsp2 != "-"){
							   		if(newsp1 != newsp2){
							   			special = newsp1+","+newsp2;
							   		}
							   		else{
							   			alert("Two Special Courses can't be the same!");
							   		}
							   	}
							   	else if(newsp1 != "-" && newsp2 == "-"){
							   		special = newsp1+'';
							   	}
							   	else if(newsp1 == "-" && newsp2 != "-"){
							   		special = newsp2+'';
							   	}
							   	else{
							   		special = '-';
							   	}
							 	firebase.database().ref('/Student/'+i).update({
									"specialcoursesid" : special

								});  	
							}

							firebase.database().ref('/Student/'+i).update({
								"dept" : newdept,
								"sem" : newsem

							});
							
							counter++;
						}
				}			
			}				
			alert(counter + " Students were updated");
		}
	});


}

function updateInstructorData(){

	var updateid = document.getElementById("updateid").checked;
	var updateemail = document.getElementById("updateemail").checked;

	var oldid = document.getElementById("id").value;
	var oldemail = document.getElementById("email").value;

	var newfullname = document.getElementById("newfullname").value;
	var newemail = document.getElementById("newemail").value;
	var newpassword= document.getElementById("newpassword").value;
	var newconfirmpass=document.getElementById("newconfirmpass").value;

	firebase.database().ref('/Instructor/').once('value').then(function(snapshot) {
		var count = snapshot.val().Count.count;
		if(snapshot.val()){
			var counter = 0;
			for (var i = 0; i < count; i++) {
				if(snapshot.child(''+i).val()){
					if(((updateid && snapshot.child(''+i).val().id == oldid)|| !updateid) 
						&& ((updateemail && snapshot.child(''+i).val().email == oldemail) || !updateemail))
					{

						if(newfullname!="")
							firebase.database().ref('/Instructor/'+i).update({
								"name" : newfullname
							});
						if(newemail!="")
							firebase.database().ref('/Instructor/'+i).update({
								"email" : newemail,
							});
						if(newpassword!="")
							firebase.database().ref('/Instructor/'+i).update({
								"password" : newpassword
							});
						counter++;
					}

				}
			}
			alert(counter + " Instructors were updated");

		}

	});

}

function spchecked(){
	sp1checked();
	sp2checked();
}

function sp1checked(){
	if(document.getElementById("sp").checked){
		var selectDept = document.getElementById("newselectDept");
    	var selectedDept = selectDept.options[selectDept.selectedIndex].value;
    	getCoursesByDept(selectedDept,"courses1");
    }
    else{
    	document.getElementById('courses1').innerHTML = '';
    }
}

function sp2checked(){
	if(document.getElementById("sp").checked){
		var selectDept = document.getElementById("newselectDept");
    	var selectedDept = selectDept.options[selectDept.selectedIndex].value;
    	getCoursesByDept(selectedDept,"courses2");
    }
    else{
    	document.getElementById('courses2').innerHTML = '';
    }
}

function getCoursesByDept(dept,id){	
	var selectBox = document.getElementById("newselectSem");
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
			restinData+='<option value="-" >none</option>';

			restinData+='</select>';
			document.getElementById(id).innerHTML = restinData;
	  	}
	});

	
	
}

function take_input_to_update(updateid,updateemail, oldid, oldemail ){
	
	var found=false;
	if(updateid || updateemail){
    	if(updateid && oldid==""){
			//alert("Empty ID");
			return found;
		}

		else if(updateemail && oldemail=="" ){
			//alert("Empty Email");
			return found;
		}
		else if(updateemail && oldemail!="" ){
			if(!validemail(oldemail)){
				//alert("Not Valid Email");
				return found;

			}
		}
	}

    else{
    	//alert("Please Select an Option");
    	return found;

    }
	return true;

}

function updateDataTest(newemail,newpassword, newconfirmpass ){

	var trueEntries=true;

	
    if(newemail != ""){
    	if(!validemail(newemail)){
    		//alert("Invalid Email!");
    		trueEntries=false;
    	}

    }
    if(newpassword.length>=6){
    	if(newpassword!= newconfirmpass){
    		//alert("Confirm Password doesn't match with password!");
    		trueEntries=false;

    	}

    }
    else if(newpassword !=""){
    	//alert("Password must be more than 5 characters!");
    	trueEntries=false;
    }

    if(trueEntries){

    	//checkOnStudent(newemail);
	}

	return trueEntries;

}

function checkUpdatedStudent(updateid, updateemail,oldid, oldemail ){
	return firebase.database().ref('/Student/').once('value').then(function(snapshot) {
		var count = snapshot.val().Count.count;
		var found=false;
		if(snapshot.val()){
			var counter = 0;
			for (var i = 0; i < count; i++) {
				//alert(i);
				if(snapshot.child(''+i).val()){
					if(((updateid && snapshot.child(''+i).val().id == oldid && oldid!="")|| !updateid) 
						&& ((updateemail && snapshot.child(''+i).val().email == oldemail && oldemail!="") || !updateemail)){
							found=true;
							//alert("found");
							/*document.getElementById("insertData").style.display = "none";
							document.getElementById("nextButton").style.display = "none";
							var inData = "Fill only the new values you want to update and check if you want to change Department or Semester<br>";
								inData+= '<p>Full name: <input type="text" id="newfullname"></p>';//fullname,email,pass,dept,sem,specialcourses,unreadnotifications
							    inData+= '<p>Email: <input type="email" id="newemail"></p>';//check if unique and is a valid mail
							    inData+= '<p>Password: <input type="password" id="newpassword"></p>';//chack if more than 6 chars
							    inData+= '<p>Confirm Password: <input type="password" id="newconfirmpass"></p>';//check if it equals the other password
							    inData+= '<p>Department:\
							    <select id="newselectDept" >\
							    <option value="CSE">Computer & Systems</option>\
							    <option value="CEE">Communication & Electronics</option>\
							    <option value="EPE">Electrical Power</option>\
							    <option value="ME">Mechanical</option></select></p>';
							 
								inData+= '<p>Semester: \
								<select id="newselectSem" >\
								<option value="1" selected>First Semester</option>\
								<option value="2" >Second Semester</option>\
								<option value="3" >Third Semester</option>\
								<option value="4" >Fourth Semester</option>\
								<option value="5" >Fifth Semester</option>\
								<option value="6" >Sixth Semester</option>\
								<option value="7" >Seventh Semester</option>\
								<option value="8" >Eighth Semester</option>\
								</select></p>\
								<input type="checkbox" id="sp" style="width:10%;clear:none;" onclick="spchecked()">Special Courses</input>\
								<p id="courses1">Special Course 1</p>\
								<p id="courses2">Special Course 2</p>';
								document.getElementById("updateData").innerHTML = inData;
								document.getElementById("newselectDept").value= snapshot.child(''+i).val().dept;
								document.getElementById("newselectSem").value= snapshot.child(''+i).val().sem;
								document.getElementById("updateButton").style.display = "block";*/





								

					}
				}

			}
			if(!found){
				//alert("not found");

			}
			return found;
		}
	});
}