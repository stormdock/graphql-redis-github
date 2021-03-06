import gql from "graphql-tag";
import { sadd } from "./../redis/writeUtils";
import {
  getJsonKeyFromFile,
  readJsonDataFromFilename
} from "./../util/file-util";
import { getClient } from "./../util/apollo-util";
import { getGithubData } from "./../util/github-util";
import { handlePromise } from "./../util/promise-util";
import repositories from "./../../data/in/v100.json";

const query = gql`
  query Forks($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      name
      nameWithOwner
      forks(first: 100, after: $after) {
        totalCount
        edges {
          cursor
          node {
            owner {
              login
            }
          }
        }
      }
    }
  }
`;

async function iterateOverCursor(client, cursor, options_in) {
  const options = {
    repository: options_in.repository,
    owner: options_in.owner,
    name: options_in.name,
    after: cursor
  };

  let json = await getGithubData(client, options, query);
  let data = await handlePromise(json);
  await getCursorFromData(client, options, data);
}

async function getCursorFromData(client, options, value) {
  let userCount = value.data.repository.forks.totalCount;
  let edgeAry = value.data.repository.forks.edges;

  processEdgeAry(edgeAry, options.repository);

  let edgeAryLength = edgeAry.length;
  let cursor = edgeAry[edgeAryLength - 1].cursor;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  console.log("cursor = ", cursor);

  if (edgeAryLength < 100) {
    return 1;
  }

  iterateOverCursor(client, cursor, options);
}

function processEdgeAry(edgeAry, repository) {
  edgeAry.forEach(function(item) {
    let login = item.node.owner.login;
    // eventually we will rename this method
    // but for now it sadd's a member to a set
    sadd(repository, login);
  });
}

async function goGql(options) {
  let githubApiKey = await getJsonKeyFromFile("./data/f1.js");
  let client = await getClient(githubApiKey);
  let json = await getGithubData(client, options, query);
  let data = await handlePromise(json);
  await getCursorFromData(client, options, data);
}

// const repositories = ["graphql/graphql-js"];

repositories.forEach(function(repository) {
  const result = repository.split("/");
  const options = { repository: repository, owner: result[0], name: result[1] };
  goGql(options);
});
