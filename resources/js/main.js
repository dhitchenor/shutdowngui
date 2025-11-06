const startButton = document.getElementById('start-button');
const addButton = document.getElementById('add-button');
const rebootSwitch = document.getElementById('reboot-switch');
const inputBox = document.getElementById('input-time');
const timeUnit = document.getElementById('time-unit');

let countdown;
let timeLeft;
let endTime;
let timerDuration;
let timerActive = false;

// Strings
let tray_show = "Show";
let tray_quit = "Quit";

async function openExternalLink(id) {
    if(id == "LicSDG") {
        await Neutralino.os.open('https://github.com/dhitchenor/shutdowngui/blob/main/LICENSE');
    } else if(id == "SrcFI") {
        await Neutralino.os.open('https://github.com/feathericons/feather');
    } else if(id == "LicFI") {
        await Neutralino.os.open('https://github.com/feathericons/feather?tab=MIT-1-ov-file#readme');
    } else {
        await Neutralino.os.open('https://github.com/dhitchenor/shutdowngui');
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');

    const hamburger_icon = document.querySelector('.hamburger-icon');
    hamburger_icon.classList.toggle('active');
}

function replaceStartBtn(isEnabled = false) {
    if(isEnabled) {
        startButton.style.display = 'none';
        addButton.style.display = 'inline-block';
    } else {
        startButton.style.display = 'inline-block';
        addButton.style.display = 'none';
    }
}

function displayTimeAnnounce(isEnabled = false) {
    if(isEnabled) {
        document.getElementById('timeannounce-container').style.display = 'inline-flex';
        document.getElementById('announce-date').textContent = new Date(endTime).toLocaleDateString();
        document.getElementById('announce-time').textContent = new Date(endTime).toLocaleTimeString();
    } else {
        document.getElementById('timeannounce-container').style.display = 'none';
    }
    
    if(rebootSwitch.checked) {
        document.getElementById('shut-down-on').style.display = 'none';
        document.getElementById('reboot-on').style.display = 'block';
    } else {
        document.getElementById('shut-down-on').style.display = 'block';
        document.getElementById('reboot-on').style.display = 'none';
    }
}

function removeQuotes(text) {
    return text.replace(/^["']|["']$/g, "");
}

function updateTimerDisplay(time) {
    const days = Math.floor(time / (60 * 60 * 24));
    const hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = time % 60;
    document.getElementById('timer').textContent =
    `${String(days).padStart(3, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function roundTime(duration) {
    if(duration % 1 !== 0) {
        if(duration % 1 < 0.5) {
            duration = Math.floor(duration);
        } else {
            duration = Math.ceil(duration);
        }
    }
    return duration;
}

async function cancelShutdown() {
    let cancel_cmd = `shutdown -c`;
    await Neutralino.os.execCommand(cancel_cmd, { background: true });
    timerDuration = 0;
}

async function runShutdown(reboot, timerDuration) {
    let restart = `-h`;
    
    if(reboot) {
        restart = `-r`;
    }

    shutdown_cmd = `shutdown ${restart} +${timerDuration}`;
    await Neutralino.os.execCommand(shutdown_cmd, { background: true });
}

function setTimer(reboot, timerDuration) {
    // removes extraneous seconds from timer
    if(timerActive) {
        timerDuration = roundTime((timerDuration + timeLeft) / 60) * 60;
    } else {
        timerDuration = roundTime((timerDuration) / 60) * 60;
    }
    let shutdownDuration = timerDuration / 60;
    
    clearInterval(countdown);
    const now = Date.now();
    endTime = now + timerDuration * 1000;

    countdown = setInterval(() => {
        timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        updateTimerDisplay(timeLeft);
        startButton.disabled = false;
        addButton.disabled = false;

        if(timeLeft <= 0) {
            clearInterval(countdown);
            rebootSwitch.disabled = false;
            timerDuration = 0;
        }
    }, 1000);
    
    runShutdown(rebootSwitch.checked, shutdownDuration);
    rebootSwitch.disabled = true;
}

async function setTray() {
    tray_quit = removeQuotes(getComputedStyle(document.getElementById("main-container")).getPropertyValue("--tray-quit").trim());
        
    if(timerActive) {
        tray_show = new Date(endTime).toLocaleString();        
    } else {
        tray_show = removeQuotes(getComputedStyle(document.getElementById("main-container")).getPropertyValue("--tray-show").trim());
    }
    
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }

    let tray = {
        icon: "/resources/icons/shutdowngui.png",
        menuItems: [
            {id: "TIMER", text: tray_show},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: tray_quit}
        ]
    };

    await Neutralino.os.setTray(tray);
}

async function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "TIMER":
            //await Neutralino.window.unminimize();
            await Neutralino.window.show();
            //await Neutralino.window.focus();
            break;
        case "QUIT":
            onWindowClose();
            break;
    }
}

async function onWindowClose() {
    await cancelShutdown();
    await Neutralino.app.exit();
}

function commenceTimer() {
    startButton.disabled = true;
    addButton.disabled = true;
    timerDuration = parseInt(inputBox.value, 10);
    const timeUnits = timeUnit.value;

    if(isNaN(timerDuration) || timerDuration <= 0) {
        startButton.disabled = false;
        addButton.disabled = false;
        return;
    }
    
    if(timeUnits === 'minutes') timerDuration *= 60;
    else if(timeUnits === 'hours') timerDuration *= 60 * 60;
    else if(timeUnits === 'days') timerDuration *= 60 * 60 * 24;
    
    setTimer(rebootSwitch.checked, timerDuration);
    timerActive = true;
    replaceStartBtn(true);
    displayTimeAnnounce(true);
}

function cancelTimer() {
    clearInterval(countdown);
    rebootSwitch.disabled = false;
    document.getElementById('timer').textContent = `000:00:00:00`;
    cancelShutdown();
    timerActive = false;
    startButton.disabled = false;
    addButton.disabled = false;
    replaceStartBtn(false);
    displayTimeAnnounce(false);
}

document.getElementById("main-container").addEventListener("change", async (e) => {
    if(e.target.classList.contains("lang-dropdown")) {
        e.currentTarget.className = "lang-" + e.target.value;

        document.getElementById("main-container").classList.remove("lang-en", "lang-eo", "lang-es");
        document.getElementById("main-container").classList.add("lang-" + e.target.value);
            
        document.querySelector("#opt-minutes").text = removeQuotes(getComputedStyle(document.getElementById("main-container")).getPropertyValue("--minutes-label").trim());
        document.querySelector("#opt-hours").text = removeQuotes(getComputedStyle(document.getElementById("main-container")).getPropertyValue("--hours-label").trim());
        document.querySelector("#opt-days").text = removeQuotes(getComputedStyle(document.getElementById("main-container")).getPropertyValue("--days-label").trim());
    }
    
    await setTray();
});

document.getElementById("main-container").addEventListener("click", async (e) => {
    if (e.target.tagName === "BUTTON") {
        const id = e.target.id;
        if(id === "start-button") {
            commenceTimer();
        } else if(id === "add-button") {
            commenceTimer();
        } else if(id === "cancel-button") {
            cancelTimer();
        }
        await setTray();
    }
    if(e.target.tagName === "SPAN" && Array.from(e.target.classList).some(cls => cls.startsWith("link-"))) {
        openExternalLink(e.target.id);
    }
});

// Initialize Neutralino
Neutralino.init();

// Register event listeners
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

// Conditional initialization:
// Set up system tray if not running on macOS
// Fix https://github.com/neutralinojs/neutralinojs/issues/615
if(NL_OS != "Darwin") {
    (async () => {
        await setTray();
    })();
}

if(NL_OS != "Linux") {
    Neutralino.app.exit();
}
