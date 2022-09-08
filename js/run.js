function run() {
    const code = document.getElementById('rawcode').value;
    const input = document.getElementById('input').value;

    let ptr = 0;
    let arr = [0];
    let codeat = 0;
    let inputat = 0;
    let output = '';
    let looplim = 10000000;
    while (codeat < code.length) {
        switch (code[codeat]) {
            case '>':
                ptr++;
                break;
            case '<':
                ptr--;
                break;
            case '+':
                arr[ptr]++;
                break;
            case '-':
                arr[ptr]--;
                break;
            case '.':
                output += String.fromCharCode(arr[ptr]);
                break;
            case ',':
                if (inputat >= input.length) {
                    throwError(codeat, 'Input length is insufficient');
                    return;
                }
                arr[ptr] = input.charCodeAt(inputat);
                inputat++;
                break;
            case '[':
                if (arr[ptr] == 0) {
                    let cnt = 1;
                    let codeat_old = codeat;
                    while (cnt != 0) {
                        codeat++;
                        if (codeat >= code.length) {
                            throwError(codeat_old, 'There is not enough \'[\'');
                            return;
                        }
                        if (code[codeat] == '[') cnt++;
                        if (code[codeat] == ']') cnt--;
                    }
                }
                break;
            case ']':
                if (arr[ptr] != 0) {
                    let cnt = -1;
                    let codeat_old = codeat;
                    while (cnt != 0) {
                        codeat--;
                        if (codeat < 0) {
                            throwError(`At ${codeat_old}: There is not enough '['`);
                            return;
                        }
                        if (code[codeat] == '[') cnt++;
                        if (code[codeat] == ']') cnt--;
                    }
                }
                break;
        }
        if (ptr < 0) {
            throwError(codeat, 'Attempted to move to before the first cell');
            break;
        }
        if (!arr[ptr]) arr[ptr] = 0;
        arr[ptr] &= 255;
        codeat++;
        looplim--;
        if (looplim < 0) {
            throwError(codeat, 'Executable length exceeded');
            break;
        }
    }
    document.getElementById('output').value = output;

    var arrdisp = document.getElementById('array').cloneNode(false);
    document.getElementById('array').parentNode.replaceChild(arrdisp, document.getElementById('array'));
    arr.forEach(v => {
        var cell = document.createElement('td');
        cell.textContent = v;
        arrdisp.appendChild(cell);
    });
}

function throwError(at = -1, error) {
    if (at > -1) {
        const elm = document.getElementById('rawcode');
        elm.setSelectionRange(at, at + 1);
        elm.blur();
        elm.focus();
    }
    alert(`At ${at}: ${error}`);
}