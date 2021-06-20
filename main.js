// var getClassNames = function(className) {
//   className = (className || '').trim();
//
//   if (className.length === 0) {
//     return [];
//   }
//
//   return className.split(' ');
// };

// var servers = {
//   localhost: {
//     id: 'localhost',
//     name: 'Localhost',
//     protocol: 'http:',
//     host: ''
//   },
//   qa: {
//     id: 'qa',
//     name: 'QA',
//     protocol: 'https:',
//     host: ''
//   },
//   uat: {
//     id: "author-uat",
//     name: 'Author UAT',
//     protocol: 'https:',
//     host: ''
//   },
//   ppe: {
//     id: "author-ppe",
//     name: 'Author PPE',
//     protocol: 'https:',
//     host: ''
//   },
//   production: {
//     id: 'author-prod',
//     name: 'Author Production',
//     protocol: 'https:',
//     host: ''
//   }
// };

class Jira {
    constructor(url) {
        this.url = new URL(url);
    }

    toString() {
        return this.url.toString();
    }
}

// var getCrxDePages = function(serverNames) {
//   var results = [];
//
//   var i = 0;
//   serverNames.forEach(function(name) {
//     var server = servers[name];
//     var serverUrl = new URL(`${server.protocol}//${server.host}/crx/de/index.jsp`);
//
//     results.push(new CrxDePage(i, server.name, serverUrl));
//     i += 1;
//   });
//
//   return results;
// }
//
// var getServers = function(url) {
//   url = new URL(url);
//
//   var results = [];
//   Object.keys(servers).forEach(function(name) {
//     var server = servers[name];
//     var serverUrl = new URL(url);
//
//     serverUrl.protocol = server.protocol;
//     serverUrl.host = server.host;
//
//     results.push(new Server(server.id, server.name, serverUrl));
//   });
//
//   return results;
// }

class Keyboard {
    addEventListeners(menu) {
        // this.addMoveUp(menu);
        // this.addMoveDown(menu);
        this.addLaunch(menu);
    }

    // addMoveUp(menu) {
    //   document.addEventListener('keydown', function(event) {
    //     if (event.keyCode === 38 || event.keyCode === 75) {
    //       menu.moveUp();
    //     }
    //   });
    // }
    //
    // addMoveDown(menu) {
    //   document.addEventListener('keydown', function(event) {
    //     if (event.keyCode === 40 || event.keyCode === 74) {
    //       menu.moveDown();
    //     }
    //   });
    // }

    addLaunch(menu) {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'o' || event.key === 'Enter') {
                menu.launch();
                menu.close();
            }
        })
    }
}

class Menu {
    setSelectedPage() {
        // var selectedPage = this.menuElement.querySelector(`#${id}`);
        // var className = selectedPage.className;
        // var classNames = getClassNames(className);

        // classNames.push('selected');
        // selectedPage.className = classNames.join(' ');
    }

    // get pageElements() {
    //   return this.menuElement.querySelectorAll('.page');
    // }
    //
    get menuElement() {
      return document.getElementById('pages');
    }

    constructor(jiraBaseUrl) {
        this.baseUrl = new URL(jiraBaseUrl);

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

    set ticketId(val) {
        this.ticketId = val;
    }

    get ticketId() {
        var ticketTextBox = this.menuElement.querySelector('#ticket-number');

        return ticketTextBox.textContent.trim();
    }

    get jiraUrl() {
        return new URL(`${this.baseUrl}/${this.ticketId}`);
    }

    launch() {
        navigateTo(this.jiraUrl);
    }

    close() {
        window.close();
    }

    clear() {
        // this.pageElements.forEach(function(page) {
        //     page.remove();
        // });
    }

    render() {
        // this.clear();
        //
        // var menuElement = this.menuElement;
        // this.pages.forEach(function(page) {
        //     var pageElement = getSelectionDiv(page.id, page.name, page.toString());
        //
        //     menuElement.appendChild(pageElement);
        // });
        //
        // this.setSelectedPage(this.pages[this.selectedIndex].id);
    }
}

// class AemPageState {
//     constructor(mode) {
//         this.mode = mode;
//         this.selectedIndex = 0;
//         this.pages = [];
//     }
//
//     appendPage(page) {
//         this.pages.push(page);
//     }
// }

var navigateTo = function(url) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.update(tabs[0].id, { url: url });
    });
};

var getPages = function(page) {
    return [
        page.editorPage,
        page.previewPage,
        page.crxDePage,
        page.crxPackMgrPage,
        page.sitesPage,
        page.userAdminPage
    ];
};

