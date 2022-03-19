<!DOCTYPE html>
<html>
   <head>		
   		<meta charset="UTF-8">
		<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase.js"></script>
		<script type = "text/javascript" src = "index.js"></script>
		<title>Faculty File Sharing</title>
		<link rel="icon" href="images/book.ico" type="image/x-icon">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="normalize.css">
		<link rel="stylesheet" href="main.css">
		<script src="modernizr-2.6.2.min.js"></script>
   </head>
	
   <body>
		<img src="images/library.jpg" alt="Books" style="width:100%;height:300px;"/>		
		<div id="loader-wrapper" style="display:none;">
			<div id="loader"></div>
		</div>
		<div id="login">
			<h1 style="text-align:center">Welcome to Faculty File Sharing System</h1>
			<fieldset style="margin: auto;width: 21%;">
				<legend>Please Login:</legend>
				Email:<br>
				<input type="email" id="email" required><br>
				Password:<br>
				<input type="password" id="password" required><br>
				<!--<input type="submit" value="Log in">-->
				<button onclick='validateLogin("<?php echo $_SERVER['REMOTE_ADDR'] ?>","<?php echo $_SERVER['HTTP_HOST'] ?>")'>Log In</button>		
			</fieldset>
		</div>

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.9.1.min.js"><\/script>')</script>
   </body>
	
</html>
