// Visualisering av lönegapet mellan män och kvinnor,
// alla sektorer i hela sverige 2014-2022

const urlSCB =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0110/AM0110A/LonYrkeRegion4A";

const querySCB = {
  query: [
    {
      code: "Region",
      selection: {
        filter: "item",
        values: ["SE"],
      },
    },
    {
      code: "Kon",
      selection: {
        filter: "item",
        values: ["1", "2"],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["000000BW"],
      },
    },
  ],
  response: {
    format: "json",
  },
};

const request = new Request(urlSCB, {
  method: "POST",
  body: JSON.stringify(querySCB),
});

fetch(request)
  .then((response) => response.json())
  .then((data) => printSCBChart(data));

function printSCBChart(dataSCB) {
  console.log(dataSCB);

  const allData = dataSCB.data;
  console.log(allData);

  const men = allData.filter((item) => item.key[1] === "1");

  const women = allData.filter((item) => item.key[1] === "2");

  const labels = men.map((year) => year.key[2]);
  console.log(labels);

  const menData = men.map((item) => Number(item.values[0]));

  const womenData = women.map((item) => Number(item.values[0]));

  const datasets = [
    {
      label: "Lön för män",
      data: menData,
      borderWidth: 2.5,
      borderColor: "rgb(84, 167, 255)",
      backgroundColor: "rgb(84, 167, 255)",
      hoverBorderWidth: 4,
      pointRadius: 1.3,
    },
    {
      label: "Lön för kvinnor",
      data: womenData,
      borderWidth: 2.5,
      borderColor: "rgb(255, 94, 196)",
      backgroundColor: "rgb(255, 94, 196)",
      hoverBorderWidth: 4,
      pointRadius: 1.3,
    },
  ];

  new Chart(document.getElementById("scb"), {
    type: "line",

    data: { labels, datasets },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 4,
            boxHeight: 4,
            font: {
              family: "Open Sans",
              size: 12
            }
          }
        } 
      },

      scales: {
        x: {
          ticks: {
            padding: 15,
            font: {
              family: "Open Sans",
              size: 10,
            },
            minRotation: 45,
            maxRotation: 45,
          },
          grid: {
            drawOnChartArea: false,
            drawTicks: true,
            tickLength: -7,
          },
        },

        y: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "Open Sans",
              size: 10,
            },
          },
        },
      },
    },
  });
}

//

const urlSCB4 =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/LE/LE0201/LE0201EKO/Tema28";

const querySCB4 = {
  query: [
    {
      code: "Franvorandel",
      selection: {
        filter: "item",
        values: ["tot"],
      },
    },
    {
      code: "UtbildningsNiva",
      selection: {
        filter: "item",
        values: ["40"],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["0000035W"],
      },
    },
    {
      code: "Tid",
      selection: {
        filter: "item",
        values: [
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021",
          "2022",
        ],
      },
    },
  ],
  response: {
    format: "json",
  },
};

const request4 = new Request(urlSCB, {
  method: "POST",
  body: JSON.stringify(querySCB),
});

const request45 = new Request(urlSCB4, {
  method: "POST",
  body: JSON.stringify(querySCB4),
});

Promise.all([
  fetch(request4).then((res) => res.json()),
  fetch(request45).then((res) => res.json()),
]).then(([data1, data2]) => {
  printSCB4Chart(data1, data2);
});

