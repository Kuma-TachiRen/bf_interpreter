function run() {
    const code = document.getElementById('rawcode').value;
    const input = document.getElementById('input').value;

    let ptr = 0;
    let arr = [0];
    let codeat = 0;
    let inputat = 0;
    let output = '';
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
                    throwError(`At ${codeat}: Input length is insufficient`);
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
                            throwError(`At ${codeat_old}: There is not enough '['`);
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
        if (!arr[ptr]) arr[ptr] = 0;
        arr[ptr] &= 255;
        codeat++;
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

function throwError(error) {
    alert(error);
}