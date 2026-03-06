const Koa = require("koa");
const Router = require("koa-router");

const events = require("./events.json");

const app = new Koa();
const router = new Router();

const random = () => Math.floor(Math.random() * (1000 - 100) + 100) / 100;

function getRandomNumber(ret) {
  if (random() < 7.5) return ret;
  return Math.floor(Math.random() * (1000 - 100) + 100) / 100;
}

function enrichEventOdds(event) {
  const odds = {
    1: getRandomNumber(event.odds["1"] || 1),
    x: getRandomNumber(event.odds["x"] || 1),
    2: getRandomNumber(event.odds["2"] || 1),
  };

  return { ...event, odds };
}

router.get("/events", (ctx) => {
  const enrichedEvents = events.map((e) => enrichEventOdds(e));

  if (enrichedEvents) {
    ctx.body = enrichedEvents;
  } else {
    ctx.body = [];
  }
});

router.get("/event/:id", (ctx) => {
  const eventId = parseInt(ctx.params.id);
  const event = events.find((item) => item.id === eventId);
  if (event) {
    ctx.body = enrichEventOdds(event);
  } else {
    ctx.body = "Event not found";
    ctx.status = 404;
  }
});

app.use(router.routes());

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
