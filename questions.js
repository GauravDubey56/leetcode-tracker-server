import axios from "axios";
import { authHeader } from "./constants.js";

export class Questions {
  getSubmissions = async (token, session, questionSlug) => {
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
        query Submissions($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!) {
            submissionList(offset: $offset, limit: $limit, lastKey: $lastKey, questionSlug: $questionSlug) {
                lastKey
                hasNext
                submissions {
                    id
                    statusDisplay
                    lang
                    runtime
                    timestamp
                    url
                    isPending
                    memory
                    __typename
                }
                __typename
            }
        }
        `,
        variables: {
          offset: 0,
          limit: 20,
          lastKey: null,
          questionSlug: questionSlug,
        },
      },
      {
        headers: {
          ...authHeader(token, session),
          referer: `https://leetcode.com/problems/${questionSlug}/submissions/`,
        },
      }
    );
    return res.data["data"]["submissionList"];
  };
}
