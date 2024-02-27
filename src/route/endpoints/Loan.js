require("dotenv").config();
const fs = require("fs");
const path = "test-data/loans.json";
const { tokenCallback } = require("../functions");
const { verifyToken } = tokenCallback();

let routes = (app) => {
  app.get("/loans", async (req, res) => {
    const status = req.query.status || "";

    try {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          console.error("Error while reading the file:", err);
          return;
        }
        try {
          const data2 = [data];
          const correctedData = JSON.parse(...data2);
          const fetechedData = correctedData.filter((a, b) => {
            if (a.status.includes(status)) {
              return a;
            }
          });
          res.send(fetechedData);
        } catch (err) {
          console.error("Error while parsing JSON data:", err);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/loans/:userEmail/get", async (req, res) => {
    try {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          console.error("Error while reading the file:", err);
          return;
        }
        try {
          const data2 = [data];
          const correctedData = JSON.parse(...data2);
          const fetechedData = correctedData.filter((a, b) => {
            if (a.applicant.email.includes(req.params.userEmail)) {
              return a;
            }
          });
          const convertLoanData = fetechedData.map((a, b) => {
            return a.applicant.totalLoan;
          });

          res.send(convertLoanData);
        } catch (err) {
          console.error("Error while parsing JSON data:", err);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/loans/expired", async (req, res) => {
    try {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          console.error("Error while reading the file:", err);
          return;
        }
        try {
          const data2 = [data];
          const correctedData = JSON.parse(...data2);
          const fetechedData = correctedData.filter((a, b) => {
            const first10 = a.maturityDate.substring(0, 10);
            const firstDate = new Date(first10);
            const secondDate = new Date();
            const timeDifference = secondDate.getTime() - firstDate.getTime();
            let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

            if (differentDays > 1) {
              return a;
            }
          });
          res.send(fetechedData);
        } catch (err) {
          console.error("Error while parsing JSON data:", err);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/loans/:loanId/delete", async (req, res) => {
    const responses = verifyToken({ authToken: req.header("authorization") });
    if (responses) {
      const loanId = req.params.loanId;

      try {
        fs.readFile(path, "utf8", (err, data) => {
          if (err) {
            console.error("Error while reading the file:", err);
            return;
          }
          try {
            const data2 = [data];
            const correctedData = JSON.parse(...data2);
            const fetechedData = correctedData.map((a, b) => {
              if (a.id.includes(loanId)) {
                return { ...a, number: b };
              } else {
                return a;
              }
            });

            const fetechedData2 = fetechedData.filter((a, b) => {
              if (a.id.includes(loanId)) {
                return a;
              }
            });
            if (fetechedData2.length === 0) {
              res.send("Data already deleted");
            } else {
              var element = correctedData.splice(fetechedData2[0].number, 1);
              delete element;
              fs.writeFileSync(
                path,
                JSON.stringify(correctedData, null, 4),
                "utf8"
              );
              res.end(loanId + " was deleted");
              console.log(JSON.stringify(correctedData, null, 4));
            }
          } catch (err) {
            console.error("Error while parsing JSON data:", err);
          }
        });
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
    }
  });
};

module.exports = routes;
