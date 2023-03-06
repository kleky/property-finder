import {writeFile} from "fs";

const targetPath = "./src/environments/environment.prod.ts";

const envConfigFile = `export const environment = {
   production: true,
   firebase: {
        apiKey: '${process.env.FIREBASE_API_KEY}'
    },
    geocoderKey: '${process.env.GEOCODER_KEY}'
};
`;

writeFile(targetPath, envConfigFile, "utf8", (err) => {
    if (err) {
        return console.log(err);
    }
});
