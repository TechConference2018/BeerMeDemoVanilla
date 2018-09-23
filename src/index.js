require("./style.scss");

document.addEventListener("DOMContentLoaded", function(event) {
  document.forms[0].addEventListener("submit", searchBreweries);
  document.getElementById("clearBtn").addEventListener("click", clearForm)
  getBreweries();
});

function searchBreweries(event) {
  event.preventDefault();
  var params = "",
    name = event.srcElement[0].value && "by_name=" + event.srcElement[0].value,
    state = event.srcElement[1].value && "by_state=" + event.srcElement[1].value;
  if (!!name && !!state) params = name + "&" + state;
  else if (!!name) params = name;
  else if (!!state) params = state;
  getBreweries(params);
}

function getBreweries(params) {
  toggleLoading();
  var http = new XMLHttpRequest();
  http.open("GET", "https://api.openbrewerydb.org/breweries?" + params, true);
  http.onreadystatechange = function() {
    if (http.readyState == 4) {
      buildBreweryList(JSON.parse(http.responseText));
      toggleLoading();
    }
  };
  http.send();
}

function buildBreweryList(breweries) {
  var list = document.getElementById("breweryList"),
    i = 0,
    len = breweries.length;
  list.innerHTML = "";
  if (len > 0) toggleNoBreweries();
  for (; i < len; i++) {
    var brew = breweries[i],
      // create needed elements
      item = document.createElement("li"),
      type = document.createElement("span"),
      name = document.createElement("h2"),
      street = document.createElement("span"),
      city = document.createElement("span"),
      state = document.createElement("span"),
      address = document.createElement("p"),
      website = document.createElement("p"),
      url = document.createElement("a");
    // add content
    type.textContent = brew.brewery_type;
    type.className = "marker";
    name.textContent = brew.name + " ";
    street.textContent = brew.street;
    city.textContent = brew.city + ", ";
    state.textContent = brew.state;
    url.textContent = "Visit online...";
    url.className = "more-link";
    url.href = brew.website_url;
    // append html
    name.appendChild(type);
    address.appendChild(street);
    address.appendChild(document.createElement("br"));
    address.appendChild(city);
    address.appendChild(state);
    website.appendChild(url);
    item.appendChild(name);
    item.appendChild(address);
    item.appendChild(website);
    list.appendChild(item);
  }
}

function clearForm() {
  document.forms[0][0].value = '';
  document.forms[0][1].value = '';
}

var isLoading = false;
function toggleLoading() {
  isLoading = !isLoading;
  document.getElementById("loading").style.display = isLoading ? "block" : "none";
}

var noBreweries = true;
function toggleNoBreweries() {
  noBreweries = !noBreweries;
  document.getElementById("noBreweries").style.display = noBreweries ? "block" : "none";
}
