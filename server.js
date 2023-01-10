"use strict";
const express = require("express");
const app = require("express")();
const http = require("http").createServer(app);
const conn = require("./config/db");
var nodemailer = require("nodemailer");
const moment = require("moment");
const bcrypt = require("bcrypt");
const axios = require('axios');


//const { PaymentGateway } = require('@cashfreepayments/cashfree-sdk');

const multer = require("multer");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });
const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
const path = require("path");


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use("/apkurl", express.static("APK"));


 
 
 
 
 
 
 
 
app.get("/servertesting", (req, res) => {
  res.sendFile(path.join(__dirname + "/test.html"));
});

app.get("/test", (req, res) => {
  res.send("test");
});





app.get('/',(req,res)=>{
  res.send("hello world")
})



app.post('/player',async(req,res)=>{
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    let sql = "INSERT INTO player_game_history SET ?";
    let formData1 = {
      
      
      playerid: req.body.playerid,
      game_score: req.body.game_score,
      player_result: req.body.player_result,
      gameid: req.body.gameid,

    };
    let statusCode = 200;
    let message = "";
    if (userss) {
      statusCode = 200;
      message = " updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error--",error)
    res.status(500).send("Database error");
    
  }

})





app.post('/Tournment', async(req, res) => {
  let message = null;
  let statusCode = 200;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    let sql = "INSERT INTO player_game_history SET ?";
    let formData1 = {
      
      
      playerid: req.body.playerid,
      player_score: req.body.player_score,
      player_result: req.body.player_result,
     // gameid: req.body.gameid,

    };

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error--",error)
    res.status(500).send("Database error");
    
  }
});




















 app.post('/pvpTournment', async(req, res) => {
  let message = null;
  let statusCode = 200;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    let sql = "INSERT INTO player_game_history SET ?";
    let formData1 = {
      
      playername: req.body.playername,
      playerid: req.body.playerid,
      game_score: req.body.game_score,
      player_result: req.body.player_result,
     // gameid: req.body.gameid,

    };

     const userss = await conn.query(sql, formData1);
    sql="SELECT player_score FROM player WHERE id=?"
    const player = await conn.query(sql, req.body.playerid);
    const bonusadded =parseInt(req.body.game_score) + parseInt(player[0].player_score);
     sql="UPDATE player SET player_score= ? WHERE id=?"
    const playerUpdate = await conn.query(sql, [bonusadded,req.body.playerid]);

console.log("player:-----",playerUpdate)
    let statusCode = 200;
    let message = "";
    if (userss) {
      statusCode = 200;
      message = " updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    } 
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error--",error)
    res.status(500).send("Database error");
    
  }
});




app.get('/getpvpTournment',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT * FROM  tournment order by score desc`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);



app.get('/playerOnline',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT playerid FROM playeronline WHERE player_online=1`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     /*  data={
      //Playerid:playerid,
      Player_online:agent[0].player_online
     } */
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);


// Start Api--------------------------------------------------------------------------------------------------------------------
//first API

