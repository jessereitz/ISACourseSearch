var modal = document.getElementById("regionModal");
var modalWindow = modal.querySelector(".modalWindow");
var mainSection = document.getElementById("mainSection");
var modalRegionSections = [];
var currentModalRegion;

function toggleModal(event) {
  modal.classList.toggle("hide");
}

// REQUIRES: modal is a modal, region is a region (africa, asia, etc)
// MODIFIES: modal
//  EFFECTS: if elements for given region haven't yet been created, will create that section
//            - updates modal window to display given region
function initializeModal(region) {
  let objIndex = containsObj(modalRegionSections, "name", region.name);
  if (objIndex !== false) {
    updateModalWindow(modalRegionSections[objIndex]);
    return;
  }

  createRegionSection(region);
  initializeModal(region);
}

//  EFFECTS: updates the modal to display given region
function updateModalWindow(region) {
  let modalTitle = modalWindow.querySelector("h1");
  modalTitle.textContent = region.name;
  if (currentModalRegion)
    modalWindow.removeChild(currentModalRegion.elements);
  currentModalRegion = region;
  modalWindow.appendChild(currentModalRegion.elements);
}


// Given a list of countries, will create a section element
//  containing h3 title and list of city links
function createRegionSection(region) {
  let regionSection = newEl("div", region.name, ["modalRegion"]);
  let countries = region.countries;

  for(let i = 0; i < countries.length; i++) {
    var currentCountry = countries[i];
    var href = "https://www.studiesabroad.com/programs/country/" + currentCountry.name.replace(" ", "_").toLowerCase() + "/city/";
    var countrySection = newEl("section", currentCountry.name, ["country"]);
    var sectionHeader = createHeading(currentCountry.name, 3);
    countrySection.appendChild(sectionHeader);

    // create list of cities
    var sectionList = document.createElement("ul");
    for(let j = 0; j < currentCountry.cities.length; j++) {
      let curCity = currentCountry.cities[j];
      let curhref = href + curCity.toLowerCase() + "/course_search";

      let curListItem = document.createElement("li");
      let curItemLink = createLink(curhref, curCity, true);

      curListItem.appendChild(curItemLink);
      sectionList.appendChild(curListItem);
    }


    countrySection.appendChild(sectionList);
    regionSection.appendChild(countrySection);
  }

  let newModalRegion = {
    name: region.name,
    elements: regionSection
  }
  modalRegionSections.push(newModalRegion);

}

// id and classes are optional
// creates returns an element of given type
function newEl(type, id, classes) {
  let el = document.createElement(type);
  if (id)
    el.setAttribute("id", id);
  if (classes.length > 0) {
    for(let i = 0; i < classes.length; i++) {
      el.classList.add(classes[i]);
    }
  }

  return el;
}

// REQUIRES: type is a number between 1 and 6
//  EFFECTS: creates a new heading element
function createHeading(text, type) {
  if (typeof type !== "number" || type <= 0 || type > 6) {
    return null;
  }
  type = "h" + type;
  let heading = document.createElement(type);
  heading.appendChild(document.createTextNode(text));
  return heading
}

// newTab is Boolean: true = target="_blank"
function createLink(href, text, newTab) {
  let link = document.createElement("a");
  link.setAttribute("href", href);
  if (newTab)
    link.setAttribute("target", "_blank");
  link.appendChild(document.createTextNode(text));
  return link;
}






///////////////////////////
/////     HELPERS     /////
///////////////////////////

// REQUIRES:
//  EFFECTS: returns index of object if there is an object in given array that has given attribute equal to given value
//          else returns false
function containsObj(arr, attr, val) {
  for(let i = 0; i < arr.length; i++) {
    if (arr[i][attr] == val) {
      return i;
    }
  }
  return false;
}











 ////////////////////////////
/////     LISTENERS     /////
/////////////////////////////

// Modal is already open:
// click on exit button || off-modal closes modal
modal.addEventListener("click", function (e) {
  targ = e.target;
  if (targ.classList.contains("exit") || targ.parentElement.classList.contains("exit") || targ == e.currentTarget) {
    toggleModal(e);
  }
})

mainSection.addEventListener("click", function (e) {
  if (e.target.classList.contains("regionOpen")) {
    e.preventDefault();
    switch(e.target.dataset.region) {
      case "Africa":
        initializeModal(africa);
        break;
      case "Asia":
        initializeModal(asia);
        break;
      case "Europe":
        initializeModal(europe);
        break;
      case "Latin America":
        initializeModal(latinAmerica);
        break;
      case "Pacific":
        initializeModal(pacific);
        break;
      default:
        return;
    }
    toggleModal(e);
  }
})