var getSelectionDiv = function(id, name, url) {
    var result = document.createElement('div');
    result.id = id;
    result.className = 'page';
    result.textContent = name;
    result.onclick = function() {
        navigateTo(url);
    };

    return result;
};

var appendError = function(exception) {
    var newError = document.createElement('div');
    newError.className = 'error';
    newError.textContent = exception.toString();

    var errorsDiv = document.getElementById('errors');
    errorsDiv.appendChild(newError);

    return;
};

var createPagesMenu = function(url) {
    var currentPage = AemPage.getPage(url);
    var state = new AemPageState("pages");

    var i = 0;
    var currentIndex = 0;
    getPages(currentPage).forEach(function(page) {
        if (currentPage.id === page.id) {
            currentIndex = i;
        } else {
            i += 1;
        }

        state.appendPage(page);
    });

    var menu = new Menu(currentIndex, state.pages);
    var keyboard = new Keyboard();
    keyboard.addEventListeners(menu);

    return menu;
};

var createMenu = function() {
    var menu = new Menu();
    var keyboard = new Keyboard();
    keyboard.addEventListeners(menu);

    return menu;
};

var createServersMenu = function(url) {
    var currentUrl = new URL(AemPage.getPage(url));
    var state = new AemPageState("pages");

    var i = 0;
    var currentIndex = 0;
    getServers(currentUrl).forEach(function(server) {
        if (server.url.origin === currentUrl.origin) {
            currentIndex = i;
        } else {
            i += 1;
        }

        state.appendPage(server);
    });

    var menu = new Menu(currentIndex, state.pages);
    var keyboard = new Keyboard();
    keyboard.addEventListeners(menu);

    return menu;
};

var createCrxDePagesMenu = function(url) {
    var state = new AemPageState("pages");

    getCrxDePages(Object.keys(servers)).forEach(function(page) {
        console.log(page.toString());
        state.appendPage(page);
    });

    var menu = new Menu(0, state.pages);
    var keyboard = new Keyboard();
    keyboard.addEventListeners(menu);

    return menu;
};

initialize = function(andThen) {
    chrome.storage.sync.get({ localhost: '', qa: '', uat: '', ppe: '', production: '' }, function(saved_values) {
        servers.localhost.host = saved_values.localhost;
        servers.qa.host = saved_values.qa;
        servers.uat.host = saved_values.uat;
        servers.ppe.host = saved_values.ppe;
        servers.production.host = saved_values.production;

        andThen();
    });
};

