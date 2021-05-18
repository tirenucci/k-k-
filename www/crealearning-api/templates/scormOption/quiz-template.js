let minTime = null
let maxTime = null

window.addEventListener('beforeunload', () => {
    if (minTime > 0) {
        doBack("incomplete");
    } else {
        doContinue("completed")
    }

    if (maxTime > 0) {
        doBack();
    }
})

let action = __ACTION_EXIT__

let maxTimeAllowed = document.getElementById('max_time_allowed')

let maxSeconds = maxTimeAllowed.getElementsByClassName('seconds')

let d = new Date();
d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000))

const config = {
    attributes: true,
    childList: true,
    subtree: true
}

let observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'characterData') {
            if (maxTime > 0) {
                href = getPageKey()
                href += "_MAX"
                document.cookie = href + " = 0;expires=" + d.toUTCString() + ";path=/"
                if (action == "continue,message") {
                    cleWarningDialog("Vous avez atteint la limite de temps imparti pour ce grain.")
                } else if (action == "exit,no message") {
                    BlockGrain(true, false)
                } else if (action == "exit,message") {
                    BlockGrain(true, true)
                }
            }
        }
    }
})

observer.observe(maxSeconds[0], config)

if (maxTime == 0) {
    BlockGrain(false, true)
}

function BlockGrain(validate, message) {
    if (message) {
        cleWarningDialog("Vous avez atteint la limite de temps imparti pour ce grain.")
        let main = document.getElementById('main')

        main.style.cursor = "not-allowed"

        let input = main.querySelectorAll('input')

        if (input !== undefined) {
            input.forEach((i) => {
                i.style.cursor = 'not-allowed'
            })
        }

        let button = document.getElementById('btn_validate')

        button.style.cursor = 'not-allowed'

        quizManager.disable(true)
        if (validate == true) {
            quizManager.checkAnswers(true, 0)
        }

    }
}

function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date())

    let seconds = Math.floor((t / 1000) % 60)
    let minutes = Math.floor((t / 1000 / 60) % 60)
    let hours   = Math.floor((t / (1000 * 60 * 60)) % 24)
    let days    = Math.floor(t / (1000 * 60 * 60 * 24))

    return {
        "total"   : t,
        "days"    : days,
        "hours"   : hours,
        "minutes" : minutes,
        "seconds" : seconds
    }
}

function initializeClock(id, endtime) {
    let clock = document.getElementById(id)

    let hoursSpan     = clock.querySelector('.hours')
    let minutesSpan   = clock.querySelector('.minutes')
    let secondsSpan   = clock.querySelector('.seconds')

    let warningHours     = document.querySelector('#warning-hours')
    let warningMinute    = document.querySelector('#warning-minutes')
    let warningSeconds   = document.querySelector('#warning-seconds')

    function updateClock() {
        computeTime()
        let t     = getTimeRemaining(endtime)
        let hours = t.hours + t.days * 24
        hoursSpan.innerHTML   = ("0" + hours).slice(-2)
        minutesSpan.innerHTML = ("0" + t.minutes).slice(-2)
        secondsSpan.innerHTML = ("0" + Math.max(0, t.seconds)).slice(-2)

        if (id == "min_time_allowed") {
            minTime = t.total
            if (warningHours != undefined && warningMinute != undefined && warningSeconds != undefined) {
                warningHours.innerHTML   = hoursSpan.innerHTML
                warningMinute.innerHTML  = minutesSpan.innerHTML
                warningSeconds.innerHTML = secondsSpan.innerHTML
            }

            if (t.total <= 0) {
                $(document).ready(() => {
                    let button = document.getElementById('btn_validate')
                    if (button !== null) {
                        button.disabled = false
                        button.style.removeProperty("cursor")
                        button.style.removeProperty("opacity")
                    }
                })
                clearInterval(timeinterval)
            } else {
                $(document).ready(() => {
                    let button = document.getElementById('btn_validate')
                    if (button !== null) {
                        button.disabled = true
                        button.style.cursor  = "default"
                        button.style.opacity = "0.3"

                        button.addEventListener('mouseover', () => {
                            let message = document.querySelector('#warning-message')
                            message.style.display = "block"
                            message.style.position = "absolute"
                            message.style.width = "100%"
                        })
                        button.addEventListener("mouseleave", () => {
                            document.querySelector("#warning-message")
                        })
                    }
                })
            }
        }
    }
    updateClock()
    let timeinterval = setInterval(updateClock, 1000)
}

function getPageKey() {
    let href = ""
    let iframe = window.parent.querySelector('iframe')
    if (iframe.length) {
        href = iframe.getAttribute('src')
        href = href.split("/")
        href = href[href.length - 1]
        href = href.split('.')
        href = href[0]
    } else {
        href = document.URL
        href = href.split('&')
        href = href[0]
        href = href.split("=")
        href = href[1]
    }

    return href
}