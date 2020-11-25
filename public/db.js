let db;
// New db request for a "budget" database
const request = indexedDB.open("budget", 1);


// Create an object store for pending
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    // Check if app is online, if it is then it will read the DB
    if (navigator.onLine) {
        checkDatabase();
    }
};

// Will run if an error is detected
request.onerror = function(event) {
    console.log("Whoopsy Daisy!" + event.target.errorCode);
};

// Save a new record
function saveRecord(record) {
    // Create a new, pending transaction in DB with rewrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // Access pending object store
    const store = transaction.objectStore("pending");

    // Add record to store
    store.add(record);
};

//Check database for pending transactions & access JSON data
function checkDatabase() {
    // Open transaction on pending DB
    const transaction = db.transaction(["pending"], "readwrite");

    // Access pending object store
    const store = transaction.objectStore("pending");

    // Get all pending records
    const getAll = store.getAll();

    // Get all transaction with JSON
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(() => {
                    // If sucessful, a new transaction will open as pending
                    const transaction = db.transaction(["pending"], "readwrite");

                    //Acces pending object store
                    const store = transaction.objectStore("pending");

                    // Clear all items
                    store.clear();
                })
        }
    }
};


// Listen for app coming back online
window.addEventListener("online", checkDatabase);