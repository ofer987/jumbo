(function() {
    // class Jira {
    //     constructor(url) {
    //         this.url = new URL(url);
    //     }
    //
    //     toString() {
    //         return this.url.toString();
    //     }
    // }

    class Keyboard {
        addEventListeners(menu) {
            this.addLaunch(menu);
            document.addEventListener('click', function(_event) {
                menu.launch();
                menu.close();
            });
        }
        addLaunch(menu) {
            document.addEventListener('keydown', function(_event) {
                // if (event.key === 'o' || event.key === 'Enter') {
                menu.launch();
                menu.close();
                // }
            })
        }
    }

    class Menu {
        get menuElement() {
            return document.getElementById('jira');
        }

        constructor(jiraBaseUrl) {
            this.baseUrl = new URL(`https://${jiraBaseUrl}/browse/`);

            var matchGroups = window.location.href.match(/^https:\/\/jira\.thomsonreuters\.com\/browse/);
            if (matchGroups && matchGroups.length > 1) {
                this.ticketId = matchGroups[1];
            }
        }

        // moveUp() {
        //   var currentIndex = this.selectedIndex;
        //   var pageLength = this.pages.length;
        //
        //   // rollover
        //   if (currentIndex <= 0) {
        //     this.selectedIndex = this.pages.length - 1;
        //   } else {
        //     this.selectedIndex -= 1;
        //   }
        //
        //   this.render();
        // }

        // moveDown() {
        //   var currentIndex = this.selectedIndex;
        //   var pageLength = this.pages.length;
        //
        //   // rollover
        //   if (currentIndex + 1 >= pageLength) {
        //     this.selectedIndex = 0;
        //   } else {
        //     this.selectedIndex += 1;
        //   }
        //
        //   this.render();
        // }

        // set ticketId(val) {
        //     this.ticketId = val;
        // }

        get ticketId() {
            var ticketTextBox = this.menuElement.querySelector('#ticket-number');

            return ticketTextBox.textContent.trim();
        }

        get jiraUrl() {
            return new URL(`${this.baseUrl.href}${this.ticketId}`);
        }

        launch() {
            navigateTo(this.jiraUrl);
        }

        close() {
            window.close();
        }

        clear() {
        }

        render() {
        }
    }

    var navigateTo = function(url) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.update(tabs[0].id, { url: url });
        });
    };

    var appendError = function(exception) {
        var newError = document.createElement('div');
        newError.className = 'error';
        newError.textContent = exception.toString();

        var errorsDiv = document.getElementById('errors');
        errorsDiv.appendChild(newError);

        return;
    };

    var createMenu = function() {
        var menu = new Menu();
        var keyboard = new Keyboard();
        keyboard.addEventListeners(menu);

        return menu;
    };

    var initialize = function(andThen) {
        chrome.storage.sync.get({ jiraUrl: '' }, function(savedValues) {
            servers.jiraUrl.host = savedValues.jiraUrl;

            andThen();
        });
    };

    var main = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            var tab = tabs[0];
            var url = tab.url;

            try {
                var menu = createPagesMenu(url);
                menu.render();

                chrome.commands.onCommand.addListener(function(_command) {
                    menu = createMenu();
                    menu.render();
                });
            } catch (exception) {
                var menu = createMenu();
                menu.render();
            }
        });
    };

    // Initalize the popup window.
    document.addEventListener('DOMContentLoaded', function() {
        initialize(main);
    });
})();
