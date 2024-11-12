const CLIENT_ID = "1304113952388808787";
const REDIRECT_URI = "http://localhost:1500/api/auth/discord/callback";
const AUTH_ENDPOINT = "https://discord.com/api/oauth2/authorize";
const RESPONSE_TYPE = "code";
// const SCOPE = "identify";
const SCOPE = "guilds.join+identify+email";

document.getElementById("loginButton").addEventListener("click", () => {
  //   window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  //     REDIRECT_URI
  //     //   )}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
  //   )}&response_type=${RESPONSE_TYPE}`;
  //   window.location.href = `https://discord.com/oauth2/authorize?client_id=1304113952388808787&response_type=code&redirect_uri=http://localhost:1500/api/auth/discord/callback?scope=connections+email+guilds+guilds.members.read+guilds.join+identify`;
  //   window.location.href = `https://discord.com/oauth2/authorize?client_id=1304113952388808787&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5500%2Fclient&scope=guilds.join+identify+email`;

  // localhost:1500
  // window.location.href =
  // "https://discord.com/oauth2/authorize?client_id=1304113952388808787&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A1500%2Fapi%2Fauth%2Fdiscord%2Fcallback%3Fredirect_uri%3Dhttp%3A%2F%2Flocalhost%3A5500%2Fclient%2F&scope=guilds.join+identify+email";
  // "https://discord.com/oauth2/authorize?client_id=1304113952388808787&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A1500%2Fapi%2Fauth%2Fdiscord%2Fcallback%3Fredirect_uri%3Dhttp%3A%2F%2Flocalhost%3A5500%2Fclient%2F&scope=identify+email";
  // localhost:5000
  window.location.href =
    "https://discord.com/oauth2/authorize?client_id=1304113952388808787&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5500%2Fclient%2F&scope=guilds.join+identify+email";

  // const redirectUri = encodeURIComponent("http://localhost:5500/client");
  // window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
});

// Function to get query parameters from URL
function getQueryParams() {
  const params = {};
  console.log("window.location.search", window.location.search);
  window.location.search
    .substring(1)
    .split("&")
    .forEach((param) => {
      const [key, value] = param.split("=");
      params[key] = decodeURIComponent(value);
    });
  return params;
}

// Check if the URL contains a code parameter
const params = getQueryParams();
console.log("Params:", params);
if (params.code) {
  console.log("Code:", params.code);
  const codeDiv = document.getElementById("code");
  codeDiv.innerHTML = `Authorization Code: ${params.code}`;

  // fetch(`/api/auth/discord/callback?code=${params.code}`)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     const userInfoDiv = document.getElementById("userInfo");
  //     userInfoDiv.innerHTML = `
  //               <p>ID: ${data.id}</p>
  //               <p>Username: ${data.username}</p>
  //               <p>Discriminator: ${data.discriminator}</p>
  //               <p>Avatar: <img src="https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png" alt="Avatar"></p>
  //           `;
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });
}

document.getElementById("checkGuildButton").addEventListener("click", () => {
  const guildId = document.getElementById("guildIdInput").value;
  fetch(`http://localhost:1500/api/discord/joined?guild_id=${guildId}`, {
    credentials: "include",
  })
    .then((response) => response.text())
    .then((data) => {
      const guildInfoDiv = document.getElementById("guildInfo");
      guildInfoDiv.innerHTML = `<p>${data}</p>`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

fetch("http://localhost:1500/api/session", { credentials: "include" })
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("No active session");
    }
  })
  .then((sessionData) => {
    const sessionInfoDiv = document.getElementById("sessionInfo");
    sessionInfoDiv.innerHTML = `
      <p>User ID: ${sessionData.user_id}</p>
      <p>Access Token: ${sessionData.access_token}</p>
    `;
  })
  .catch((error) => {
    console.error("Error:", error);
  });