function printSCB4Chart(data1, data2) {
  console.log(data1, data2);

  const allData = data1.data;
  console.log(allData);

  const men = allData.filter((item) => item.key[1] === "1");

  const women = allData.filter((item) => item.key[1] === "2");

  const labels = men.map((year) => year.key[2]);
  console.log(labels);

  const menData = men.map((item) => Number(item.values[0]));

  const womenData = women.map((item) => Number(item.values[0]));

  const womenPerMen = womenData.map((womenValue, i) => {
    return womenValue / menData[i];
  });
  console.log(womenPerMen);

  const allData2 = data2.data;
  console.log(allData2);

  const men2 = allData2.filter((item) => item.key[2] === "1");

  const women2 = allData2.filter((item) => item.key[2] === "2");

  const menData2 = men2.map((item) => Number(item.values[0]));

  const womenData2 = women2.map((item) => Number(item.values[0]));

  const menPerWomen = menData2.map((menValue, i) => {
    return menValue / womenData2[i];
  });
  console.log(menPerWomen);

  const datasets = [
    {
      label: "",
      data: womenPerMen,
      borderWidth: 2,
      borderColor: "rgb(255, 94, 196)",
      hoverBorderWidth: 4,
    },
    {
      label: "",
      data: menPerWomen,
      borderWidth: 2,
      borderColor: "rgb(153, 0, 82)",
      hoverBorderWidth: 4,
    },
  ];

  //
  const scatterData = womenPerMen.map((value, i) => {
    return {
      x: value,
      y: menPerWomen[i],
    };
  });

  function linearRegression(data) {
    let n = data.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0;

    data.forEach((p) => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
    });

    let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    let intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  const { slope, intercept } = linearRegression(scatterData);

  const minX = Math.min(...scatterData.map((p) => p.x));
  const maxX = Math.max(...scatterData.map((p) => p.x));

  const trendLine = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];

  //corelation som skrivs ut i console.log
  function pearsonCorrelation(data) {
    let n = data.length;

    let sumX = 0,
      sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    data.forEach((p) => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
      sumY2 += p.y * p.y;
    });

    const numerator = n * sumXY - sumX * sumY;

    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
    );

    return numerator / denominator;
  }
  const r = pearsonCorrelation(scatterData);

  console.log("Correlation coefficient (r):", r);

  new Chart(document.getElementById("scb4"), {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Korrelation (data punkter)",
          data: scatterData,
          backgroundColor: "rgb(255, 94, 196)",
          pointRadius: 5,
        },
        {
          label: "Trendlinje",
          backgroundColor: "transparent",
          data: trendLine,
          type: "line",
          borderColor: "indigo",
          borderWidth: 2,
          pointRadius: 0,
          showLine: true,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text:
            "Korrelation mellan kvinnors lön i relation till mäns och mäns uttag i relation till kvinnors.\nKorrelationen är " +
            r.toFixed(2),
          font: {
            family: "Open Sans",
            size: 12,
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Kvinnors lön i relation till mäns",

            font: {
              family: "Open Sans",
              size: 10,
              weight: "bold",
            },
          },
        },

        y: {
          title: {
            display: true,
            text: "Mäns uttag / kvinnors uttag",

            font: {
              family: "Open Sans",
              size: 10,
              weight: "bold",
            },
          },
        },
      },
    },
  });
}

//

const urlSCB2 =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110A/SamForvInk1";

const querySCB2 = {
  query: [
    {
      code: "Kon",
      selection: {
        filter: "item",
        values: ["1", "2"],
      },
    },
    {
      code: "Alder",
      selection: {
        filter: "item",
        values: ["tot16+"],
      },
    },
    {
      code: "Inkomstklass",
      selection: {
        filter: "item",
        values: [
          "1-19",
          "20-39",
          "40-59",
          "60-79",
          "80-99",
          "100-119",
          "120-139",
          "140-159",
          "160-179",
          "180-199",
          "200-219",
          "220-239",
          "240-259",
          "260-279",
          "280-299",
          "300-319",
          "320-339",
          "340-359",
          "360-379",
          "380-399",
          "400-499",
          "500-599",
          "600-799",
          "800-999",
          "1000+",
        ],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["HE0110J9"],
      },
    },
    {
      code: "Tid",
      selection: {
        filter: "item",
        values: ["2024"],
      },
    },
  ],
  response: {
    format: "json",
  },
};

const request2 = new Request(urlSCB2, {
  method: "POST",
  body: JSON.stringify(querySCB2),
});

fetch(request2)
  .then((response) => response.json())
  .then((data) => printSCB2Chart(data));

function printSCB2Chart(dataSCB) {
  console.log(dataSCB);

  const allData = dataSCB.data;
  console.log(allData);

  const groupedData = [
    { label: "1-259 tkr", indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { label: "260-379 tkr", indexes: [13, 14, 15, 16, 17] },
    { label: "380-499 tkr", indexes: [18, 19] },
    { label: "500-799 tkr", indexes: [20, 21] },
    { label: "800+ tkr", indexes: [22, 23] },
  ];

  const men = allData.filter((item) => item.key[0] === "1");

  const women = allData.filter((item) => item.key[0] === "2");

  const labels = groupedData.map((group) => group.label);

  const menData = groupedData.map((group) =>
    group.indexes.reduce((sum, i) => sum + Number(men[i].values[0]), 0),
  );

  const womenData = groupedData.map((group) =>
    group.indexes.reduce((sum, i) => sum + Number(women[i].values[0]), 0),
  );

  const datasets = [
    {
      label: "Antal Män",
      data: menData,
      borderWidth: 2,
      borderColor: "rgb(84, 167, 255)",
      backgroundColor: "rgb(84, 167, 255)",
      hoverBorderWidth: 4,
    },
    {
      label: "Antal Kvinnor",
      data: womenData,
      borderWidth: 2,
      borderColor: "rgb(255, 94, 196)",
      backgroundColor: "rgb(255, 94, 196)",
      hoverBorderWidth: 4,
    },
  ];

  new Chart(document.getElementById("scb2"), {
    type: "bar",
    data: { labels, datasets },

    options: {
      plugins: {
        legend: {
          position: "top",

          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 4,
            boxHeight: 4,
            font: {
              family: "Open Sans",
              size: 14,
              weight: "bold",
            },
          },
        },
      },

      scales: {
        x: {
          ticks: {
            padding: 15,
            font: {
              family: "Open Sans",
              size: 12,
            },
          },
          grid: {
            drawOnChartArea: false,
          },
        },

        y: {
          grid: {
            drawOnChartArea: true,
          },
          ticks: {
            font: {
              family: "Open Sans",
              size: 10,
            },
          },
        },
      },
    },
  });
}

