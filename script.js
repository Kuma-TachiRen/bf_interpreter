window.onload = function () {
    document.getElementById('run').addEventListener('click', run);
};

function run() {
    const code = document.getElementById('code').value;
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
                    throwError();
                    return;
                }
                arr[ptr] = input.charCodeAt(inputat);
                inputat++;
                break;
            case '[':
                if (arr[ptr] == 0) {
                    let cnt = 1;
                    while (cnt) {
                        codeat++;
                        if (codeat >= code.length) {
                            throwError('There is not enough \']\'');
                            return;
                        }
                        if (code[codeat] == '[') cnt++;
                        if (code[codeat] == ']') cnt--;
                    }
                }
            case ']':
                let cnt = -1;
                while (cnt) {
                    codeat--;
                    if (codeat < 0) {
                        throwError('There is not enough \'[\'');
                        return;
                    }
                    if (code[codeat] == '[') cnt++;
                    if (code[codeat] == ']') cnt--;
                }
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