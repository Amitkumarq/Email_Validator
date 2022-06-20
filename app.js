const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { Stats } = require("fs");


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/home.html");

});



app.post("/", function (req, res) {

    const email = req.body.email;
    const api_key = "805c2c58a29f467c97588cae525e5d7c";

    var data = {
        members: [
            {
                email_address: email,

            }
        ]
    };

    var jsonData = JSON.stringify(data);


    const url = "https://emailvalidation.abstractapi.com/v1/?api_key=" + api_key + "&email=" + email + "  ";

    const request = https.request(url, function (response) {

        response.on("data", function (data) {
            const datA = JSON.parse(data);
            const temp = datA.deliverability;

            console.log(datA);
            console.log(temp);

            if(temp === "DELIVERABLE")
            {
                res.sendFile(__dirname + "/success.html");
            }else{
                res.sendFile(__dirname + "/failure.html")
            }
            
        })

       

    })

    request.write(jsonData)
    request.end();
});

app.post("/failure", function (req, res) {
    res.sendFile(__dirname + "/home.html");
});



app.listen(process.env.PORT || 3000, function () {
    console.log("Server is started on port 3000.")
})
