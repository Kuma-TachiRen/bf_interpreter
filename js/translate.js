function codeChanged() {
    let code = document.getElementById('code').value;

    // delete comment
    code = deleteComment(code);

    // conv char to num
    code = convCharToNum(code);

    code = convRepeat(code, '+');
    code = convRepeat(code, '-');

    // atmark to shift
    code = convAtToShift(code);

    document.getElementById('rawcode').value = code;

    document.getElementById('copycode').value = cleanCode(code);
}

function cleanCode(code = '') {
    const regex = new RegExp(/[^\+-\>\<\[\]\,\.]+/g);
    code = code.replaceAll(regex, '');
    const shiftregex1 = new RegExp(/\>\</);
    const shiftregex2 = new RegExp(/\<\>/);
    while (code.search(shiftregex1) > -1) code = code.replace(shiftregex1, '');
    while (code.search(shiftregex2) > -1) code = code.replace(shiftregex2, '');
    return code;
}


function deleteComment(code = '') {
    return code.split('\n').map(function (line) {
        return line.replace(/#.*/, '');
    }).join('\n');
}

function convAtToShift(code = '') {
    let codeat = 0;
    let now = 1;
    const regex = new RegExp(/\@(\d+)/);
    while (true) {
        let codeatnext = code.search(regex)
        if (codeatnext == -1) break;
        while(codeat < codeatnext) {
            if (code[codeat] == '>') now++;
            if (code[codeat] == '<') now--;
            codeat++;
        }
        code = code.replace(regex, function (match, c) {
            let dif = c - now;
            now = c;
            codeat += Math.abs(dif);
            if (dif > 0) return '>'.repeat(dif);
            if (dif < 0) return '<'.repeat(-dif);
            return '';
        });
    }
    return code;
}

function convCharToNum(code = '') {
    const regex = new RegExp(/c\((.)\)/);
    while (code.search(regex) > -1) {
        code = code.replace(regex, function (match, c) {
            const i = c.charCodeAt(0);
            return i < 128 ? `+(${i},4)` : match;
        });
    }
    return code;
}

function convRepeat(code = '', char = '') {
    const regex = new RegExp(`\\${char}\\((\\d+),(\\d+)\\)`);
    const dir = ['<', '>'];
    while (code.search(regex) > -1) {
        code = code.replace(regex, function (match, a, b) {
            let ret = char.repeat(a);
            for (let k = 2; k <= b; k++) {
                const l = Math.ceil(Math.pow(a, 1 / k));
                const r = Math.floor(Math.pow(a, 1 / (k - 1)));
                for (let n = l; n <= r; n++) {
                    const prep = '+'.repeat(n);
                    if (n <= 1) break;
                    let x = a;
                    let tmp = `[-<${char.repeat(n)}>]<${char.repeat(x % n)}`;
                    for (let i = 1; i < k; i++) {
                        x = Math.floor(x / n);
                        const r = i == k - 1 ? x : x % n;
                        if (i == k - 1 && i % 2 == 0) tmp = '+'.repeat(r) + tmp;
                        else tmp = dir[i % 2] + '+'.repeat(r) + tmp;
                        if (i < k - 1) {
                            tmp = `[-${dir[i % 2]}${prep}${dir[1 - i % 2]}]` + tmp;
                        }
                    }
                    if (tmp.length < ret.length) ret = tmp;
                }
            }
            return ret;
        });
    }
    return code;
}