var selectionAnchorNode;
var bugReportState = {
    initiateWay: null,
    setInitiateWay: function(value) {
        this.initiateWay = value;
    },
    getInitiateWay: function() {
        return this.initiateWay;
    },
    selectedHtml: null,
    elementIdentifier: null,
    setSelectedHtmlSRB: function(value) {
        var htmlContent = value.innerHTML;
        this.selectedHtml = "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent);
        this.elementIdentifier = value.id;
    },
    setSelectedHtmlSmallButton: function(value) {
        var range = value.getRangeAt(0);
        var container = document.createElement('div');
        container.appendChild(range.cloneContents());
        this.selectedHtml = 'data:text/html;charset=utf-8,' + encodeURIComponent(container.innerHTML);
    },
    getSelectedHtml: function() {
        return this.selectedHtml;
    },
    getElementIdentifier: function() {
        return this.elementIdentifier;
    },
    clear : function() {
        this.selectedHtml = "Undefined";
        this.elementIdentifier = "Undefined";
        this.initiateWay = "Undefined";
    }
};

function detectColorScheme() {
    var theme="light";
    var current_theme = localStorage.getItem("ar5iv_theme");
    if(current_theme){
      if(current_theme == "dark"){
        theme = "dark";
      } }
    else if(!window.matchMedia) { return false; }
    else if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark"; }
    if (theme=="dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light"); } 
}

function toggleColorScheme(){
    var current_theme = localStorage.getItem("ar5iv_theme");
    if (current_theme) {
      if (current_theme == "light") {
        localStorage.setItem("ar5iv_theme", "dark"); }
      else {
        localStorage.setItem("ar5iv_theme", "light"); } }
    else {
        localStorage.setItem("ar5iv_theme", "dark"); }
    detectColorScheme(); 
}

