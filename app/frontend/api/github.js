import { getData } from './base';

const getRepos = () => {
  return getData('/github/repos');
};

const getRepository = (reposName) => {
  return getData(`/github/${reposName}`);
};

const getReadme = (reposName) => {
  return getData(`/github/${reposName}/readme`);
};

const getUser = () => {
  return getData(`/github/user`);
};

const getCommits = () => {
  return getData(`/github/repos/commits`);
};

export default {
  getUser,
  getRepos,
  getRepository,
  getReadme,
  getCommits
}