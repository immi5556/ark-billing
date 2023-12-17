/* Shivving (IE8 is not supported, but at least it won't look as awful)
/* ========================================================================== */

(function (document) {
    var
        head = document.head = document.getElementsByTagName('head')[0] || document.documentElement,
        elements = 'article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output picture progress section summary time video x'.split(' '),
        elementsLength = elements.length,
        elementsIndex = 0,
        element;

    while (elementsIndex < elementsLength) {
        element = document.createElement(elements[++elementsIndex]);
    }

    element.innerHTML = 'x<style>' +
        'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
        'audio[controls],canvas,video{display:inline-block}' +
        '[hidden],audio{display:none}' +
        'mark{background:#FF0;color:#000}' +
        '</style>';

    return head.insertBefore(element.lastChild, head.firstChild);
})(document);

/* Prototyping
/* ========================================================================== */

(function (window, ElementPrototype, ArrayPrototype, polyfill) {
    function NodeList() { [polyfill] }
    NodeList.prototype.length = ArrayPrototype.length;

    ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
        ElementPrototype.mozMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        ElementPrototype.oMatchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        function matchesSelector(selector) {
            return ArrayPrototype.indexOf.call(this.parentNode.querySelectorAll(selector), this) > -1;
        };

    ElementPrototype.ancestorQuerySelectorAll = ElementPrototype.ancestorQuerySelectorAll ||
        ElementPrototype.mozAncestorQuerySelectorAll ||
        ElementPrototype.msAncestorQuerySelectorAll ||
        ElementPrototype.oAncestorQuerySelectorAll ||
        ElementPrototype.webkitAncestorQuerySelectorAll ||
        function ancestorQuerySelectorAll(selector) {
            for (var cite = this, newNodeList = new NodeList; cite = cite.parentElement;) {
                if (cite.matchesSelector(selector)) ArrayPrototype.push.call(newNodeList, cite);
            }

            return newNodeList;
        };

    ElementPrototype.ancestorQuerySelector = ElementPrototype.ancestorQuerySelector ||
        ElementPrototype.mozAncestorQuerySelector ||
        ElementPrototype.msAncestorQuerySelector ||
        ElementPrototype.oAncestorQuerySelector ||
        ElementPrototype.webkitAncestorQuerySelector ||
        function ancestorQuerySelector(selector) {
            return this.ancestorQuerySelectorAll(selector)[0] || null;
        };
})(this, Element.prototype, Array.prototype);

/* Helper Functions
/* ========================================================================== */

function generateTableRow() {
    var emptyColumn = document.createElement('tr');
    emptyColumn.innerHTML = `<td contenteditable><a class="cut">-</a><label data-slno>0</label></td>
        <td><span contenteditable></span></td>
		<td><span contenteditable></span></td>
        <td><span contenteditable>1</span></td>
		<td><span data-prefix>${currency}</span><span contenteditable>0.00</span></td>
		<td><span data-prefix>${currency}</span><span style="min-width: 1em;display: inline-block;">0.00</span></td>`;
    console.log(emptyColumn.innerHTML)
    return emptyColumn;
}


function parseFloatHTML(element) {
    if (!element || !element.innerHTML) return 0;
    return parseFloat(element.innerHTML.replace(/[^\d\.\-]+/g, '')) || 0;
}

function parsePrice(number) {
    //return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1,`);
    if ((number || '').toString().trim().length == 0) return 0.00;
    return number.toFixed(2).replace(`/(\d)(?=(\d\d\d)+([^\d]|${currency}))/g`, `${currency}1,`);
}

/* Update Number
/* ========================================================================== */

