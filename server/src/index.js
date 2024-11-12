require("dotenv").config();

const express = require("express");
const axios = require("axios");
const url = require("url");
const session = require("express-session");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);

app.use(
  session({
    secret: "xxx",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/auth/discord/callback", async (req, res) => {
  const { code, redirect_uri } = req.query;
  console.log("/api/auth/discord/callback:", { code, redirect_uri });

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const formattedData = new url.URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      //   redirect_uri: process.env.DISCORD_REDIRECT_URI,
      //   redirect_uri: "http://localhost:1500/api/auth/discord/callback",
      redirect_uri: `http://localhost:1500/api/auth/discord/callback?redirect_uri=${redirect_uri}`,
      // redirect_uri: "http://localhost:5500/client",
      //   scope: "identify",
    });

    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
      formattedData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.status !== 200) {
      return res.status(400).send("Invalid code");
    }
    const { access_token, refresh_token, ...rest } = response.data;

    console.log("response:", { access_token, refresh_token, rest });

    const userInfo = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log("userInfo:", userInfo.data);

    // return res.json(userInfo.data);

    // Store access_token and user ID in session
    req.session.access_token = access_token;
    req.session.user_id = userInfo.data.id;

    // Redirect back to the frontend page
    return res.redirect(
      `${redirect_uri}?user_id=${userInfo.data.id}&access_token=${access_token}`
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/api/session", (req, res) => {
  if (req.session.user_id) {
    res.json({
      user_id: req.session.user_id,
      access_token: req.session.access_token,
    });
  } else {
    res.status(401).send("No active session");
  }
});

app.get("/api/discord/joined", async (req, res) => {
  const access_token = req.session.access_token;
  const user_id = req.session.user_id;
  //   const guild_id = "1235626006623293460"; // Replace with your guild ID
  const guild_id = req.query.guild_id ?? "1235626006623293460";
  console.log("/api/discord/joined:", { access_token, user_id, guild_id });

  if (!access_token || !user_id) {
    return res.status(400).send("User not authenticated");
  }

  try {
    const guilds = await axios.get("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log("guilds:", guilds.data);

    const isMember = guilds.data.some((guild) => guild.id === guild_id);

    if (isMember) {
      return res.send("User has joined the server");
    } else {
      return res.send("User has not joined the server");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