function addBugReportForm() {
    const theme = document.documentElement.getAttribute("data-theme");
    // Create the button element
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-primary");
    button.setAttribute("id", "openForm");
    button.appendChild(document.createTextNode("Report Bug"));

    // Create the modal container element
    const modal = document.createElement("div");
    modal.setAttribute("class", "modal");
    modal.setAttribute("id", "myForm");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "modal-title");

    // Create the modal dialog element
    const modalDialog = document.createElement("div");
    modalDialog.setAttribute("class", "modal-dialog");

    // Create the form element
    const form = document.createElement("form");
    form.setAttribute("class", "modal-content");
    form.setAttribute("id", "myFormContent");
    form.setAttribute("enctype", "multipart/form-data");

    // Create the modal header
    const modalHeader = document.createElement("div");
    modalHeader.setAttribute("class", "modal-header");

    // Create the modal title
    const modalTitle = document.createElement("h5");
    modalTitle.setAttribute("class", "modal-title");
    modalTitle.appendChild(document.createTextNode("Bug Report Form"));

    // Create the close button for the modal
    const closeButton = document.createElement("button");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("class", "btn-close");
    closeButton.setAttribute("data-bs-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");

    // Append the title and close button to the modal header
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    if(theme==='dark'){
        modalHeader.setAttribute('data-bs-theme',"dark");
    }

    // Create the modal body
    const modalBody = document.createElement("div");
    modalBody.setAttribute("class", "modal-body");

    // Update: Add warning label. Need add format in style.css.
    const warningLabel = document.createElement("div");
    warningLabel.id = "warningLabel";
    warningLabel.setAttribute('class', 'form-text');
    warningLabel.textContent = "Warning: Issue reports are not private. If you are an author submitting feedback about a pre-release submission, be advised that the contents of the bug report will be publicly available.";

    // Create the description input field
    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", "description");
    //descriptionLabel.setAttribute("class", "form-label");
    descriptionLabel.appendChild(document.createTextNode("Description*:"));

    const descriptionTextarea = document.createElement("textarea");
    descriptionTextarea.setAttribute("class", "form-control");
    descriptionTextarea.setAttribute("id", "description");
    descriptionTextarea.setAttribute("name", "description");
    descriptionTextarea.setAttribute("required", "required");
    descriptionTextarea.setAttribute("style", "height: 80px;");
    // Update: Change to 500 for next two lines.
    descriptionTextarea.setAttribute("maxlength", "500"); // Set the maximum length to 200 characters
    descriptionTextarea.setAttribute("placeholder","500 characters maximum");

    // Create the modal footer
    const modalFooter = document.createElement("div");
    modalFooter.setAttribute("class", "modal-footer d-flex justify-content-end");

    // Create the submit button
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("class", "btn btn-primary");
    submitButton.setAttribute("id", "modal-submit");
    submitButton.setAttribute("style", "background-color: #b31b1b;");
    submitButton.appendChild(document.createTextNode("Submit"));

    // Update: ScreenReader Submit Buttons. Needed for Submit without Github Function.
    const srSubmit = document.createElement("button");
    srSubmit.setAttribute("type", "submit");
    srSubmit.setAttribute("class", "sr-only button");
    srSubmit.setAttribute("id", "modal-submit-sr");
    srSubmit.appendChild(document.createTextNode("Submit without Github"));

    // Create a container div for the buttons
    const buttonsContainer = document.createElement("div");
    buttonsContainer.setAttribute("class", "d-flex justify-content-between");

    // Append the elements to their respective parents
    // Update: Add warning label (next line)
    modalBody.appendChild(warningLabel);
    modalBody.appendChild(descriptionLabel);
    modalBody.appendChild(descriptionTextarea);

    // Update: Add buttonsContainer (next line)
    modalFooter.appendChild(srSubmit);
    modalFooter.appendChild(submitButton);

    form.appendChild(modalHeader);
    form.appendChild(modalBody);
    form.appendChild(modalFooter);

    modalDialog.appendChild(form);

    modal.appendChild(modalDialog);

    document.body.appendChild(button);
    document.body.appendChild(modal);

    button.onclick = (e) => {
        currentAnchorNode = null;
        showModal(modal, 'button');
        bugReportState.setInitiateWay("Fixedbutton");
    }
    closeButton.onclick = (e) => hideModal(modal);

    return modal;
}

// Create SRButton that can open the report modal
function addSRButton(modal) {
    const contents = document.querySelectorAll('p, svg, figure, .ltx_title, .ltx_authors');
    const buttons = [];

    // Get all the paragraphs in the document
    // Add a hidden button after each paragraph
    // Add a hidden button after each paragraph
    contents.forEach((content, i) => {
        if (content.classList.contains("header-message") || content.classList.contains("logomark")) return;

        const button = document.createElement("button");
        button.setAttribute("class", "sr-only button");
        button.style.display = "none";
        button.textContent = "Report Bug";

        button.onfocus = () => previousFocusElement = document.activeElement;

        button.onclick = (e) => {
            /* 
                Comment: Need add a variable named initiateWay, so we can know how users initiate the report.
            
                For addSRbutton, initiateWay = "srButton"
                For smallReportButton, initiateWay = "smallButton"
                For ShortCut, initiateWay = "ShortCut"
                For click the button(right bi button) created in the modal, initiateWay = "FixedButton".

                So you may need to create a global variable. I have checked showModal it cannot send any parameter to modal.
            */
            showModal(modal);
            bugReportState.setSelectedHtmlSRB(content);
            bugReportState.setInitiateWay("SRButton");
            e.preventDefault();
        };

        // Insert the button after the paragraph
        content.parentNode.insertBefore(button, content.nextSibling);

        buttons.push(button);
    });

    return buttons;
}

function showModal (modal) {
    modal.style.display = 'block';
    modal.setAttribute('tabindex', '-1'); // Ensure the modal is focusable
    modal.focus();
}

