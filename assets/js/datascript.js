const beam = document.getElementById("beam");
const weightsContainer = document.getElementById("weightsContainer");
const infoBox = document.getElementById("infoBox");

let angle = 0;

let activeFactors = [];

function addFactor(title, text, color){

  const exists = activeFactors.find(
    f => f.title === title
  );

  if(exists){
    return;
  }

  activeFactors.push({
    title,
    text,
    color
  });

  /* CREATE WEIGHT */

  const weight = document.createElement("div");

  weight.classList.add("weight");
  weight.classList.add(color);

  weight.innerText = title;

  weightsContainer.appendChild(weight);

  setTimeout(() => {
    weight.classList.add("show");
  }, 100);

  /* ROTATE SCALE */

  angle += 4;

  beam.style.transform =
  `rotate(${angle}deg)`;

  /* UPDATE INFO */

  infoBox.innerHTML = `
    <h2>${title}</h2>
    <p>${text}</p>
  `;

  /* REMOVE WEIGHT */

  weight.addEventListener("click", () => {

    weight.remove();

    activeFactors = activeFactors.filter(
      f => f.title !== title
    );

    angle -= 4;

    if(angle < 0){
      angle = 0;
    }

    beam.style.transform =
    `rotate(${angle}deg)`;

    if(activeFactors.length === 0){

      infoBox.innerHTML = `
        <h2>Klicka på en faktor</h2>
        <p>
          När du klickar på faktorerna läggs de till på vågen för att visa
          att löneskillnaden påverkas av flera olika saker tillsammans.
        </p>
      `;

    }

  });

}


//Pie

const factors = ["Lågavlönade sektorer", "Föräldraledighet", "Deltid", "Övrigt"];
const data_array = [25, 33, 28, 14];

const pieChart = document.getElementById('pie-chart');

const myChart = new Chart(pieChart, {
    type: 'pie',

    data: {
        labels: factors,

        datasets: [
            {
                data: data_array,

                backgroundColor: [
                    'rgb(180, 165, 230)',
                    'rgb(220, 140, 170)',
                    'rgb(120, 154, 190)',
                    'rgb(230, 190, 160)'
                ]
            }
        ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 14
                },

                formatter: (value, context) => {

                    const total = context.chart.data.datasets[0].data
                        .reduce((a, b) => a + b, 0);

                    const percentage = ((value / total) * 100).toFixed(0);

                    let label = context.chart.data.labels[context.dataIndex];

                    // Gör radbrytning för lång label
                    if (label === "Lågavlönade sektorer") {
                        label = ["Lågavlönade", "sektorer"];
                    }

                    return [label, `${percentage}%`];
                }
            }
        }
    },

    plugins: [ChartDataLabels]
});