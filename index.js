import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const makeNaturalCommits = async (totalCommits = 120) => {
  console.log(`🚀 Creating ${totalCommits} natural-looking commits...`);

  let count = 0;

  for (let i = 0; i < totalCommits; i++) {
    // Random day in the past year (more activity in recent months)
    const daysAgo = random.int(0, 380);
    const commitsToday = random.int(1, 4); // 1-4 commits per day

    const date = moment()
      .subtract(daysAgo, "days")
      .hour(random.int(9, 22))
      .minute(random.int(0, 59));

    for (let j = 0; j < commitsToday; j++) {
      const dateStr = date.format("YYYY-MM-DD HH:mm:ss");

      const data = { date: dateStr };

      await new Promise((resolve) => {
        jsonfile.writeFile(path, data, () => {
          simpleGit()
            .add([path])
            .commit(`update ${date.format("YYYY-MM-DD")}`, { "--date": dateStr })
            .then(() => {
              console.log(`✅ ${date.format("YYYY-MM-DD")}  (${count+1}/${totalCommits})`);
              count++;
            })
            .catch(err => console.error("❌", err.message))
            .finally(resolve);
        });
      });

      await new Promise(r => setTimeout(r, 120)); // small delay
    }
  }

  console.log(`\n🎉 Done! Created ${count} commits.`);
  console.log("Now push with: git push origin main --force");
};

// Run it
makeNaturalCommits(140);   // You can change this number