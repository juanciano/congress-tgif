$(function () {

    var app = new Vue({
        el: '#app',
        data: {
            members: [],
            membersOrig: [],
            states: [],
            statistics: {
                members: [],
                democrats: [],
                republicans: [],
                independents: [],
                democratsVoteWithParty: 0,
                republicansVoteWithParty: 0,
                independentsVoteWithParty: 0,
                leastEngage: [],
                mostEngage: [],
                mostLoyal: [],
                leastLoyal: [],
            }
        }
    });


    var myHeaders = new Headers();
    myHeaders.append("X-API-Key", "jKP6NOEBtLq4vV4LnsI4Ij86z2YsUeIFCoJDxzeo");

    var myInit = {
        method: 'GET',
        headers: myHeaders
    };

    fetchJson('https://api.propublica.org/congress/v1/113/house/members.json', myInit)
        .then(function (json) {
            app.members = json.results[0].members;
            app.statistics.members = json.results[0].members;
            app.membersOrig = app.members;
            app.states = states()
            addEvents()
            getData()
        });

    function getData() {
        app.statistics.democrats = app.statistics.members.filter(function (member) {
            return member.party == 'D';
        });

        app.statistics.republicans = app.statistics.members.filter(function (member) {
            return member.party == 'R';
        });

        app.statistics.independents = app.statistics.members.filter(function (member) {
            return member.party == 'I';
        });
           var democratsVoteWithPartyTotal = 0;
           app.statistics.democrats.forEach(function (member) {
               democratsVoteWithPartyTotal += member.votes_with_party_pct;
           });

           app.statistics.democratsVoteWithParty = (democratsVoteWithPartyTotal / app.statistics.democrats
               .length).toFixed(2);

           var republicansVoteWithPartyTotal = 0;
           app.statistics.republicans.forEach(function (member) {
               republicansVoteWithPartyTotal += member.votes_with_party_pct;
           });

           app.statistics.republicansVoteWithParty = (republicansVoteWithPartyTotal /
               app.statistics.republicans.length).toFixed(2);

           var independentsVoteWithPartyTotal = 0;
           app.statistics.independents.forEach(function (member) {
               independentsVoteWithPartyTotal += member.votes_with_party_pct;
           });
           
           app.statistics.independentsVoteWithParty = (independentsVoteWithPartyTotal /
            app.statistics.independents.length).toFixed(2);
            if (app.statistics.independentsVoteWithParty == "NaN"){
                app.statistics.independentsVoteWithParty = 0;
            }

           var memberNumber = app.statistics.members.length / 10;
           var mamberOrderAsc = app.statistics.members.sort(function (a, b) {
               if (a.votes_with_party_pct < b.votes_with_party_pct)
                   return -1;
               if (a.votes_with_party_pct > b.votes_with_party_pct)
                   return 1;
               if (a.votes_with_party_pct == b.votes_with_party_pct)
                   return 0;
           });
           app.statistics.leastEngage = mamberOrderAsc.slice(0, memberNumber - 1);
           app.statistics.mostEngage = mamberOrderAsc.slice(mamberOrderAsc.length - memberNumber, mamberOrderAsc.length - 1);

           mamberOrderAsc = app.    statistics.members.sort(function (a, b) {
               if (a.missed_votes_pct < b.missed_votes_pct)
                   return -1;
               if (a.missed_votes_pct > b.missed_votes_pct)
                   return 1;
               if (a.missed_votes_pct == b.missed_votes_pct)
                   return 0;
           });

           app.statistics.leastLoyal = mamberOrderAsc.slice(0, memberNumber - 1);
           app.statistics.mostLoyal = mamberOrderAsc.slice(mamberOrderAsc.length - memberNumber, mamberOrderAsc.length - 1);
    }

    function states() {
        var array = []
        array.push("All");
        for (i = 0; i < app.members.length; i++) {

            if (array.indexOf(app.members[i].state) == -1) {
                array.push(app.members[i].state)
            }
        }
        return array.sort()
    }

    function filterMembers() {
        return app.membersOrig.filter(applyFilter);
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

    function addEvents() {
        if (document.getElementById("R") != null)
            document.getElementById("R").addEventListener("click", function () {
                app.members = filterMembers()
            });

        if (document.getElementById("D") != null)
            document.getElementById("D").addEventListener("click", function () {
                app.members = filterMembers()
            });

        if (document.getElementById("I") != null)
            document.getElementById("I").addEventListener("click", function () {
                app.members = filterMembers()
            });

        if (document.getElementById("states") != null)
            document.getElementById("states").addEventListener("change", function () {
                app.members = filterMembers()
            });
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
