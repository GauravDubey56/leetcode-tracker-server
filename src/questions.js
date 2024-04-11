import axios from "axios";
import { authHeader } from "./constants.js";

export class Questions {
  getSubmissions = async (token, session, questionSlug) => {
    const query = `query submissionList($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!, $lang: Int, $status: Int) {
  questionSubmissionList(
    offset: $offset
    limit: $limit
    lastKey: $lastKey
    questionSlug: $questionSlug
    lang: $lang
    status: $status
  ) {
    lastKey
    hasNext
    submissions {
      id
      title
      titleSlug
      status
      statusDisplay
      lang
      langName
      runtime
      timestamp
      url
      isPending
      memory
      hasNotes
      notes
      flagType
      topicTags {
        id
      }
    }
  }
}
`;

    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query,
        // query: `
        // query Submissions($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!) {
        //     submissionList(offset: $offset, limit: $limit, lastKey: $lastKey, questionSlug: $questionSlug) {
        //         lastKey
        //         hasNext
        //         submissions {
        //             id
        //             statusDisplay
        //             lang
        //             runtime
        //             timestamp
        //             url
        //             isPending
        //             memory
        //             __typename
        //         }
        //         __typename
        //     }
        // }
        // `,
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
    return res.data["data"]["questionSubmissionList"];
    
  };
  searchQuestions = async (token, session, { searchParam, offset, limit }) => {
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        operationName: "problemsetQuestionList",
        query: `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        total: totalNum
        questions: data {
          acRate
          difficulty
          freqBar
          frontendQuestionId: questionFrontendId
          isFavor
          paidOnly: isPaidOnly
          status
          title
          titleSlug
          topicTags {
            name
            id
            slug
          }
          hasSolution
          hasVideoSolution
        }
      }
    }
        `,
        variables: {
          categorySlug: "all-code-essentials",
          skip: offset || 0,
          limit: limit || 50,
          filters: {
            searchKeywords: searchParam,
          },
        },
      },
      {
        headers: authHeader(token, session),
      }
    );
    let problemList = res.data.data.problemsetQuestionList.questions;
    const totalCount = res.data.data.problemsetQuestionList.total;
    if (problemList?.length) {
      problemList = problemList.map((problem) => {
        return {
          title: problem.title,
          titleSlug: problem.titleSlug,
          difficulty: problem.difficulty,
          acceptanceRate: problem.acRate,
          premium: problem.paidOnly || false,
          status: problem.status,
          topicTags: problem.topicTags,
        };
      });
    }
    return {
      count: totalCount,
      questions: problemList,
    };
  };
}
