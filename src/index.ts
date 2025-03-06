import { Scraper } from "./Scraper";

const scraper = new Scraper();

const runApp = async () => {
  await scraper.login();
  await scraper.sendMessage({
    message: "Test message",
    title: "Test title",
    to: "jeden1102",
  });
  await scraper.describeAttacks();

  await scraper.sendMessage({
    message: "Test message2",
    title: "Test title2",
    to: "jeden1102",
  });
};

runApp();
