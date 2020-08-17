const https = require('https');
const fs = require('fs');
const { argv } = require('yargs');

const download = (url, dest) => {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
    });
  }).on('error', (err) => { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
  });
};

const {
  bucket = 'https://valyous-public.s3-eu-west-1.amazonaws.com/i18n/',
  platform,
  locale_dir = 'locales/'
} = argv;

const seedLocalization = (bucket, platform, dest_dir) => {
  if (!bucket || !platform) {
    return console.warn('Required Bucket & Platform')
  }
  const languages = ['he', 'en'];

  languages.forEach((lang) => {
    const dest = `${dest_dir}${lang}.json`;
    const url = `${bucket}${lang}_${platform}.json`;

    download(url, dest);
  });
}

seedLocalization(bucket, platform, locale_dir);

module.exports = seedLocalization;