function updateNumber(e) {
    var
        activeElement = document.activeElement,
        value = parseFloat(activeElement.innerHTML),
        wasPrice = activeElement.innerHTML == parsePrice(parseFloatHTML(activeElement));

    if (!isNaN(value) && (e.keyCode == 38 || e.keyCode == 40 || e.wheelDeltaY)) {
        e.preventDefault();

        value += e.keyCode == 38 ? 1 : e.keyCode == 40 ? -1 : Math.round(e.wheelDelta * 0.025);
        value = Math.max(value, 0);

        activeElement.innerHTML = wasPrice ? parsePrice(value) : value;
    }

    updateInvoice(e);
}

/* Update Invoice
/* ========================================================================== */

function updateInvoice() {
    var total = 0;
    var cells, price, total, a, i;
    //var page = (ele.closest && ele.closest(".page")) || (ele.target && ele.target.closest(".page")) || ele;
    //console.log(ele, page);
    //if (!page || !page.querySelectorAll) return;
    // update inventory cells
    // ======================
    let slno_cnt = 0;
    for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
        if (!a[i].querySelector('[data-slno]')) continue;
        // get inventory row cells
        cells = a[i].querySelectorAll('span:last-child');

        var c2 = parseFloatHTML(cells[2]);
        var c3 = parseFloatHTML(cells[3]);
        console.log(`parse float ${c2}, ${c3}`, cells);
        // set price as cell[2] * cell[3]
        price = c2 * c3;

        // add price to total
        total += price;

        // set row total
        cells[4].innerHTML = price;
        a[i].querySelector('[data-slno]').innerHTML = ++slno_cnt;
    }

    // update balance cells
    // ====================

    // get balance cells
    cells = document.querySelectorAll('table.balance td:last-child span:last-child');

    // set total
    cells[0].innerHTML = total;

    // set balance and meta balance
    //cells[2].innerHTML = page.querySelector('table.meta tr:last-child td:last-child span:last-child').innerHTML = parsePrice(total - parseFloatHTML(cells[1]));
    cells[2].innerHTML = parsePrice(total - parseFloatHTML(cells[1]));

    // update prefix formatting
    // ========================

    //var prefix = document.querySelector('#prefix').innerHTML;
    var prefix = currency;
    for (a = document.querySelectorAll('[data-prefix]'), i = 0; a[i]; ++i) a[i].innerHTML = prefix;

    // update price formatting
    // =======================

    for (a = document.querySelectorAll('span[data-prefix] + span'), i = 0; a[i]; ++i) if (document.activeElement != a[i]) a[i].innerHTML = parsePrice(parseFloatHTML(a[i]));
}

/* On Content Load
/* ========================================================================== */

function onContentLoad() {
    //[...document.querySelectorAll(".page")].forEach(t => {
    updateInvoice();
    //});

    var
        input = document.querySelector('input'),
        image = document.querySelector('img');

    function onClick(e) {
        var element = e.target.querySelector('[contenteditable]'), row;

        //element && e.target != document.documentElement && e.target != document.body && placeCaretAtEnd(element);
        var page = e.target.closest(".page");
        if (e.target.matchesSelector('.add')) {
            page.querySelector('table.inventory tbody').appendChild(generateTableRow());
        }
        else if (e.target.className == 'cut') {
            row = e.target.ancestorQuerySelector('tr');
            row.parentNode.removeChild(row);
        } else {
            //placeCaretAtEnd(e.target)
        }
        updateInvoice(page);
    }

    function onEnterCancel(e) {
        e.preventDefault();

        image.classList.add('hover');
    }

    function onLeaveCancel(e) {
        e.preventDefault();

        image.classList.remove('hover');
    }

    function onFileInput(e) {
        image.classList.remove('hover');

        var
            reader = new FileReader(),
            files = e.dataTransfer ? e.dataTransfer.files : e.target.files,
            i = 0;

        reader.onload = onFileLoad;

        while (files[i]) reader.readAsDataURL(files[i++]);
        e.preventDefault();
    }

    function onFileLoad(e) {
        var data = e.target.result;

        image.src = data;
    }

    if (window.addEventListener) {
        document.addEventListener('click', onClick);

        document.addEventListener('mousewheel', updateNumber);
        document.addEventListener('keydown', updateNumber);

        document.addEventListener('keydown', updateInvoice);
        document.addEventListener('keyup', updateInvoice);
        document.addEventListener('keyup', invoiceBreak);

        input.addEventListener('focus', onEnterCancel);
        input.addEventListener('mouseover', onEnterCancel);
        input.addEventListener('dragover', onEnterCancel);
        input.addEventListener('dragenter', onEnterCancel);

        input.addEventListener('blur', onLeaveCancel);
        input.addEventListener('dragleave', onLeaveCancel);
        input.addEventListener('mouseout', onLeaveCancel);

        input.addEventListener('drop', onFileInput);
        input.addEventListener('change', onFileInput);

        document.querySelector("#btn_save_template").addEventListener("click", (e) => {
            if (document.getElementById('tepm_name').value)
                buildTemplate();
        });
    }

    [...document.querySelectorAll(".page table.inventory")].forEach(t => ark_table_resize.init(t));
}

