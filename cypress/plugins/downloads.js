const path = require('path');
const { promisify } = require('util');
const debug = require('debug')('cypress:server:protocol');
const rimraf = promisify(require('rimraf'));

module.exports = {
  onTaskCleanDownloads: (config) => {
    const downloadPath = path.resolve(config.projectRoot, './downloads');

    async function cleanDownloads() {
      debug(`cleaning up downloads at ${downloadPath}`);

      await rimraf(downloadPath);
      return true;
    }

    function getDownloadPath() {
      return downloadPath;
    }

    return {
      cleanDownloads,
      getDownloadPath,
    };
  },
};
