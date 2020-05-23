const keywords = ["cookies", "privacy", "policy"]

consent_receipt = {
    user: "",
    title: document.title,
    url: window.location.href,
    text_elements: [],
    click_elements: [],
}

clickable = {
    id: "",
    type: "",
    text: "",
    url: "",
    clicked: false
}

var consent_window = null;
/**
 * The function finds the consent div and outputs all elements of the div
 * 
 * @returns elements of consent div
 */
function find_consent_elements() {
    divs = this.contains("div", "cookies") // change with multipe keywords
    //divs = this.contains("div", keywords_reg(keywords)) // change with multipe keywords
    for (e in divs) {
        console.log(divs[e])
        if (divs[e].clientHeight < 660 && divs[e].clientHeight != 0) {
            console.log("client hight: " + divs[e].clientHeight)
            console.log(divs[e])
            return divs[e]
        }
    }
}

// for multiple keywords regex
function keywords_reg(keys) {
    var reg = ""
    for (i = 0; i < keys.length - 1; i++) {
        reg = reg + keys[i] + "|"
    }
    reg = reg + keys[keys.length - 1] + ""
    console.log(reg)
    return reg
}

/**
 * Finds the consent node in DOM
 * @param {*} selector what element type, ex. "div"
 * @param {*} text what keywords within element type it needs to find
 */
function contains(selector, rgex) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
        return RegExp(rgex, "gi").test(element.textContent); // const regex = RegExp('^(gg|tb*|ll)'); mutliple words
    });
}

/**
 * Filters text from nested divs
 * @param {*} div_elms receives the div node
 */
function filter_text_from_consent_div(div_elms) {
    const elments = [...div_elms];
    var uniqe = [...new Set(elments.map(x => x.textContent.replace(/(\r\n|\n|\r)/gm, "")))]
    uniqe = uniqe.filter(function (e) { return e });
    for (i = 0; i < uniqe.length; i++) {
        var cont = 0;
        for (j = 1; j < uniqe.length; j++) {
            if (uniqe[i].includes(uniqe[j])) {
                uniqe.splice(j, 1)
            }
        }
    }
    console.log(uniqe)
    return uniqe
}

function get_click_elem_from_consent(div_elms) {
    console.log(div_elms)
    return add_el_listeners(div_elms)
}

function check_if_consent_is_hidden(el) {
    flag = 0;
    measures = [el.clientHeight, el.clientWidth, el.offsetHeight, el.offsetTop, el.offsetWidth]
    for (m of measures) {
        if (m <= 1)
            flag++
    }
    if (flag >= 2)
        return true
    return false
}


function isVisible(elem) {
    if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
    const style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter   = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    if (check_if_consent_is_hidden(elem)) return false
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === elem) return true;
    } while (pointContainer = pointContainer.parentNode);
    return false;
}


function add_el_listeners(elems) {
    click_elems = []
    for (let j = 0; j < elems.length; j++) {
        let el = elems[j];
        clickable = {
            id: j,
            type: el.type,
            text: el.textContent,
            url: el.href,
            clicked: false
        }
        click_elems.push(clickable)
        el.addEventListener('click', function () {
            console.log("element: pressed, index: " + j)
            click_elems[j].clicked = true
            console.log(click_elems)
            setTimeout(function () {
                if (!isVisible(consent_window))
                    chrome.storage.local.get(['logged_username'], function (result) {
                        consent_receipt.user = result.logged_username
                        send_message(consent_receipt)
                    });
            }, 800);

        });
    }

    return click_elems
}


function send_message(msg) {
    chrome.runtime.sendMessage(msg, function (response) {
        console.log(response);
    });
}


window.onload = function () {
    
    consent_window = this.find_consent_elements();
    if (!(consent_window === undefined)) {
        chrome.runtime.sendMessage("state", function (response) {
            console.log("CONTENT START: " + response);
            if(response){
                console.log("############### Content Management Script is ON ###############")
                //textContent = consent_window.textContent.replace(/(\r\n|\n|\r)/gm, "");
                consent_window.style.backgroundColor = '#39ff14';
                consent_receipt.text_elements = this.filter_text_from_consent_div(consent_window.querySelectorAll("div"))
                consent_receipt.click_elements = this.get_click_elem_from_consent(consent_window.querySelectorAll("button, a"))
            }else{
                console.log("############### Content Management Script is OFFFFF ###############")
            }
        });   
    }

};