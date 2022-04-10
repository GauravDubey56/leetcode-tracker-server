export const authHeader = (token, session) => {
  return {
    authority: "leetcode.com",
    scheme: "https",
    cookie: "csrftoken=" + token + "; LEETCODE_SESSION=" + session,
    origin: "https://leetcode.com",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "x-csrftoken": token,
  };
};