function hideModal (modal) { 
    modal.style.display = 'none'; 
}

function showButtons (buttons) {
    buttons.forEach((button) => {
        console.log(button);
        console.log(button.style.display);
        button.style.display === 'none' ?
            button.style.display = 'inline' :
            button.style.display = 'none';
    })
}

function hideButtons (buttons) {
    buttons.forEach((button) => button.style.display = 'none');
}

// Code for handling key press to open/close modal
const handleKeyDown = (e, modal, buttons) => {
    const ctrlOrMeta = e.metaKey || e.ctrlKey;

    if (e.shiftKey && e.code === 'KeyB') { 
        showButtons(buttons);
    } else if (ctrlOrMeta && (e.key === '/' || e.key === '?')) {
        showModal(modal)
        bugReportState.setInitiateWay("ShortCut");
    } else if (ctrlOrMeta && (e.key === '}' || e.key === ']')) {
        hideModal(modal);
    }
}

//The highlight initiation way
function handleMouseUp (e, smallButton) {
        if (e.target.id === "small-report-button") 
            return;
        if (!window.getSelection().isCollapsed) {
            selection = window.getSelection();
            currentAnchorNode = selection.anchorNode;
            bugReportState.setSelectedHtmlSmallButton(selection);
            // var range = selection.getRangeAt(0);
            // var container = document.createElement('div');
            // container.appendChild(range.cloneContents());
            // // Use the selected text to generate the dataURI
            // selectedHtml = 'data:text/html;charset=utf-8,' + encodeURIComponent(container.innerHTML);
            //Comment: Need to get the selected text and pass it to the backend
            //reference: var selectedhtml in app.js
            showSmallButton(smallButton);
        }
        else hideSmallButton(smallButton);
}

function createSmallButton (modal) {
    const smallReportButton = document.createElement('button');
    smallReportButton.id = 'small-report-button';
    smallReportButton.type = 'button';
    smallReportButton.className = 'btn btn-secondary btn-sm';
    smallReportButton.style.backgroundColor = '#b31b1b';
    smallReportButton.textContent = 'Report';
    smallReportButton.style.position = 'fixed';

    document.body.appendChild(smallReportButton);

    smallReportButton.onclick = (e) => {
        showModal(modal); // do something with window.getSelection()
        bugReportState.setInitiateWay("selectedText-smallButton");
    }

    smallReportButton.addEventListener("focusout", function (e) {
        hideSmallButton(this);
    });

    return smallReportButton;
}

// Display the smallButton for bug report, click and scroll included
function showSmallButton(smallReportButton) {
    selection = window.getSelection();

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    smallReportButton.style.left = `${rect.left + rect.width / 2}px`;

    // Check if there is enough space above the selected text
    smallReportButton.style.top = `${rect.top}px`;
    smallReportButton.style.transform = 'translate(-50%, -100%)';

    smallReportButton.style.display = 'inline';
}

function hideSmallButton (smallReportButton) {
    smallReportButton.style.display = 'none';
}

