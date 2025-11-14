exports.handler = async function () {
  try {
    const API_KEY = process.env.API_KEY;
    const SHEET_ID = process.env.SHEET_ID;
    console.log("Using Sheet ID:", SHEET_ID);
    console.log("Using API Key:", API_KEY);

    const RANGE = "Sheet1!A:AY";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    // fetch native dari Netlify (Node 18)
    const response = await fetch(url);
    const json = await response.json();

    if (!json.values) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No data returned", raw: json })
      };
    }
    const rows = json.values;
    const header = rows[0];

    const data = rows.slice(1).map((r) => {
      let obj = {};
      header.forEach((h, i) => (obj[h] = r[i] || ""));
      return obj;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() })
    };
  }
};
