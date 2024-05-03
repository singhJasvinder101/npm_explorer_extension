// import { getPackageDownloads } from "query-registry";

// const { downloads } = await getPackageDownloads("express", "last-week");
// console.log(downloads)

import { searchPackages } from "query-registry";

const results = await searchPackages({ text: "hamburger-react" });
console.log(results.objects[0].package.links)