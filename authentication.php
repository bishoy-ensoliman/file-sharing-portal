<!DOCTYPE html>
<html>
   <head>		
   		<meta charset="UTF-8">
		<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase.js"></script>
		<script type = "text/javascript" src = "index.js"></script>
		<title>Faculty File Sharing</title>
		<link rel="icon" href="images/book.ico" type="image/x-icon">
		<script type="text/javascript">//updateStatus("<?php echo $_SERVER['HTTP_HOST'] ?>");</script>
   </head>
	
   <body>
		<img src="images/library.jpg" alt="Books" style="width:100%;height:300px;"/>
		<h1 style="text-align:center">Logging in....</h1>
		<script type="text/javascript">
			login("<?php echo $_POST['email'] ?>","<?php echo $_POST['password'] ?>","<?php echo $_SERVER['REMOTE_ADDR'] ?>","<?php echo $_SERVER['HTTP_HOST'] ?>");
		</script>
   </body>
	
</html>
