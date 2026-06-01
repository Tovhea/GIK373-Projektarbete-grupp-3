console.log(Plotly);

const MapUrl =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0110/AM0110A/LonYrkeRegion4AN";

const MapQuery = {
  query: [
    {
      code: "Region",
      selection: {
        filter: "item",
        values: [
          "SE11",
          "SE12",
          "SE21",
          "SE22",
          "SE23",
          "SE31",
          "SE32",
          "SE33",
        ],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["000007AR"],
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
    format: "JSON",
  },
};

const regionNames = {
  SE11: "Stockholm",
  SE12: "Östra Mellansverige",
  SE21: "Småland med öarna",
  SE22: "Sydsverige",
  SE23: "Västsverige",
  SE31: "Norra Mellansverige",
  SE32: "Mellersta Norrland",
  SE33: "Övre Norrland",
};

const request = new Request(MapUrl, {
  method: "POST",
  body: JSON.stringify(MapQuery),
});

fetch(request)
  .then((response) => response.json())
  .then((data) => printMapData(data));

function printMapData(data) {
  console.log(data);

  const regions = data.data.map((item) => item.key[0]);

  const values = data.data.map((item) => Number(item.values[0]));

  const plotData = [
    {
      type: "choroplethmap",
      locations: regions,
      z: values,
      geojson:
        "https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/nutsrg_2.json",
      featureidkey: "properties.id",

      text: regions.map((r) => regionNames[r]),
      hovertemplate: "%{text}: %{z} %<extra></extra>",

      colorscale: [
        [0, "rgb(84, 167, 255)"],
        [0.5, "rgb(75, 0, 130)"],
        [1, "rgb(255, 94, 196)"],
      ],

      colorbar: {
        title: {
          text: "Löneskillnad (%)",
          font: {
            family: "Open Sans",
            size: 14,
          },
        },
      },
    },
  ];

  const layout = {
        title: {
      text: "Löneskillnad mellan män och kvinnor i olika regioner",
      font: {
        family: "Open Sans",
        size: 16,
      },
    },
    map: { center: { lon: 15, lat: 62 }, zoom: 3 },
    width: 800,
    height: 700,
  };

  Plotly.newPlot("Map", plotData, layout);
}
