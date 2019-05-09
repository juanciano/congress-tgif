$(function () {

  var data = '';

  var myHeaders = new Headers();
  myHeaders.append("X-API-Key", "jKP6NOEBtLq4vV4LnsI4Ij86z2YsUeIFCoJDxzeo");

  var myInit = {
    method: 'GET',
    headers: myHeaders
  };

  fetchJson('https://api.propublica.org/congress/v1/113/house/members.json', myInit)
    .then(function (json) {
      data = json;
      getData();
    });

  function getData() {
    //var senate = JSON.stringify(data, null, 2);

    //document.getElementById("senate_data").innerHTML = senate

    document.getElementById("house_data").innerHTML = data.results[0].members.map(
      senador => "<tr><td>" + senador.first_name + " " + senador.last_name +
      "</td><td>" + senador.party + "</td><td>" + senador.state + "</td><td>" +
      senador.seniority + "</td><td>" + senador.votes_with_party_pct +
      " %</td></tr>").join("")

    document.getElementById("house_data").innerHTML = data.results[0].members.map(
      senador => "<tr><td><a href='" + senador.url + "'>" + senador.first_name +
      " " + senador.last_name + "</a></td><td>" + senador.party + "</td><td>" +
      senador.state + "</td><td>" + senador.seniority + "</td><td>" + senador.votes_with_party_pct +
      " %</td></tr>").join("")

    /*tabla usando el FOR*/
    var members = data.results[0].members
    var tableData = ""
    for (i = 0; i < members.length; i++) {
      tableData += "<tr><td><a href='" + members[i].url + "'>" + members[i].first_name +
        " " + members[i].last_name + "</a></td><td>" + members[i].party +
        "</td><td>" + members[i].state + "</td><td>" + members[i].seniority +
        "</td><td>" + members[i].votes_with_party_pct + " %</td></tr>"
    }
    document.getElementById("house_data").innerHTML = tableData

    function filterMembers() {
      return members.filter(applyFilter).map(
        senador => "<tr><td><a href='" + senador.url + "'>" + senador.first_name +
        " " + senador.last_name + "</a></td><td>" + senador.party + "</td><td>" +
        senador.state + "</td><td>" + senador.seniority + "</td><td>" + senador.votes_with_party_pct +
        " %</td></tr>").join("")
    }

    function applyFilter(member) {
      var checked = Array.from(document.querySelectorAll(
        "input[name=party]:checked")).map(checkbox => checkbox.value)
      var selected = document.getElementById("states");
      selected = selected.options[selected.selectedIndex].value;
      if ((checked.indexOf(member.party) > -1) && (selected == "All")) {
        return member
      } else if ((checked.indexOf(member.party) > -1) && (member.state == selected)) {
        return member
      }
    }

    document.getElementById("R").addEventListener("click", function () {
      document.getElementById("house_data").innerHTML = filterMembers()
    });

    document.getElementById("D").addEventListener("click", function () {
      document.getElementById("house_data").innerHTML = filterMembers()
    });

    document.getElementById("I").addEventListener("click", function () {
      document.getElementById("house_data").innerHTML = filterMembers()
    });

    document.getElementById("states").addEventListener("change", function () {
      document.getElementById("house_data").innerHTML = filterMembers()
    });

    function states() {
      var array = []
      for (i = 0; i < members.length; i++) {

        if (array.indexOf(members[i].state) == -1) {
          array.push(members[i].state)
        }
      }
      return array.sort()
    }

    var text = ""
    var arrayStates = states()

    for (i = 0; i < arrayStates.length; i++) {
      text += '<option value="' +
        arrayStates[i] +
        '">' + arrayStates[i] + '</option>';
    }

    document.getElementById("states").innerHTML =
      "<option value='All'>All</option>" + text;
  }

  function fetchJson(url, init) {
    return fetch(url, init)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      });
  }

});
