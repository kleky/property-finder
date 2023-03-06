import {writeFile} from "fs";

const targetPath = "./src/environments/environment.ts";

const envConfigFile = `export const environment = {
   production: true,
   firebase: {
        apiKey: '${process.env.FIREBASE_API_KEY}',
    },
    geocoderKey: '${process.env.GEOCODER_KEY}',
    agmApiKey: '${process.env.AGM_API_KEY}',
    awsAccessKeyId: '${process.env.S3_AWS_ACCESS_KEY_ID}',
    awsSecretAccessKey: '${process.env.S3_AWS_ACCESS_KEY_SECRET}',
};
`;

writeFile(targetPath, envConfigFile, "utf8", (err) => {
    if (err) {
        return console.log(err);
    }
});
