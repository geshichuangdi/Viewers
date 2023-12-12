/* eslint-disable */
import sha1 from "./utils/sha1.js"
export default function (wadoRest) {
  return {
    series: (PatientID, StudyInstanceUID, SeriesInstanceUID) => {
      return new Promise((resolve, reject) => {
        // Reject because of Quality. (Seems the most sensible out of the options)
        // const CodeValueAndCodeSchemeDesignator = `113001%5EDCM`;
        // const url = `${wadoRest}/series/${SeriesInstanceUID}`;
        let hexStr = sha1([PatientID, StudyInstanceUID, SeriesInstanceUID].join("|"));
        for (let i = 4; i > 0; i--) {
          hexStr = hexStr.slice(0, i * 8) + '-' + hexStr.slice(i * 8);
        }
        const url = `${wadoRest}/series/${hexStr}`;

        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url, true);

        //Send the proper header information along with the request
        // TODO -> Auth when we re-add authorization.

        console.log(xhr);

        xhr.onreadystatechange = function () {
          //Call a function when the state changes.
          if (xhr.readyState == 4) {
            switch (xhr.status) {
              case 200:
                resolve(xhr.responseText);

                break;
              case 404:
                reject('Your dataSource does not support reject functionality');
            }
          }
        };
        xhr.send();
      });
    },
  };
}
