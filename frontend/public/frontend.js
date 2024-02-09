function addDataset() {
	const id = document.getElementById('idInput').value;
	const kind = document.getElementById('kindSelect').value;
	const data = document.getElementById('dataTextarea').value;

	fetch('http://localhost:4321/dataset/' + id + '/' + kind, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: data,
	})
	.then(response => response.json())
	.then(result => {
		document.getElementById('addResult').innerText = 'Result: ' + JSON.stringify(result);
	})
	.catch(error => document.getElementById('addError').innerText = 'Error:' + error);
}

function removeDataset() {
	const id = document.getElementById('removeIdInput').value;

	fetch('http://localhost:4321/dataset/' + id, {
		method: 'DELETE',
	})
	.then(response => response.json())
	.then(result => {
		document.getElementById('removeResult').innerText = 'Result: ' + JSON.stringify(result);
	})
	.catch(error => document.getElementById('removeError').innerText = 'Error:' + error);
}

function listDatasets() {
	fetch('http://localhost:4321/datasets')
	.then(response => response.json())
	.then(result => {
		document.getElementById('listResult').innerText = 'Result: ' + JSON.stringify(result);
	})
	.catch(error => document.getElementById('listError').innerText = 'Error:' + error);
}

function performQuery() {
	const query = document.getElementById('queryInput').value;

	fetch('http://localhost:4321/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: query,
	})
	.then(response => response.json())
	.then(result => {
		document.getElementById('queryResult').innerText = 'Result: ' + JSON.stringify(result);
	})
	.catch(error => document.getElementById('queryError').innerText = 'Error:' + error);
}
  
function openTab(evt, tabName) {
	// Declare all variables
	var i, tabcontent, tablinks;
  
	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
  
	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
  
	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
  } 