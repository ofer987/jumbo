(function() {
    var statusLabel = document.getElementById('saved_status');

    var displaySaved = function() {
        statusLabel.textContent = 'Saved';
    };

    var save = function() {
        chrome.storage.sync.set({
            jiraUrl: document.getElementById('jira-url').value
        }, displaySaved);
    };

    var restore = function() {
        chrome.storage.sync.get({
            'jira-url': '',
        }, function(savedValues) {
            document.getElementById('jira-url').value = savedValues.jiraUrl;
        });
    };

    document.querySelector('button#save').addEventListener('click', save);
    document.addEventListener('DOMContentLoaded', restore);

    document.querySelectorAll('.server').forEach(function(element) {
        element.addEventListener('keydown', function(_event) {
            statusLabel.textContent = '';
        });
    });
})();
