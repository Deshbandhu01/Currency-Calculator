// New API Key
const BASE_URL = "https://v6.exchangerate-api.com/v6/d34dc1d977629074b1b17921/latest"; // API URL

// Get elements from DOM
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate the dropdown with currency codes from countryList (from your codes.js)
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections for USD and INR
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  // Update flag when currency is changed
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update the exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Set to 1 if the input is empty or less than 1
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Prepare the URL to fetch exchange rate from ExchangeRate-API
  const URL = `${BASE_URL}/${fromCurr.value}`;

  try {
    // Fetch the exchange rate from the API
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Unable to fetch exchange rate. Response was not OK.");
    }

    // Parse the JSON response
    let data = await response.json();

    // Check if the response contains the exchange rate data
    if (data.result !== "success") {
      throw new Error("Failed to retrieve exchange rates from the API.");
    }

    // Get the exchange rate from the API response
    let rate = data.conversion_rates[toCurr.value];

    // If rate is undefined, it might mean the conversion rate is not available for the selected "to" currency
    if (!rate) {
      throw new Error(`Conversion rate for ${toCurr.value} is not available.`);
    }

    // Calculate the converted amount
    let finalAmount = amtVal * rate;

    // Display the result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    // Handle any errors that occur
    console.error("Error:", error);
    msg.innerText = `Error: ${error.message}`;
  }
};

// Function to update the flag image based on the selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for the "Get Exchange rate" button
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Trigger the exchange rate calculation when the page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});
