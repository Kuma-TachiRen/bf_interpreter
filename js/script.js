window.onload = function () {
    document.getElementById('run').addEventListener('click', run);
    document.getElementById('code').addEventListener('input', codeChanged);
    document.getElementById('copy').addEventListener('click', copy);
    document.getElementById('format').addEventListener('click', format);
};

function copy() {
    var copyCode = document.getElementById('copycode');
    copyCode.select();
    document.execCommand('copy');
}

function format() {
    let code = document.getElementById('code');
}