//submit to the backend, next step: finish
function submitBugReport (e) {
    e.preventDefault();
    //Test Test 2455
    clearAllCookies();
    //document.getElementById('notification').style = 'display: block';
    const issueData = {};

    // Canonical URL
    ARXIV_ABS_PATH = 'https://arxiv.org/abs/';
    const arxivIdv = window.location.pathname.split('/')[2]; // pathname ex: '/html/2306.16433v1/2306.16433v1.html'
    const canonicalURL = ARXIV_ABS_PATH + arxivIdv;

    // const user_info = "account:yc2455 contact:@cornll.edu "

    // Report Time
    const now = new Date();
    const year = now.getFullYear();      // e.g. 2023
    const month = now.getMonth() + 1;    // 0-11, so add 1
    const day = now.getDate();           // 1-31
    const hour = now.getHours();         // 0-23
    const minute = now.getMinutes();     // 0-59
    const second = now.getSeconds();     // 0-59
    const currentTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    // Browser Version
    const userAgent = navigator.userAgent;
    const browser = userAgent.match(/(firefox|edge|opr|chrome|safari)[\/]([\d.]+)/i)
    const browserName = browser[1];
    const browserVersion = browser[2];
    const browserInfo = browserName + '/' + browserVersion;

    // Relevant Selection
    let elementIdentifier = bugReportState.getElementIdentifier();
    let topLayer = 'Undefined"';
    console.log(currentAnchorNode);
    if (currentAnchorNode !== null) {
        const parentNode = currentAnchorNode.parentNode;
        const id = parentNode.id;
        const classList = parentNode.classList;
        //if there is no id, than use class to identify
        elementIdentifier = id || classList[0] || 'Undefined';
        console.log(elementIdentifier);

        //get the topLayer of id
        if (elementIdentifier.match(/^S\d/)) {
            topLayer = id ? id.split('.')[1] : classList[0];
        } else {
            topLayer = id ? id.split('.')[0] : classList[0];
        }
    }
    
    const dataDescription = document.getElementById('description').value;

    const uniqueId = window.crypto.randomUUID();

    // add to the form data
    // issueData['template'] = 'bug_report.md'); // TODO: Change this to a template with fields matching the ones below
    issueData['uniqueId'] = uniqueId;
    issueData['canonicalURL'] = canonicalURL;
    issueData['conversionURL'] = window.location.origin + window.location.pathname;
    issueData['reportTime'] = currentTime;
    issueData['browserInfo'] = browserInfo;
    issueData['description'] = dataDescription;
    issueData['locationLow'] = elementIdentifier;
    issueData['locationHigh'] = topLayer;
    issueData['selectedHtml'] = bugReportState.getSelectedHtml();
    issueData['initiationWay'] = bugReportState.getInitiateWay();

    form = new FormData();
    form.append('template', 'bug_report.md');
    form.append('title',`HTML conversion issue with : ${arxivIdv}$`)
    form.append('body', makeGithubBody(issueData));

    const GITHUB_BASE_URL = 'https://github.com/arXiv/html_feedback/issues/new?' 
    const queryString = new URLSearchParams(form).toString()
    const link = GITHUB_BASE_URL + queryString;

    window.open(link, '_blank');

    // After Submit.
    setCookie("iniateWay", bugReportState.getInitiateWay(), 10);
    document.querySelector('#myFormContent').reset();
    bugReportState.clear();
    hideModal(document.getElementById('myForm'));
}

function handleClickOutsideModal(e, modal) {
    if (e.target == modal)
        modal.style.display = 'none';
}


function makeGithubBody (issueData) {
    // User Fill in Data
    let body = "## Describe the issue\n\n";
    body += `**Description**: ${issueData.description}\n\n`;
    body += "Feel free to attach a screenshot (or document) link below: \n\n\n\n";

    // Auto Fill Data
    body += "## Auto Fill Data - !!! Please do not edit below this line !!!";
    body += "\n----------------------------------------------------------------------------------------\n";
    body += `**Issue ID**: ${issueData.uniqueId}\n\n`;
    body += `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`;
    body += `**Article URL**: ${issueData.canonicalURL}\n\n`;
    body += `**HTML URL**: ${issueData.conversionURL}\n\n`;
    body += `**Report Time**: ${issueData.reportTime}\n\n`;
    body += `**Browser Info**: ${issueData.browserInfo}\n\n`;
    body += `**Location Low**: ${issueData.locationLow}\n\n`;
    body += `**Location High**: ${issueData.locationHigh}\n\n`;
    body += `**Initiation Way**: ${issueData.initiationWay}\n\n`;

    var selectedText=`**Selected HTML**: ${issueData.selectedHtml}\n\n`;
    if((body+selectedText).length>=8000){
        selectedText="**htmlText**: " + selectedHtml.substring(0, 4000) + "\n\n"
        body+=selectedText;
    }
    else{
        body+=selectedText;
    }

    return body;
}

