import fs from "fs";
import { google as Google } from "googleapis";
import {
  OAUTH_CLIENTID,
  OAUTH_CLIENT_SECRET,
  OAUTH_PLAYGROUND,
  OAUTH_REFRESH_TOKEN,
} from "../config/env.config.js";

class GoogleDriveService {
  #driveClient;
  #oAuthClientId = OAUTH_CLIENTID;
  #oAuthClientSecret = OAUTH_CLIENT_SECRET;
  #oAuthRedirect = OAUTH_PLAYGROUND;
  #oAuthRefreshToken = OAUTH_REFRESH_TOKEN;
  constructor() {
    // this.#driveClient = Google.
    this.#driveClient = this.createDriveClient();
  }

  createDriveClient() {
    const oauth2Client = new Google.auth.OAuth2(
      this.#oAuthClientId,
      this.#oAuthClientSecret,
      this.#oAuthRedirect
    );

    oauth2Client.setCredentials({ refresh_token: this.#oAuthRefreshToken });

    return Google.drive({
      version: "v3",
      auth: oauth2Client,
    });
  }

  createFolder(folderName) {
    return new Promise((resolve, reject) => {
      this.#driveClient.files.create(
        {
          resource: {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
          },
          fields: "id, name",
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res.data);
        }
      );
    });
  }

  searchFolder(folderName) {
    return new Promise((resolve, reject) => {
      this.#driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: "files(id, name)",
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data.files ? res.data.files[0] : null);
        }
      );
    });
  }

  getFile(file) {
    return new Promise((resolve, reject) => {
      this.#driveClient.files.get(
        {
          fileId: file.id,
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data);
        }
      );
    });
  }

  saveFile(fileName, filePath, fileMimeType, folderId) {
    return new Promise((resolve, reject) => {
      this.#driveClient.files.create(
        {
          requestBody: {
            name: fileName,
            mimeType: fileMimeType,
            parents: folderId ? [folderId] : [],
          },
          media: {
            mimeType: fileMimeType,
            body: fs.createReadStream(filePath),
          },
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data);
        }
      );
    });
  }
}

export default GoogleDriveService;
