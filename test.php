<!DOCTYPE html>
<html>
   <head>		
   		<meta charset="UTF-8">
		<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase.js"></script>
		<script type = "text/javascript" src = "index.js"></script>
		<script type = "text/javascript" src = "update.js"></script>
		<script type = "text/javascript" src = "upload.js"></script>
		<link rel="icon" href="images/book.ico" type="image/x-icon">
		
		<!-- 
		<script src="https://code.jquery.com/qunit/qunit-2.0.1.js"></script>
		<script src="chai-http.js"></script>
		<script src="mocha.js"></script>
		<script>
		  chai.use(chaiHttp);
		</script> -->
		<title>Mocha Tests</title>
  		<link href="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css" rel="stylesheet" />
  		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="normalize.css">
		<link rel="stylesheet" href="main.css">
		<script src="modernizr-2.6.2.min.js"></script>
   </head>
	
   <body>
		<img src="images/library.jpg" alt="Books" style="width:100%;height:300px;"/>
		<h1 style="text-align:center">Testing Faculty File Sharing System</h1>
		<div id="loader-wrapper" style="display:none;">
			<div id="loader"></div>
		</div>
		<div id="login"></div>
		<div id="mocha"></div>

		<script src="https://cdn.rawgit.com/jquery/jquery/2.1.4/dist/jquery.min.js"></script>
		<script src="https://cdn.rawgit.com/Automattic/expect.js/0.3.1/index.js"></script>
		<script src="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.js"></script>
		<script src="chai.js"></script>

		<script>mocha.setup('bdd')</script>
		<script src="test.js"></script>
		<script>
			mocha.checkLeaks();
			mocha.globals(['jQuery']);
			mocha.run();
		</script>
   </body>
	
</html>