// RUN THIS CODE ON INITIALIZE
detectColorScheme();

// Function to handle cookies on page load
function handlePageLoad() {
    const allowCookies = getCookie("allowCookies");
    const rejectedCookies = getCookie("rejectedCookies");

    console.log("Current cookies: ", document.cookie);

    if (allowCookies || rejectedCookies) {
        return; 
    } else {
        const modal = document.getElementById("cookieModal");
        modal.style.display = "block";

        document.getElementById("allowCookies").addEventListener('click', function() {
            setCookie("allowCookies", "true", 10); 
            setCookie("rejectedCookies", "false", 10);
            modal.style.display = "none";
            console.log("Current cookies after allowing: ", document.cookie);
        });

        document.getElementById("rejectCookies").addEventListener('click', function() {
            setCookie("rejectedCookies", "true", 10);
            setCookie("allowCookies", "false", 10);
            modal.style.display = "none";
        });
    }
}

// check if cookies are allowed.
function checkCookiesAllowed() {
    const allowCookies = getCookie("allowCookies");
    if (allowCookies) {
        return true;
    } else {
        return false;
    }
}


// Function to set cookie
// this also can modify the cookie, it will overwrite the old one.
function setCookie(cookieName, cookieValue, expirationDays) {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/;Secure;SameSite=Strict`;
}

// Function to get cookie
function getCookie(cookieName) {
    const name = `${cookieName}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    
    return "";
}

// Function to delete one cookie.
function deleteCookie(cookieName) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() - 1); // Set the time to one millisecond in the past to delete the cookie
    const expires = "expires=" + expirationDate.toUTCString();
    document.cookie = cookieName + "=; " + expires + ";path=/";
}

// This function clears all cookies, is build for test. 
// Now it will clear all cookies after submit.
function clearAllCookies() {
    var cookies = document.cookie.split(";");
  
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var cookieName = cookie.split("=")[0];
      var expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() - 1);
      var expires = "expires=" + expirationDate.toUTCString();
      document.cookie = cookieName + "=; " + expires + ";path=/";
    }
}

function addCookieModal(){
    // 创建模态窗口
    const modal = document.createElement("div");
    modal.setAttribute("class", "modal");
    modal.setAttribute("id", "cookieModal");
    modal.style.display = "none";

    const modalContent = document.createElement("div");
    modalContent.setAttribute("class", "modal-content");

    const p = document.createElement("p");
    p.textContent = "Do you want to use cookies?";

    const allowButton = document.createElement("button");
    allowButton.setAttribute("id", "allowCookies");
    allowButton.textContent = "Yes";

    const rejectButton = document.createElement("button");
    rejectButton.setAttribute("id", "rejectCookies");
    rejectButton.textContent = "No";

    modalContent.appendChild(p);
    modalContent.appendChild(allowButton);
    modalContent.appendChild(rejectButton);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}


document.addEventListener("DOMContentLoaded", () => {

    //changeFomrtButton();
    const modal = addBugReportForm();
    const reportButtons = addSRButton(modal);
    const smallReportButton = createSmallButton(modal);
    addCookieModal();

    document.onkeydown = (e) => handleKeyDown(e, modal, reportButtons);
    document.onclick = (e) => handleClickOutsideModal(e, modal);
    document.onmouseup = (e) => handleMouseUp(e, smallReportButton);

    let lastScrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScrollPosition > lastScrollPosition || currentScrollPosition < lastScrollPosition) {
            smallReportButton.style.display = "none";
          } else {
            smallReportButton.style.display = "block";
          }
          lastScrollPosition = currentScrollPosition;
    });

    document.getElementById('myFormContent').onsubmit = submitBugReport;

});
// For cookies.
window.onload = handlePageLoad;