window.addEventListener && document.addEventListener('DOMContentLoaded', onContentLoad);

window.addEventListener("beforeprint", (event) => {
    console.log("Before print");
});

window.addEventListener("afterprint", (event) => {
    console.log("After print");
});

function invoiceBreak(e) {
    var par = e.target.closest('article');
    if (checkOverflow(par)) {
        console.log(`invoice box overlowing..`, par);
        var cur_page = par.closest(".page");
        cur_page.querySelector("table.balance").remove();
        cur_page.querySelector(".continue-label").style.display = '';
        var ddm = ark_util.textToDom(template_page_next);
        document.body.appendChild(ddm);
        var sll = ddm.querySelector("table.inventory tbody tr td label[data-slno]");
        sll.innerHTML = '-';
        sll.removeAttribute('data-slno');
        sll.setAttribute('data-slno-extn', ''); //contenteditable
        var eds = ddm.querySelectorAll("table.inventory tbody tr td");
        [...eds].forEach(t => t.innerHTML = '-')
        setTimeout(() => {
            var new_desc = ddm.querySelector("table.inventory tbody tr td:nth-child(3)");
            new_desc.focus();
            new_desc.innerHTML = "<span contenteditable></span>";
            [...ddm.querySelectorAll("table.inventory")].forEach(t => ark_table_resize.init(t));
        }, 0)
        //const range = window.document.createRange();
        //range.setStart(new_desc, 0);
        //range.setEnd(new_desc, 0);
        //const selection = window.getSelection();
        //selection.removeAllRanges();
        //selection.addRange(range);
    } else {
        console.log(`invoice box not overflowing..`, par);
    }
}

function resize_col() {
    $("table").resizableColumns({
        //store: store
    });
}

function arrangeRows() {
    // arrange rows spacing
    // =======================
    var pages = [...document.querySelectorAll(".page")];
    var fnadd = (article, next_rows) => {
        article.querySelector('table.inventory tbody');
        //move each next page rows in to cuurent page and check the height is optimized 
        (next_rows || []).forEach(t => {
            //article.
        });
    }
    if (pages.length > 1) {
        pages.forEach((t, idx) => {
            var art = t.querySelector("article");
            if (checkOverflow(art)) {
                if (pages[idx + 1]) {
                    var rows = pages[idx + 1].querySelectorAll('table.inventory tbody tr');
                    fnadd(art, rows);
                }
            }
        });
    }
}

