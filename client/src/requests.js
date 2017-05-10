const SERVER = process.env.SERVER || 'http://localhost:8080';


const fetchChampionList = () => {
  return fetch(SERVER + '/champions')
  .then(res => res.json());
}

let fetchMatrix = (summonerName) => {
  return fetch(SERVER + '/summoner/na1/' + summonerName)
  .then(res => res.json());
};

fetchMatrix = () => new Promise((resolve, reject) => resolve('Stubbed!'));

export { fetchChampionList, fetchMatrix };