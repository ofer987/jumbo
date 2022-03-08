class Menu {
  private menuId: string;
  private baseUrl: URL;
  private tabUrl: URL;
  // private ticketIdElement: Element;

  get menuElement() {
    return document.getElementById(this.menuId);
  }

  get searchButton(): HTMLInputElement {
    return document.getElementById("search") as HTMLInputElement;
  }

  get ticketIdElement(): HTMLInputElement {
    return document.getElementById("ticket") as HTMLInputElement;
  }

  set ticketId(value) {
    this.ticketIdElement.value = value.trim();
  }

  get ticketId(): string {
    return this.ticketIdElement.value.trim();
  }

  get jiraLinkTextElement(): HTMLInputElement {
    return document.getElementById("link") as HTMLInputElement;
  }

  get jiraUrl(): URL {
    if (this.ticketId === "") {
      return new URL("https://jira.thomsonreuters.com/secure/Dashboard.jspa");
    }

    // Assume it is a DPT ticket if the ticket only contains numbers
    var ticketId = this.ticketId;
    let matchGroups = this.ticketId.match(/^([0-9]+)$/);
    if (matchGroups && matchGroups.length > 1) {
      ticketId = `DPT-${this.ticketId}`;
    }

    matchGroups = this.ticketId.match(/^([a-z]+)([0-9]+)$/i);
    if (matchGroups && matchGroups.length > 2) {
      ticketId = `${matchGroups[1]}-${matchGroups[2]}`;
    }

    return new URL(`${this.baseUrl.href}browse/${ticketId.toUpperCase()}`);
  }

  constructor(tabUrl: string | URL) {
    this.tabUrl = new URL(tabUrl);
    this.menuId = "menu";
    let jiraBaseUrl = "jira.thomsonreuters.com";
    this.baseUrl = new URL(`https://${jiraBaseUrl}/`);

    let matchGroups = this.tabUrl.toString().match(/^https:\/\/jira\.thomsonreuters\.com\/browse\/(.+)/);
    if (matchGroups && matchGroups.length > 1) {
      this.ticketId = matchGroups[1];
    }

    this.initializeEventHandlers();
  }

  private navigateToJiraUrl = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (this.ticketId === "") {
        this.navigateTo(this.baseUrl.toString());
      } else {
        this.navigateTo(this.jiraUrl.toString());
      }

      this.close();
    }
  };

  private navigateTo(url: URL | string) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentUrl = tabs[0].url;
      chrome.tabs.update(tabs[0].id, { url: url.toString() }, () => {
        chrome.history.addUrl({ url: currentUrl });
      });
    });
  }

  private initializeEventHandlers() {
    this.ticketIdElement.focus();
    this.ticketIdElement.select();
    this.ticketIdElement.addEventListener("keydown", this.navigateToJiraUrl);
    this.jiraLinkTextElement.addEventListener("keydown", this.navigateToJiraUrl);

    this.ticketIdElement.addEventListener("keyup", () => {
      if (this.ticketId === "") {
        this.searchButton.value = "Navigate to Dashboard";
        this.jiraLinkTextElement.value = "";
      } else {
        this.searchButton.value = "Go";
        this.jiraLinkTextElement.value = this.jiraUrl.toString();;
      }
    });

    this.searchButton.addEventListener("click", () => {
      this.navigateTo(this.jiraUrl.toString());
      this.close();
    });
  }

  private close() {
    window.close();
  }
}

export { Menu }
