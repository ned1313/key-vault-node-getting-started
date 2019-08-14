var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();

app.get('/', function(req, res){
    res.render('form');
 });
 
 app.set('view engine', 'pug');
 app.set('views', './views');

 app.use(express.urlencoded());
 
 // for parsing multipart/form-data
 app.use(upload.array()); 
 app.use(express.static('public'));
 
 app.post('/', function(req, res){
   console.log(req.body);
   const KeyVault = require('azure-keyvault');
   const msRestAzure = require('ms-rest-azure');
   msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'}).then( (credentials) => {
      const keyVaultClient = new KeyVault.KeyVaultClient(credentials);

      var vaultUri = "https://" + req.body.keyVault + ".vault.azure.net/";  
      keyVaultClient.getSecret(vaultUri, req.body.secretName, "").then(function(response){
         console.log(response);
         res.send("Your secret is: " + response)    
      })
   });
   
 });

 const port = process.env.PORT || 1337;
 app.listen(port, () => console.log("Server is running on port" + port));
