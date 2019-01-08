const { axios } = require("../../src/index");
const qs = require("qs");

module.exports = async function () {
  const result = await axios({
    url: "http://localhost:8081/api/v1/oauth/token",
    method: "post",
    data: qs.stringify({
      grant_type: "password",
      username: "dk",
      password: "admin"
    }),
    headers: {
      Authorization: "Basic c3dhZ2dlcxpzd2FnZ2Vy",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  // 拿到 token
  const { access_token } = result.data;

  return {
    apiPrefix: "http://localhost:8081/api/v1",
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    apis: [
      {
        req: {
          url: "/user"
        },
        res: {
          code: String,
          message: String,
          data: {
            content: [
              {
                name: String,
                desc: String
              }
            ]
          }
        }
      }
    ]
  };
};
