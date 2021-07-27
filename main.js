(function() {
    class Menu {
        get menuElement() {
            return document.getElementById(this.menuId);
        }

        get searchButton() {
            return document.getElementById('search');
        }

        get ticketIdElement() {
            return document.getElementById('ticket');
        }

        set ticketId(value) {
            this.ticketIdElement.value = value.trim();
        }

        get ticketId() {
            return this.ticketIdElement.value.trim();
        }

        get jiraUrl() {
            if (this.ticketId === '') {
                return new URL("https://jira.thomsonreuters.com/secure/Dashboard.jspa");
            }

            // Assume it is a DPT ticket if the ticket only contains numbers
            var ticketId = this.ticketId;
            var matchGroups = this.ticketId.match(/^([0-9]+)$/);
            if (matchGroups && matchGroups.length > 1) {
                ticketId = `DPT-${this.ticketId}`;
            }

            return new URL(`${this.baseUrl.href}browse/${ticketId}`);
        }

        constructor(tabUrl, jiraBaseUrl) {
            this.tabUrl = new URL(tabUrl);
            this.menuId = 'menu';
            jiraBaseUrl = 'jira.thomsonreuters.com';
            this.baseUrl = new URL(`https://${jiraBaseUrl}/`);

            var matchGroups = tabUrl.match(/^https:\/\/jira\.thomsonreuters\.com\/browse\/(.+)/);
            if (matchGroups && matchGroups.length > 1) {
                this.ticketId = matchGroups[1];
            }

            this.initializeEventHandlers();
        }

        initializeEventHandlers() {
            this.ticketIdElement.focus();
            this.ticketIdElement.select();
            this.ticketIdElement.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    if (this.ticketId === '') {
                        this.navigateTo(this.baseUrl.toString());
                    } else {
                        this.navigateTo(this.jiraUrl.toString());
                    }
                    this.close();
                }
            });

            this.searchButton.addEventListener('click', () => {
                this.navigateTo(this.jiraUrl.toString());
                this.close();
            });
        }

        navigateTo(url) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                var currentUrl = tabs[0].url;
                chrome.tabs.update(tabs[0].id, { url: url.toString() }, () => {
                    chrome.history.addUrl({ url: currentUrl });
                });
            });
        };

        close() {
            window.close();
        }
    }

    var initialize = function(andThen) {
        chrome.storage.sync.get({ jiraUrl: '' }, function(savedValues) {
            andThen(savedValues.jiraUrl);
        });
    };

    var main = function(jiraBaseUrl) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            var tab = tabs[0];
            var url = tab.url;

            menu = new Menu(url, jiraBaseUrl);
        });
    };

    // Initalize the popup window.
    document.addEventListener('DOMContentLoaded', function() {
        initialize(main);
    });
})();
