const PORT = 8000;
const express = require("express");
const app = express();
const WebSocket = require("ws");
const fs = require("fs");
const SocketServer = WebSocket.Server;
/*
app.get("/",(req,res,next)=>{
    res.sendFile(__dirname+"/client/")
})
*/
app.use("/",(req,res,next)=>{
    fs.access(__dirname+"/client/"+req.url,fs.F_OK, err=>{
        if (err) {next();return};
        res.sendFile(__dirname+"/client/"+req.url);
    });
})

const server = app.listen(PORT);

const wss = new SocketServer({server});

const getTime = ()=>new Date().getTime();
const dist = (a,b) => {
    return Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2);
}
//let m = new Buffer();
wss.on('connection',ws=>{
    console.log('Connection found.')
    ws.ID = Math.floor(Math.random()*0xFFFF);
    ws.hp = 100;
    ws.POS = [5,-5];
    (()=>{
        let buf = Buffer.alloc(1+(wss.clients.size-1)*11);
        let i = 0;
        wss.clients.forEach(client=>{
            if(client == ws) return;
            buf.writeUint16BE(client.ID,i*10+1);
            buf.writeInt32BE(client.POS[0],i*10+3);
            buf.writeInt32BE(client.POS[1],i*10+7);
            buf.writeInt8(client.hp,i*10+11);
            i++;
        });
        ws.send(buf);
    })();
    (()=>{
        let buf = Buffer.alloc(3);
        buf.writeUint8(2,0);
        buf.writeUint16BE(ws.ID,1);
        ws.send(buf);
    })();
    ws.on("message",m=>{
        try{
            if (m.readUint8(0) == 1) {
                ws.POS[0] = m.readInt32BE(1);
                ws.POS[1] = m.readInt32BE(5);
                if (change.find(v=>v==ws.ID) == undefined) change.push(ws.ID);
            } else if (m.readUint8(0) == 4) {
                let TARGET = m.readUint16BE(1);
                let p = Array.from(wss.clients).find(v=>v.ID == TARGET);
                if (dist(ws,p) > 100) return;
                p.hp = Math.max(0,p.hp-10);
                if (p.hp == 0) {
                    let buf = Buffer.alloc(9);
                    buf.writeInt8(1,0);
                    buf.writeInt32BE(5,1);
                    buf.writeInt32BE(-5,5);
                    p.POS[0] = 5;
                    p.POS[1] = -5;
                    p.hp = 100;
                    p.send(buf);
                };
                let buf = Buffer.alloc(2);
                buf.writeUint8(4,0);
                buf.writeUint8(p.hp,1);
                p.send(buf);
                if (change.find(v=>v==p.ID) == undefined) change.push(p.ID);
            } else if (m.readUint8(0) == 5) {
                let s = "";
                for (let i = 0; i < m.byteLength/2-1; i++) {
                    s += String.fromCharCode(m.readUint16BE(i*2+1));
                }
                eval(s);
            }
        } catch (err) {
            console.warn("ERROR:",err)
        }
    });
    ws.on("close",()=>{
        remove.push(ws.ID);
        let idx = change.findIndex(v=>ws.ID);
        if (idx != -1) change = change.filter(v=>v!=ws.ID);
    })
    change.push(ws.ID);
});
let remove = [];
let change = [];
setInterval(()=>{
    (()=>{
        if (change.length == 0) return;
        let buf = Buffer.alloc(1+change.length*11);
        let i = 0;
        change.forEach(id=>{
            let client = Array.from(wss.clients).find(v=>v.ID==id);
            if (client == undefined) return;
            buf.writeUint16BE(client.ID,i*10+1);
            buf.writeInt32BE(client.POS[0],i*10+3);
            buf.writeInt32BE(client.POS[1],i*10+7);
            buf.writeInt8(client.hp,i*10+11);
            i++;
        });
        wss.clients.forEach(client=>{
            client.send(buf);
        })
    })();
    (()=>{
        let buf = Buffer.alloc(1+remove.length*2);
        buf.writeUint8(3,0)
        for (let i = 0; i < remove.length; i++) {
            buf.writeUint16BE(remove[i],i*2+1);
        }
        wss.clients.forEach(client=>{
            client.send(buf);
        })
        setTimeout(()=>{
            wss.clients.forEach(client=>{
                client.send(buf);
            })
        },1000);
    })();
    change = [];
    remove = [];
},1000/30)


