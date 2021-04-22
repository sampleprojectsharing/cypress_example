class LocalStorageHelpers {
  setLocalStorageData(dataModel) {
    for (const key in dataModel) {
      if (Object.prototype.hasOwnProperty.call(dataModel, key)) {
        this.setLocalStorageItem(key, dataModel[key]);
      }
    }
  }

  /**
   * @description returns empty string if skyToken is not set
   * @returns {string}
   */
  getSkyToken() {
    try {
      const skyTokenModel = {
        sky_token: {
          access_token: '',
          expires_in: 86400,
        },
      };
      return JSON.parse(this.getLocalStorageElementObject(skyTokenModel)).access_token;
    } catch (e) {
      return '';
    }
  }

  getLocalStorageElementObject(objectModel) {
    return this.getLocalStorageItem(Object.keys(objectModel)[0]);
  }

  setLocalStorageItem(localStorageKey, localStorageValue) {
    localStorage.setItem(localStorageKey, localStorageValue);
  }

  getLocalStorageItem(localStorageKey) {
    return localStorage.getItem(localStorageKey);
  }
}

export const localStorageHelpers = new LocalStorageHelpers();