function checkOverflow(el) {
    if (!el || !el.style) return;
    var curOverflow = el.style.overflow;

    if (!curOverflow || curOverflow === "visible")
        el.style.overflow = "hidden";

    //var isOverflowing = el.clientWidth < el.scrollWidth
    //    || el.clientHeight < el.scrollHeight;
    console.log('article scroll height', el.clientHeight, el.scrollHeight)
    var isOverflowing = el.clientHeight < el.scrollHeight;
    el.style.overflow = curOverflow;
    return isOverflowing;
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function buildTemplate() {
    var getcols = () => {
        return [...document.querySelectorAll('[ark-inv-col]')].map(t => t.outerHTML);
    }
    var data = {
        name: `${document.getElementById('tepm_name').value}`,
        title: `${document.querySelector('[ark-inv-title]').innerHTML}`,
        address: `${document.querySelector('[ark-inv-address]').innerHTML}`,
        to: `${document.querySelector('[ark-inv-to]').innerHTML}`,
        to_address: `${document.querySelector('[ark-inv-to-address]').innerHTML}`,
        uq_type: `${document.querySelector('[ark-inv-seq]').innerHTML}`,
        //logo: `${document.querySelector('[ark-inv-logo]').files[0]}`,
        columns: getcols(),

    }
    var fd = new FormData();
    fd.append("logo", document.querySelector('[ark-inv-logo]').files[0]);
    fd.append("template", JSON.stringify(data));
    var fnn = ark_util.sanitizeFilename(document.getElementById('tepm_name').value);
    fetch(`/ama/template/save/${fnn}`, {
        method: 'POST',
        body: fd
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
        })
        .catch(error => console.error('Error:', error));
    return data;
}


var template_page_next = `<div class="page">
        <header>
            <h1 ark-editable contenteditable="">Invoice</h1>
            <address style="font-size:xx-small;height:100px;" contenteditable>
                <p>A.M.A. Traders</p>
                <p>No 31, Victoria Garden, Jawaharlal Nerhu Rd, Koyambedu<br>Chennai - 600107</p>
                <p>email: ameer2252009@gmail.com</p>
                <p>Phone / Mob: 9840302157 / 9994216173</p>
            </address>
            <span>
                <img alt="" src="/img/ama_traders_1.png" height="75">
                <input type="file" accept="image/*">
            </span>
        </header>
        <article style="height:780px;">
            <table class="inventory">
                <thead>
                    <tr>
                        <th style="width:20px;"><span contenteditable>Sl <br />No</span></th>
                        <th style="width:40px;"><span contenteditable>HSN <br />Code</span></th>
                        <th><span contenteditable>பொருள்</span></th>
                        <th style="width:70px;"><span contenteditable>அளவு <br /> கிலோ எண்கள் </span></th>
                        <th style="width:100px;"><span contenteditable>ஒன்றின் விலை <br /> ரூ . பை </span></th>
                        <th style="width:100px;"><span contenteditable>மொத்தத் தொகை <br /> ரூ . பை</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td contenteditable=""><a class="cut">-</a><label data-slno>1</label></td>
                        <td><span contenteditable></span></td>
                        <td><span contenteditable></span></td>
                        <td><span contenteditable>1</span></td>
                        <td><span data-prefix>$</span><span contenteditable>0.00</span></td>
                        <td><span data-prefix>$</span><span contenteditable>0.00</span></td>
                    </tr>
                </tbody>
            </table>
            <div style="height:40px;width: 100%; border: 1px;">
                <a class="add">+</a>
                <span class="continue-label" style="float:right;margin-top: 10px;display:none;font-family: monospace;">continued...</span>
            </div>
            <table class="balance">
                <tr>
                    <th><span contenteditable>Total</span></th>
                    <td><span data-prefix>$</span><span contenteditable>600.00</span></td>
                </tr>
                <tr>
                    <th><span contenteditable>Amount Paid</span></th>
                    <td><span data-prefix>$</span><span contenteditable>0.00</span></td>
                </tr>
                <tr>
                    <th><span contenteditable>Balance Due</span></th>
                    <td><span data-prefix>$</span><span contenteditable>0.00</span></td>
                </tr>
            </table>

        </article>
        <aside>
            <h1 style="text-align:left;"><span contenteditable>Additional Notes</span></h1>
            <div contenteditable>
                <p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
            </div>
        </aside>
    </div>`