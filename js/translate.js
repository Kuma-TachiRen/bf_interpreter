function codeChanged() {
    let code = document.getElementById('code').value;

    // delete comment
    code = deleteComment(code);

    // conv char to num
    code = convCharToNum(code);

    code = convRepeat(code, '+');
    code = convRepeat(code, '-');

    document.getElementById('rawcode').value = code;
}

function deleteComment(code = '') {
    return code.split('\n').map(function (line) {
        const i = line.search('#');
        return i == -1 ? line : line.slice(0, i);
    }).join('\n');
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
                        tmp = dir[i % 2] + '+'.repeat(r) + tmp;
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