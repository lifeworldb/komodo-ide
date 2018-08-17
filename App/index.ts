/// <reference path="node_modules/monaco-editor/monaco.d.ts" />
import * as electron from 'electron';
import {remote} from 'electron';
const app = remote.app;
const BrowserWindow = remote.BrowserWindow;
const dialog = remote.dialog;

declare var amdRequire;
var editor: monaco.editor.IStandaloneCodeEditor;
var myID = (Math.random() * 32768) >>> 0
var roomId = 45//(Math.random() * 32768) >>> 0
var io = require('socket.io-client')('http://localhost:3080/lobby')
console.log(myID)
console.log(roomId)



amdRequire(['vs/editor/editor.main'], () => {
  onModuleLoaded();
});


function onModuleLoaded() {
    editor = monaco.editor.create(document.getElementById('container'), {
        value: [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
        ].join('\n'),
        language: 'typescript',
        automaticLayout: true,
        theme: "vs-dark"
    });

    editor.addAction({
        id: 'create-room',
        label: 'Create My Room',

        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.F10,
            // chord
            monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R)
        ],

        precondition: null,

        keybindingContext: null,

        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,

        run: (ed) => {
            alert("i'm running => " + ed.getPosition())
            creteRoom()
            return null
        }
    })

    editor.addAction({
        id: 'join-room',
        label: 'Join Room',

        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.F11,
            // chord
            monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_J)
        ],

        precondition: null,

        keybindingContext: null,

        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.4,

        run: (ed) => {
            alert(`Joined at room #${roomId}`);
            joinRoom()
            return null
        }
    })

}

function creteRoom() {
    let room = require('socket.io-client')('http://localhost:3080/join');
    room.emit('room' + roomId, editor.getValue())
    /*room.on('room' + roomId, (data) => {
        if (data.owner != myID) {
            editor.setValue(data.code)
            console.log('Owner: ' + data.owner)
            console.log('Data: '+data.code)
        }
    })*/

    editor.onDidChangeModelContent(() => {
        console.log('cambio texto: ')
        let data = {
            owner: myID,
            code: editor.getValue()
        }

        room.emit('room' + roomId, data)
    })
    document.title = `Komodo Room #${roomId}`
}

function joinRoom() {
    let room = require('socket.io-client')('http://localhost:3080/join?room='+roomId)
    room.on('room' + roomId, (data) => {
        if (data.owner != myID) {
            editor.setValue(data.code)
            console.log('Owner: ' + data.owner)
            console.log('Data: '+data.code)
        }
    })
    document.title = `Komodo Joined at Room #${roomId}`;
}

function showEditorText() {
    var text = editor.getValue();
    let data = {
        code: "var erto = 233;"
    }
    alert(text);
    editor.setValue(data.code)
}


//document.getElementById('btnShowText').onclick = showEditorText;