var main = function() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        var tab = tabs[0];
        var url = tab.url;

        // var currentPage = null;
        try {
            // currentPage = AemPage.getPage(url);

            // var mode = "pages";
            var menu = createPagesMenu(url);
            menu.render();

            chrome.commands.onCommand.addListener(function(_command) {
                menu = createMenu();
                menu.render();
                // if (command === "select") {
                //     if (mode === "pages") {
                //         mode = "servers";
                //
                //         menu.clear();
                //         menu.pages = [];
                //         menu = createServersMenu(url);
                //         menu.render();
                //     } else {
                //         mode = "pages";
                //
                //         menu.clear();
                //         menu.pages = [];
                //         menu = createPagesMenu(url);
                //         menu.render();
                //     };
                // }
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

// class AemPage {
//     static getPage(url) {
//         url = new URL(url);
//
//         if (EditorPage.isPage(url)) return new EditorPage(url);
//         if (PreviewPage.isPage(url)) return new PreviewPage(url);
//         if (CrxDePage.isPage(url)) return new CrxDePage(0, 'CRX / DE', url);
//         if (CrxPackMgrPage.isPage(url)) return new CrxPackMgrPage(url);
//         if (UserAdminPage.isPage(url)) return new UserAdminPage(url);
//         if (SitesPage.isPage(url)) return new SitesPage(url);
//
//         throw `Sorry the url (${url}) is not an AEM page`;
//     }
//
//     constructor(url) {
//         this.url = url;
//     }
//
//     toString() {
//         return this.url.toString();
//     }
// }
//
// class UserAdminPage extends AemPage {
//     static pathRegex = /^\/useradmin$/;
//
//     static isPage(url) {
//         url = new URL(url);
//
//         return UserAdminPage.pathRegex.test(new URL(url).pathname);
//     }
//
//     get id() {
//         return 'user-admin';
//     }
//
//     get name() {
//         return "User Admin";
//     }
//
//     constructor(url) {
//         var url = new URL(url);
//
//         super(url);
//     }
//
//     get editorPage() {
//         var url = `${this.url.origin}/editor.html/content\.html`;
//
//         return new EditorPage(url);
//     }
//
//     get previewPage() {
//         var url = `${this.url.origin}\/content\.html?wcmmode=disabled`;
//
//         return new PreviewPage(url);
//     }
//
//     get crxDePage() {
//         var url = new URL(`${this.url}/crx/de/index.jsp`);
//
//         return new CrxDePage(0, 'CRX / DE', url);
//     }
//
//     get crxPackMgrPage() {
//         var url = new URL(`${this.url}/crx/packmgr/index.jsp`);
//
//         return new CrxPackMgrPage(0, 'CRX / Package Manager', url);
//     }
//
//     get userAdminPage() {
//         return this;
//     }
//
//     get sitesPage() {
//         var url = new URL(`${this.url.origin}/sites.html/content`);
//
//         return new SitesPage(url);
//     }
// }
//
// class CrxPackMgrPage extends AemPage {
//     static pathRegex = /^\/crx\/packmgr\/index\.jsp#?(.*)$/;
//
//     static isPage(url) {
//         url = new URL(url);
//
//         return CrxPackMgrPage.pathRegex.test(new URL(url).pathname);
//     }
//
//     get id() {
//         return 'crx-pack-mgr';
//     }
//
//     get name() {
//         return "CRX / Package Manager";
//     }
//
//     constructor(url) {
//         super(new URL(url));
//     }
//
//     get editorPage() {
//         var url = `${this.url.origin}/editor.html${this.url.hash.substr(1)}\.html`;
//
//         return new EditorPage(url);
//     }
//
//     get previewPage() {
//         var url = `${this.url.origin}${this.url.hash.substr(1)}\.html?wcmmode=disabled`;
//
//         return new PreviewPage(url);
//     }
//
//     get crxDePage() {
//         var url = new URL(this.url);
//         url.pathname = '/crx/de/index.jsp';
//
//         return new CrxDePage(0, 'CRX / DE', url);
//     }
//
//     get crxPackMgrPage() {
//         return this;
//     }
//
//     get userAdminPage() {
//         var url = new URL(`${this.url.origin}/useradmin`);
//
//         return new UserAdminPage(url);
//     }
//
//     get sitesPage() {
//         var url = `${this.url.origin}/sites.html${this.url.hash.substr(1)}`;
//
//         return new SitesPage(url);
//     }
// }
//
// class CrxDePage extends AemPage {
//     static pathRegex = /^\/crx\/de\/index\.jsp$/;
//
//     static isPage(url) {
//         url = new URL(url);
//
//         return CrxDePage.pathRegex.test(new URL(url).pathname);
//     }
//
//     get id() {
//         return `crx-de-${this.i}`;
//     }
//
//     constructor(i, name, url) {
//         super(new URL(url));
//
//         this.i = i;
//         this.name = name;
//     }
//
//     get editorPage() {
//         var url = `${this.url.origin}/editor.html${this.url.hash.substr(1)}\.html`;
//
//         return new EditorPage(url);
//     }
//
//     get previewPage() {
//         var url = `${this.url.origin}${this.url.hash.substr(1)}\.html?wcmmode=disabled`;
//
//         return new PreviewPage(url);
//     }
//
//     get crxDePage() {
//         return this;
//     }
//
//     get crxPackMgrPage() {
//         var url = new URL(this.url);
//         url.pathname = '/crx/packmgr/index.jsp';
//
//         return new CrxPackMgrPage(url);
//     }
//
//     get userAdminPage() {
//         var url = new URL(`${this.url.origin}/useradmin`);
//
//         return new UserAdminPage(url);
//     }
//
//     get sitesPage() {
//         var url = `${this.url.origin}/sites.html${this.url.hash.substr(1)}`;
//
//         return new SitesPage(url);
//     }
// }
//
// class EditorPage extends AemPage {
//     static pathRegex = /^\/editor\.html(\/.*)\.html/
//
//     static isPage(url) {
//         url = new URL(url);
//
//         return EditorPage.pathRegex.test(new URL(url).pathname);
//     }
//
//     get id() {
//         return 'editor-page';
//     }
//
//     get name() {
//         return 'Editor';
//     }
//
//     constructor(url) {
//         super(new URL(url));
//     }
//
//     get editorPage() {
//         return this;
//     }
//
//     get previewPage() {
//         var url = `${this.url.origin}${this.url.pathname.match(EditorPage.pathRegex)[1]}\.html?wcmmode=disabled`;
//
//         return new PreviewPage(url);
//     }
//
//     get crxDePage() {
//         var url = `${this.url.origin}/crx/de/index.jsp#${this.url.pathname.match(EditorPage.pathRegex)[1]}`;
//
//         return new CrxDePage(0, 'CRX / DE', url);
//     }
//
//     get crxPackMgrPage() {
//         var url = `${this.url.origin}/crx/packmgr/index.jsp#${this.url.pathname.match(EditorPage.pathRegex)[1]}`;
//
//         return new CrxPackMgrPage(url);
//     }
//
//     get userAdminPage() {
//         var url = new URL(`${this.url.origin}/useradmin`);
//
//         return new UserAdminPage(url);
//     }
//
//     get sitesPage() {
//         var url = `${this.url.origin}/sites.html${this.url.pathname.match(EditorPage.pathRegex)[1]}`;
//
//         return new SitesPage(url);
//     }
// }
//
// class PreviewPage extends AemPage {
//     static pathRegex = /\?(.*)wcmmode=disabled(.*)/
//
//     static isPage(url) {
//         url = new URL(url);
//
//         return url.searchParams.get('wcmmode') === 'disabled'
//     }
//
//     get id() {
//         return 'preview-page';
//     }
//
//     get name() {
//         return 'Preview';
//     }
//
//     constructor(url) {
//         super(new URL(url));
//     }
//
//     get editorPage() {
//         var url = new URL(this.url);
//
//         url.pathname =`/editor.html${url.pathname}`;
//         url.searchParams.delete('wcmmode');
//
//         return new EditorPage(url);
//     }
//
//     get previewPage() {
//         return this;
//     }
//
//     get crxDePage() {
//         var regex = /(\/.*)\.html/;
//
//         var jcrPath = this.url.pathname.match(regex)[1] || this.url.pathname;
//         var url = `${this.url.origin}/crx/de/index.jsp#${jcrPath}`;
//
//         return new CrxDePage(0, 'CRX / DE', url);
//     }
//
//     get crxPackMgrPage() {
//         var regex = /(\/.*)\.html/;
//
//         var jcrPath = this.url.pathname.match(regex)[1] || this.url.pathname;
//         var url = `${this.url.origin}/crx/packmgr/index.jsp#${jcrPath}`;
//
//         return new CrxPackMgrPage(url);
//     }
//
//     get userAdminPage() {
//         var url = new URL(`${this.url.origin}/useradmin`);
//
//         return new UserAdminPage(url);
//     }
//
//     get sitesPage() {
//         var regex = /(\/.*)\.html/;
//
//         var jcrPath = this.url.pathname.match(regex)[1] || this.url.pathname;
//         var url = `${this.url.origin}/sites.html${jcrPath}`;
//
//         return new SitesPage(url);
//     }
// }
//
// class SitesPage extends AemPage {
//     static pathRegex = /^\/sites\.html(\/.*)/
//
//     static isPage(url) {
//         url = new URL(url);
//
//         return SitesPage.pathRegex.test(new URL(url).pathname);
//     }
//
//     get id() {
//         return 'sites-page';
//     }
//
//     get name() {
//         return 'Sites';
//     }
//
//     constructor(url) {
//         super(new URL(url));
//     }
//
//     get editorPage() {
//         var url = new URL(this.url);
//
//         var url = `${this.url.origin}/editor.html${this.url.pathname.match(SitesPage.pathRegex)[1]}\.html`;
//
//         return new EditorPage(url);
//     }
//
//     get previewPage() {
//         var url = `${this.url.origin}${this.url.pathname.match(SitesPage.pathRegex)[1]}\.html?wcmmode=disabled`;
//
//         return new PreviewPage(url);
//     }
//
//     get crxDePage() {
//         var url = `${this.url.origin}/crx/de/index.jsp#${this.url.pathname.match(SitesPage.pathRegex)[1]}`;
//
//         return new CrxDePage(0, 'CRX / DE', url);
//     }
//
//     get crxPackMgrPage() {
//         var url = `${this.url.origin}/crx/packmgr/index.jsp#${this.url.pathname.match(SitesPage.pathRegex)[1]}`;
//
//         return new CrxPackMgrPage(url);
//     }
//
//     get userAdminPage() {
//         var url = new URL(`${this.url.origin}/useradmin`);
//
//         return new UserAdminPage(url);
//     }
//
//     get sitesPage() {
//         return this;
//     }
}
