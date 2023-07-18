const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const e = require("express");
const https = require("https");

const app = express();

//all the static files like styles.css won't load so we have to use express for it 
app.use(express.static(__dirname + '/Public'));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const postData = JSON.stringify({
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_field: {
              FNAME: fName,
              LNAME: lName,
            },
          },
        ],
        sync_tags: false,
        update_existing: false,
      });
     
      const url = "https://us21.api.mailchimp.com/3.0/lists/4ef3033d0a";
      const options = {
        method: "POST",
        auth: "praditha:6ff44ac8b1b9eaf9ef86984ee2cf7e11-us21",
        headers: {
          "content-type": "application/json",
        },
      };
     
      const requestToAPI = https.request(url, options, function (responsefromAPI) {
        
        if(responsefromAPI.statusCode == 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        
        console.log(responsefromAPI.statusCode);
        responsefromAPI.on("data", function (dataFromAPI) {
          console.log(JSON.parse(dataFromAPI.toString()));
        });
        responsefromAPI.on("end", function () {
          console.log("All data received from API");
        });


      });
     
      requestToAPI.on("error", function (error) {
        console.log(error);
      });
     
      requestToAPI.write(postData);
      requestToAPI.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(3000, function(){    
    console.log("Server is running at 3000");
});

//api key 
//6ff44ac8b1b9eaf9ef86984ee2cf7e11-us21

//audience id or list id
//4ef3033d0a