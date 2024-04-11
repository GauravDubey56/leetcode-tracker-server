import axios from "axios";
import { DEFAULT_AUTH_HEADER, authHeader } from "./constants.js";
const USER_AGENT = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
};
export class LeetcodeAuth {
  getCsrfToken = async (cookie) => {
    let csrftoken = "";
    const cookies = cookie[0].split(";");
    for (const message in cookies) {
      const msg = cookies[message];
      if (msg.startsWith("csrftoken")) {
        csrftoken = msg.split("=")[1];
        break;
      }
    }
    return csrftoken;
  };

  accessToken = async () => {
    try {
      const res = await axios.request({
        method: "get",
        maxBodyLength: Infinity,
        url: "http://www.leetcode.com",
        headers: {},
      });
      const token = await this.getCsrfToken(res.headers["set-cookie"]);
      return token;
    } catch (error) {
      const token = this.getCsrfToken(error.response.headers["set-cookie"]);
      return token;
    }
  };

  verifyLogin = async (token, session) => {
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
        query globalData {
          userStatus {
            isSignedIn
            username
            __typename
          }
        }
      `,
      },
      {
        headers: authHeader(token, session),
      }
    );
    return res.data;
  };

  getUserInfo = async (username, token, session) => {
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
          query getUserProfile($username: String!) {
            allQuestionsCount {
              difficulty
              count
              __typename
            }
            matchedUser(username: $username) {
              username
              socialAccounts
              contributions {
                points
                questionCount
                testcaseCount
                __typename
              }
              profile {
                realName
                websites
                countryName
                skillTags
                company
                school
                starRating
                aboutMe
                userAvatar
                reputation
                ranking
                __typename
              }
              submissionCalendar
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                  __typename
                }
                totalSubmissionNum {
                  difficulty
                  count
                  submissions
                  __typename
                }
                __typename
              }
              badges {
                id
                displayName
                icon
                creationDate
                medal {
                  slug
                  config {
                    icon
                    iconGif
                    iconGifBackground
                    iconWearing
                    __typename
                  }
                  __typename
                }
                __typename
              }
              upcomingBadges {
                name
                icon
                __typename
              }
              activeBadge {
                id
                __typename
              }
              __typename
            }
          }
        `,
        variables: {
          username: username,
        },
      },
      {
        headers: {
          ...authHeader(token, session),
          referer: "https://leetcode.com/" + username,
        },
        withCredentials: true,
      }
    );
    const userData = this.extractEndUserInfo(res.data?.data);
    return userData;
  };
  extractEndUserInfo(data) {
    const userData = data.matchedUser;

    // Extract profile details
    const profileDetails = {
      username: userData.username,
      realName: userData.profile.realName,
      avatar: userData.profile.userAvatar,
      reputation: userData.profile.reputation,
      ranking: userData.profile.ranking,
    };

    // Extract questions attempted
    const questionsAttempted = {
      totalQuestionsCount: data.allQuestionsCount.find(
        (item) => item.difficulty === "All"
      ).count,
      easyQuestionsCount: data.allQuestionsCount.find(
        (item) => item.difficulty === "Easy"
      ).count,
      mediumQuestionsCount: data.allQuestionsCount.find(
        (item) => item.difficulty === "Medium"
      ).count,
      hardQuestionsCount: data.allQuestionsCount.find(
        (item) => item.difficulty === "Hard"
      ).count,
    };

    // Extract submission calendar in date format
    const submissionCalendar = JSON.parse(userData.submissionCalendar);
    const submissionCalendarDates = Object.keys(submissionCalendar).map(
      (timestamp) => {
        const date = new Date(parseInt(timestamp) * 1000); // Convert timestamp to milliseconds
        return date.toDateString();
      }
    );

    return {
      profileDetails: profileDetails,
      questionsAttempted: questionsAttempted,
      lastSubmissionsDoneOn: submissionCalendarDates,
    };
  }

  loginWithCredentials = async (username, password, token) => {
    const data = {
      login: username,
      password: password,
      csrfmiddlewaretoken: token,
    };

    const appCookies = { csrftoken: token };

    const resp = await axios.post(
      "https://leetcode.com/accounts/login/",
      data,
      {
        headers: {
          ...authHeader(token, ""),
          referer: "https://leetcode.com/accounts/login/",
        },
        withCredentials: true,
      }
    );
    const respCookies = resp.headers["set-cookie"];
    const loginToken = getCsrfToken(respCookies);
    const sessionId = getSessionId(respCookies);
    console.log(loginToken);
  };
}
