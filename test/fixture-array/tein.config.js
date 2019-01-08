module.exports = [
    {
      req: {
        url: 'https://novel.dkvirus.top/api/v2/gysw/novel/classify',
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
        url: 'https://novel.dkvirus.top/api/v2/gysw/search/hot',
      },
      res: {
        code: String,
        message: String,
        data: [
          {
            keyword: String,
            times: Number,
          },
        ],
      },
    },
]
  