//

const urlSCB3 =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/LE/LE0201/LE0201EKO/Tema210";

const querySCB3 = {
  query: [
    {
      code: "Sektor",
      selection: {
        filter: "item",
        values: ["JAM900"],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["000002V5", "000002V4", "000002V3", "000002V6", "000002V7"],
      },
    },
    {
      code: "Tid",
      selection: {
        filter: "item",
        values: ["2024"],
      },
    },
  ],
  response: {
    format: "json",
  },
};

const request3 = new Request(urlSCB3, {
  method: "POST",
  body: JSON.stringify(querySCB3),
});

fetch(request3)
  .then((response) => response.json())
  .then((data) => printSCB3Chart(data));

function printSCB3Chart(dataSCB) {
  const allData = dataSCB.data;

  // Hitta rätt rader för män och kvinnor
  const menItem = allData.find((item) => item.key[1] === "1");
  const womenItem = allData.find((item) => item.key[1] === "2");

  const men = menItem.values.map(Number);
  const women = womenItem.values.map(Number);

  // 📊 Räkna ut procenten (Kvinnor / Män * 100)
  const percentages = men.map((m, i) => (women[i] / m) * 100);

  // 🏷️ Etiketter som matchar ordningen på ContentsCode ovan
  //const labels = ['10th', '25th', '50th', '75th', '90th'];

  const percentilNamn = {
    "000002V5": "10:e percentilen", // Ändrad till 10:e percentilen efter din uppdatering
    "000002V4": "25:e percentilen", // Ändrad till 25:e percentilen efter din uppdatering
    "000002V3": "50:e percentilen",
    "000002V6": "75:e percentilen", // Ändrad till 75:e percentilen efter din uppdatering
    "000002V7": "90:e percentilen",
  };

  // Hämta ordningen på koderna direkt från din querySCB3-variabel
  const koderAnvanda = querySCB3.query.find((q) => q.code === "ContentsCode")
    .selection.values;

  // Mappa koderna till sina respektive namn
  const labels = koderAnvanda.map((kod) => percentilNamn[kod] || kod);

  ("rgb(84, 167, 255)", "rgb(255, 94, 196)");

  // 📊 Ny Chart.js-inställning med FiveThirtyEight-stil
  new Chart(document.getElementById("scb3"), {
    type: "line",
    data: {
      labels: labels, // Kopplas till Y-axeln tack vare indexAxis: 'y'
      datasets: [
        {
          label: "Kvinnors lön i % av mäns 2024",
          data: percentages, // Tolkas som X-värden automatiskt
          borderColor: "rgb(255, 94, 196)", // FiveThirtyEight-röd
          backgroundColor: "rgba(255, 94, 196, 0.25)", // Rosa/röd fyllning för lönegapet
          fill: "end", // Fyller hela vägen ut till höger (mot 100%)
          borderWidth: 2.5,
          pointBackgroundColor: "rgb(255, 94, 196)",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              family: "Open Sans",
              size: 14,
              weight: "bold",
            },
          },
        },
      },
      scales: {
        x: {
          min: 70,
          max: 100,
          position: "top",

          grid: {
            drawBorder: false,

            color: function (MänLinje) {
              if (MänLinje.tick.value === 100) {
                return "rgb(84, 167, 255)";
              }
            },

            lineWidth: function (MänLinje) {
              if (MänLinje.tick.value === 100) {
                return 3;
              }
            },
          },
          ticks: {
            font: {
              family: "Open Sans",
              size: 10,
            },
            callback: function (value) {
              if (value === 100) return "100% (MÄN)";
              return value + "%";
            },
          },
        },
        y: {
          ticks: {
            font: {
              family: "Open Sans",
              size: 10,
            },
          },
        },
      },
    },
  });
}
