let tourismChart = null;

const filters = {
  destination: document.getElementById("destination"),
  age: document.getElementById("age"),
  tripType: document.getElementById("tripType"),
  measure: document.getElementById("measure"),
};

const statusElement = document.getElementById("status");

// Naložimo možnosti za filtre
async function loadOptions() {
  const response = await fetch("/api/options");

  if (!response.ok) {
    throw new Error("Failed to load filter options");
  }

  const options = await response.json();

  fillSelect(filters.destination, options.destinations, "Tujina");
  fillSelect(filters.age, options.ages, "Starost - SKUPAJ");
  fillSelect(
    filters.tripType,
    options.trip_types,
    "Turistična potovanja - SKUPAJ",
  );
  fillSelect(filters.measure, options.measures, "Potovanja (v 1000)");
}

// Napolnimo spustni seznam
function fillSelect(select, values, defaultValue) {
  select.innerHTML = "";

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });

  if (values.includes(defaultValue)) {
    select.value = defaultValue;
  }
}

// Pridobimo filtrirane podatke
async function loadStatistics() {
  statusElement.textContent = "Loading statistics...";

  const params = new URLSearchParams({
    destination: filters.destination.value,
    age: filters.age.value,
    trip_type: filters.tripType.value,
    measure: filters.measure.value,
  });

  try {
    const response = await fetch(`/api/statistics?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to load statistics");
    }

    const result = await response.json();

    drawChart(result.data, result.measure);

    statusElement.textContent = result.data.length
      ? ""
      : "No data available for the selected filters.";
  } catch (error) {
    statusElement.textContent = error.message;
  }
}

// Narišemo grafikon
function drawChart(data, measure) {
  const years = data.map((item) => item.year);
  const values = data.map((item) => item.value);

  if (tourismChart) {
    tourismChart.destroy();
  }

  const canvas = document.getElementById("tourismChart");

  tourismChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: measure,
          data: values,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          borderWidth: 3,
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Inicializacija strani
async function initialize() {
  try {
    await loadOptions();
    await loadStatistics();

    Object.values(filters).forEach((select) => {
      select.addEventListener("change", loadStatistics);
    });
  } catch (error) {
    statusElement.textContent = error.message;
  }
}

initialize();
