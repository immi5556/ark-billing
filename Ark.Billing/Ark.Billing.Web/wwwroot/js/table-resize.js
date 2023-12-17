var ark_table_resize = (() => {
    let tw = 0, table;
    const createResizableTable = function (tbl) {
        table = tbl;
        //tw = parseInt(window.getComputedStyle(table).width, 10);
        tw = table.offsetWidth;
        const cols = table.querySelectorAll('th');
        [].forEach.call(cols, function (col) {
            // Add a resizer element to the column
            const resizer = document.createElement('div');
            resizer.classList.add('resizer');

            // Set the height
            resizer.style.height = `${table.offsetHeight}px`;

            col.appendChild(resizer);

            createResizableColumn(col, resizer);
        });
    };

    const createResizableColumn = function (col, resizer) {
        let x = 0;
        let w = 0, nw = 0;

        const mouseDownHandler = function (e) {
            x = e.clientX;
            console.log(col.nextElementSibling?.outerHTML);
            const styles = window.getComputedStyle(col);
            if (col.nextElementSibling?.outerHTML) nw = parseInt(window.getComputedStyle(col.nextElementSibling).width, 10);
            w = parseInt(styles.width, 10);
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);

            resizer.classList.add('resizing');
        };

        const mouseMoveHandler = function (e) {
            const dx = e.clientX - x;
            //const ltw = parseInt(window.getComputedStyle(table).width, 10);//subtract the clientx buffer
            const ltw = table.offsetWidth;
            console.log(w, dx, w + dx, col.style.width, 'next-sib', nw - dx, 'table-width', tw, ltw);
            if (col.nextElementSibling?.outerHTML && nw - dx > 0 && nw - dx <= nw + w) {
                col.style.width = `${(w + dx)}px`;
                col.nextElementSibling.style.width = `${nw - dx}px`;
                //if (ltw > tw) table.offsetWidth = `${tw}px`;
                //table.offsetWidth = `${tw}px`;
            }
            //var newp = (w + dx) * 100 / w;
            //var col_perc = parseInt(col.style.width.replace('%', '') || '0');
            //console.log(col.style.width, newp, col_perc, col);
            //var new_col_perc = (newp / 100) * col_perc + 1;
            //col.style.width = `${new_col_perc}%`;
        };

        const mouseUpHandler = function () {
            resizer.classList.remove('resizing');
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        resizer.addEventListener('mousedown', mouseDownHandler);
    };

    return {
        init: createResizableTable
    }
})();