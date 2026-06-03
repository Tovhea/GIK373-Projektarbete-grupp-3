// Sandra Eriksson Gustav Westman Tove Hübinette

// Våg

const beam = document.getElementById("beam");
const weightsContainer = document.getElementById("weightsContainer");
const infoBox = document.getElementById("infoBox");

let angle = 0;

let activeFactors = [];

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('active');
  });
});

function addFactor(title, text, color){

  const exists = activeFactors.find(
    f => f.title === title
  );

  if(exists){
    const weight = [...weightsContainer.children].find(
    w => w.innerText === title
  );

  if (weight) {
    weight.remove();
  }

  activeFactors = activeFactors.filter(
    f => f.title !== title
  );

  angle -= 4;

  if (angle < 0) {
    angle = 0;
  }

  beam.style.transform = `rotate(${angle}deg)`;

  if (activeFactors.length === 0) {
    infoBox.innerHTML = `
      <h2>Klicka på en faktor</h2>
      <p>
        När du klickar på faktorerna läggs de till på vågen för att visa
        att löneskillnaden påverkas av flera olika saker tillsammans.
      </p>
    `;
  }

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

}