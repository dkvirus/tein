const { axios } = require("../../src/index");
const qs = require("qs");

module.exports = async function () {
  const result = await axios({
    url: "http://localhost:8081/api/v1/oauth/token",
    method: "post",
    data: qs.stringify({
      grant_type: "password",
      username: "admin",
      password: "admin"
    }),
    headers: {
      Authorization: "Basic c3dhZ2dlcjpzd2FnZ2Vy",
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
          url: "/rbac/privs"
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
            ],
            totalPages: Number,
            last: Boolean,
            totalElements: Number,
            size: Number,
            number: Number,
            sort: [
              {
                direction: String,
                property: String,
                ignoreCase: Boolean,
                nullHandling: String,
                descending: Boolean,
                ascending: Boolean
              }
            ],
            first: Boolean,
            numberOfElements: Number
          }
        }
      }
    ]
  };
};