app.post('/PlayerDetail', async(req, res) => {
  let message = "success";
  let statusCode = 200;
  var data = {};
  //const { playername,playerresult,playerid,playerscore } = req.body;
  try {
    let formData1 = {
      
      
      playerid: req.body.playerid,
      player_score: req.body.player_score,
      player_result: req.body.player_result,
      //gameid: req.body.gameid,

    };

    const response = await axios.post('http://localhost:5000/Tournment',formData1);

    const detail = await axios.get('http://localhost:5000/playerOnline');

   // console.log(response.data);
    console.log(detail.data.data);

    let sql = `SELECT id,player_name,player_score FROM  player where  id=?`;
    const singlePlayer= await conn.query(sql, req.body.playerid);
    console.log("singleplayer:==",singlePlayer[0])
    singlePlayer[0].player_result=req.body.player_result
    var playerArray=[]
    for(var i=0;i<detail.data.data.length;i++){
       sql = `SELECT id,player_name,player_score FROM  player where  id=?`;
      const multiPlayer= await conn.query(sql, detail.data.data[i].playerid);
     console.log(multiPlayer[0])
     playerArray.push(multiPlayer[0])
     playerArray.sort(function(a, b) {
      return b.player_score - a.player_score;
    });
    
    }
    data={
      PlayerData:singlePlayer[0],
      otherPlayerData:{
        playeronline:detail.data.data.length,
        playerlist:playerArray
      }
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
    console.log("error--------------",error)
  }
});



































// Second API-----------------------------------------------------------------------------------------------------------------------



app.post('/hourlyDetail', async(req, res) => {
  let message = "success";
  let statusCode = 200;
  var data = {};
  //const { playername,playerresult,playerid,playerscore } = req.body;
  try {
    let formData1 = {
      
      playername:req.body.playername,
      playerid: req.body.playerid,
      game_score: req.body.game_score,
      player_result: req.body.player_result,
      //gameid: req.body.gameid,

    };
    let sql = `SELECT * FROM  player where  id=?`;
    const singlePlayer2= await conn.query(sql, req.body.playerid);
    if(singlePlayer2.length>0){
      const response = await axios.post('http://localhost:5000/pvpTournment',formData1);

    }
    else{
      let sql = `INSERT INTO player SET ?`;
    const singlePlayer1= await conn.query(sql,{id:req.body.playerid,player_score:req.body.game_score,player_name:req.body.playername});
    console.log(singlePlayer1)
    }
    


    const detail = await axios.get('http://localhost:5000/playerOnline');

   // console.log(response.data);
    console.log(detail.data.data);

     sql = `SELECT id,player_name,player_score FROM  player where  id=?`;
    const singlePlayer= await conn.query(sql, req.body.playerid);
    console.log("singleplayer:==",singlePlayer[0])
    singlePlayer[0].player_result=req.body.player_result
    var playerArray=[]
    for(var i=0;i<detail.data.data.length;i++){
       sql = `SELECT id,player_name,player_score FROM  player where  id=?`;
      const multiPlayer= await conn.query(sql, detail.data.data[i].playerid);
     console.log(multiPlayer[0])
     playerArray.push(multiPlayer[0])
     playerArray.sort(function(a, b) {
      return b.player_score - a.player_score;
    });
    
    }
    data={
      PlayerData:singlePlayer[0],
      Leaderboard:{
        playeronline:detail.data.data.length,
        playerlist:playerArray
      }
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error--------------",error)

    res.status(500).send("Database error");
  }
});

















// for testing

 app.post('/dashboardlogin',async(req,res)=>{

  let message = null;
  let statusCode = 400;
  let error = {};
  console.log(req.body);

  let data = {};

  try {
    //    Check requeted user is exist or not
    const { email, password } = req.body;
    let sql = `SELECT * FROM users WHERE LOWER(users.useremail)= ? `;
    let user = await conn.query(sql, [email.toLowerCase()]);
    if (user.length > 0) {
      const usersRows = JSON.parse(JSON.stringify(user))[0];
      const comparison = await bcrypt.compare(password, usersRows.password);
      if (comparison) {
        const last_login = moment().format("YYYY-MM-DD HH:mm:ss");
        statusCode = 200;
        message = "Login success";

        data = {
          //   user_id:1,role_id:1,role_name:"Super Admin",
          balance: usersRows.point,
          user_id: usersRows.user_id,

          login: true,
          profile: {
            email: usersRows.useremail,
             },
          username: usersRows.username,
        };

      } else {
        statusCode = 401;
        message = "Password does not match!";
      }
    } else {
      statusCode = 401;
      message = "Password or email does not match!";
    }
    const responseData = {
      status: statusCode,
      message,
      user: data,
      errors: error,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJyb2xlX2lkIjoxLCJhZG1pbl9pZCI6MSwiaWF0IjoxNjUzMTMwNDMwLCJleHAiOjE2NTMxMzQwMzB9.hU41Zvx5uoaI7Nt46LaL8GFjTjAXUnet6GKhc5Ku4TA",
    };
    res.send(responseData);
  } catch (error) {
    console.log(error);
    res.send({ authLogin: error });
  }})
 

/* app.post('/authSignUp', async (req, res) => {
  let message = null;
  let register = false;

  let statusCode = 400;
  
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "otp.nms@gmail.com",
        pass: "qlholtlqogsewieo",
      },
    });

    const { username, email, password } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9999);
    const last_minute = moment().format("YYYY-MM-DD HH:mm:ss");

    const encryptedPassword = await bcrypt.hash(password, 10);
    const formData = {
      username: username,
      useremail: email,
      
      password: encryptedPassword,
      otp: otp,
      otp_time: last_minute,
    };

    // Check requeted user is exist or not
    let sql = `SELECT * FROM users WHERE LOWER(useremail)= ? limit ?`;
    let user = await conn.query(sql, [formData.useremail.toLowerCase(), 1]);
    if (user.length > 0) {
      statusCode = 401;
      message = "Sorry! Email already exist try another email";
    } else {
      const sql1 = `INSERT INTO admin set ?`;
      const users = await conn.query(sql1, formData);

           
      // Sent mail
      transporter
        .sendMail({
          // from: "otp.nms@gmail.com",
          from: "otp.nms@gmail.com",
          // from: "bigwinnerjackpot1@gmail.com", // sender address
          to: email, // list of receivers
          subject: "OTP Verfications", //  Subject line
          html: `<b>The OTP is ${otp}. <br>This OTP generated at ${last_minute} and valid for 5 Minutes.</b>`, //html body
        })
        .then((info) => {
          console.log({ info });
        })
        .catch(console.error);

      if (users) {
        statusCode = 201;
        message =
          "User created success,An email sent with OTP on your register email address";
        register = true;
      } else {
        statusCode = 500;
        message = "Something went wrong! database error";
      }
    }
    const responseData = {
      status: statusCode,
      message,
      register,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error", error);
    res.send({ error: error });
  }
});
 */
















app.post('/hourly',async(req,res)=>{
  let message = "success";
  let statusCode = 200;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    let sql = "INSERT INTO indirect SET ?";
    let data = {
      
      
      entry: req.body.entry,
      winning_amount: req.body.winning_amount,
    no_player: req.body.no_player,
    time_during: req.body.time_during,

    };

    const userss = await conn.query(sql, data);
    let statusCode = 200;
    let message = "";
    if (userss) {
      statusCode = 200;
      message = "data updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
})





app.post('/indirect', async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    let sql = "INSERT INTO indirect SET ?";
    let formData1 = {
      entry: req.body.entry,
      winning_amount: req.body.winning_amount,
    no_player: req.body.no_player,
    player_rating: req.body.player_rating,
    };

    const userss = await conn.query(sql, formData1);
    let statusCode = 200;
    let message = "";
    if (userss) {
      statusCode = 200;
      message = "data updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log(error)
    res.status(500).send("Database error");
  }
});



app.get('/getindirect',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT * FROM  indirect order by time_during desc`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);


app.post('/sendData', async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    let sql = "INSERT INTO game_history SET ?";
    let formData1 = {
      game_type: req.body.game_type,
      gamename: req.body.gamename,
      result: req.body.result,
      score: req.body.score,
bet_amount: req.body.bet_amount,
winning_amount: req.body.winning_amount,
    gain: req.body.gain,
    loss: req.body.loss,
rating: req.body.rating,
    };

    const userss = await conn.query(sql, formData1);
    let statusCode = 200;
    let message = "";
    if (userss) {
      statusCode = 200;
      message = "data updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
});




app.get('/receiverData',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data
  try {
    let sql = `SELECT * FROM game_history LIMIT 100`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log(error)
    res.status(500).send("Database error");
  }
});




   



app.post('/Login', async (req, res) => {
  let message = "nothing";
  let statusCode = 400;
  let sql = "";
  let responseData;
  let data;
  try {
    let formData1 = {
     login_type: req.body.login_type, //key : value
      username: req.body.username,
    
    };

    sql = "SELECT * FROM admins WHERE login_type=? AND username=?";
    responseData = await conn.query(sql, [req.body.login_type,req.body.username]);
    if (responseData.length > 0) {
      statusCode = 200;
      message = "login";
data={unique_id	:responseData[0].unique_id	}
    } else {
      sql = `INSERT INTO admins SET ?`;
      const datausers = await conn.query(sql, formData1);
       statusCode = 200;
       message = "";
      if (datausers) {
        statusCode = 200;
        message = "data inserted";
        sql = "SELECT unique_id	 FROM admins WHERE login_type=? AND username=?";
        const users = await conn.query(sql,[req.body.login_type,req.body.username]);
data={unique_id	:users[0].unique_id	}

       console.log(users)
      } else {
        statusCode = 500;
        message = "Something went wrong! database error";
      }
       
    } 

    const responseData1 = {
      status: statusCode,
      message,
      data
    };
    res.send(responseData1);
  } catch (error) {
    console.log("error:==============",error);
    res.status(500).send("Database error");
  }
});



















app.get('/download',(req,res)=>{
  res.send(`<a href='/servertesting>click here this downloadlink</a>`)
})




http.listen(PORT, () => {
  ("listening on " + PORT);
});
