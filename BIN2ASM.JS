
const dropZone = document.getElementById('dropZone');
const progBar = document.getElementById('progBar');
const outFileInfo = document.getElementById('outFileInfo');
const outContent = document.getElementById('outContent');
const fileReader = new FileReader();
const maxFileSize = 1000*1024; //bytes
const colN = 16;

dropZone.ondrop = function(evt)
{
    evt.stopPropagation();
    evt.preventDefault();

    let files = evt.dataTransfer.files; // FileList object.
    if ( files.length === 1 ) {
        let f = files[0];
        if ( f.size <= maxFileSize ) {
            outFileInfo.innerText = f.name+'\n'+f.size+'bytes';
            fileReader.readAsArrayBuffer(f);
        }
    }
}

dropZone.ondragover = function(evt)
{
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

fileReader.onload = function(evt)
{
    progBar.value = 100;
    
    const content = new Uint8Array(evt.target.result);
    generateTable(content);
}


fileReader.onprogress = function(evt)
{
    let per;
    if ( evt.total === 0 ) {
        per = 0;
    }
    else {
        per = (evt.loaded/evt.total) * 100;
    }
    progBar.value = per;
}
function generateTable(content)
{
    let output = [];
    var rowN = Math.ceil((content.length)/16);
    var colBias = 0;

        output.push('<table><tr><th class="fixed01"></th>');
        output.push('</tr>');

    if ( content[0] == 254  ) {
        output.push('<tr>');
        output.push('<td>','&nbsp&nbsp&nbsp&nbspDEFB', '</td>');
        for ( let i=0; i<7 ; i++ ) {
            var sp ="";
            if ( i > 0 ) {
                sp =",";
            }
            if ( i < content.length ) {
                output.push('<td>',sp + '0x' +('0'+(content[i].toString(16)).toUpperCase()).slice(-2), '</td>');
            }
            else {
                output.push('<td></td>');
            }
        }
        output.push('</tr>');

        rowN = Math.ceil((content.length-7)/16);
        colBias = 7;
    }

    for ( let row=0; row<rowN; row++ ) {
        output.push('<tr>');
/*
        output.push('<th class="fixed02" align="right">',(row*colN).toString(16),':</th>');
        output.push('<td>','&nbsp&nbsp&nbsp&nbsp', '</td>');
*/
        output.push('<td>','&nbsp&nbsp&nbsp&nbspDEFB', '</td>');
        for ( let col=0; col<colN; col++ ) {
            let i = row * colN + col + colBias;
            var sp ="";
            if ( col > 0 ) {
                sp =",";
            }
            if ( i < content.length ) {
                output.push('<td>',sp + '0x' +('0'+(content[i].toString(16)).toUpperCase()).slice(-2), '</td>');
            }
            else {
                output.push('<td></td>');
            }
        }
        output.push('</tr>');
    }
    output.push('</table>');
    outContent.innerHTML = output.join('');
}


function generatePreviewTable()
{
    const content = new Uint8Array(50);
    // make a random like sequence (don't use for technical usage)
    for(let i=0;i<content.length;i++){
        content[i] = (37*i+(i%17)+79)%256; // these value have no reason nor meaning.
    }
    generateTable(content);
}

generatePreviewTable();