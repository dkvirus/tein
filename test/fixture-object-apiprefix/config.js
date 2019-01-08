module.exports = {
    apiPrefix: 'https://novel.dkvirus.top/api/v2',
    apis: [
      {
        req: {
          url: '/gysw/novel/classify',
          method: 'get',
        },
        res: {
          code: String,
          message: String,
          data: [
            {
              id: String,
              path: String,
              desc: String,
            },
          ],
        },
      },
      {
        req: {
          url: '/gysw/search/hot',
        },
        res: {
          code: String,
          message: String,
          data: [
            {
              keyword: String,
              times: String,
            },
          ],
        },
      },
    ],
  };
  