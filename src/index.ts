import express from 'express';
import moment from 'moment';
import { Launches } from './spaceX/launches';

const app = express();
app.use(express.json());
const port = 8001; // default port to listen

// define a route handler for the default home page
app.get('/', async (request: any, response: any) => {
  response.send({});
});

// Handle get requests to /nasa
app.get('/yearly-launches', async (request: any, response: any) => {
  const daily = new Launches();
  // Sends in today's date as a formatted string
  const result = await daily.getLaunchesByYear(request.query.year);
  // Sends back the result of the image getter
  response.send(result);
});

app.get('/range-launches/:start&:end', async (request: any, response: any) => {
  const daily = new Launches();

  const dateAsMoment = moment(request.params.start, 'YYYY-MM-DD');
  const startYear = dateAsMoment.year().toString();

  const dateAsEndMoment = moment(request.params.end, 'YYYY-MM-DD');
  const endYear = dateAsEndMoment.year().toString();

  let outputArray = [];
  let years;
  for (years = parseInt(startYear); years < parseInt(endYear); years++) {

    const result = await daily.getLaunchesByYear(years.toString());
    for (let i=0; i<result.length; i++) {
      outputArray.push(result[i]);
    }

    // outputArray.push(await daily.getLaunchesByYear(years.toString()));
  }
  response.json(outputArray);
})

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
