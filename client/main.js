//(()=>{
    let dist = (a,b) => {
        return Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2)
    }
    const getTime = () => {
        return new Date().getTime();
    }
    [()=>{
        (d=>{window[d]=false})("CHEAT");
    }].forEach(v=>v())
    let DEATHSCREEN = 0;
    let LEFT = [];
    const size = 25;
    let ws = new WebSocket("ws://"+location.host);
    let canv = document.getElementById("display")
    canv.width = document.body.clientWidth;
    canv.height = document.body.clientHeight;
    let ctx = canv.getContext("2d");
    ctx.fillStyle = "#bbbbbb";
    ctx.fillRect(0,0,canv.width,canv.height);
    let MYID = 0;
    let HP = 100;
    let players = [
        /*
        {
            id:1,
            health:100,
            pos:[
                Math.floor(Math.random()*100),
                Math.floor(Math.random()*100)
            ]
        }
        */
    ];
    let KEYS = {
        up:0,
        down:0,
        left:0,
        right:0,
    };
    let getTarget = (mx,my)=> {
        for (let i = 0; i < players.length; i++) {
            let POS = players[i].pos;
            let p = [
                Math.floor(canv.width/2 - (pos[0]-POS[0])*size/10-size/2),
                Math.floor(canv.height/2 + (pos[1]-POS[1])*size/10-size/2)
            ];
            if (mx > p[0] && mx < p[0]+size && my > p[1] && my < p[1]+size) {
                return players[i];
            }
        }
    }
    let pos = [5,-5];
    draw = ()=> {
        ctx.clearRect(0,0,canv.width,canv.height);
        if (size <= 0) return;
        for (let i=-1-Math.ceil(Math.abs(pos[0]/10)%1);i++<(canv.width/size);) {
            for (let j=-1-Math.ceil(Math.abs(pos[1]/10)%1);j++<(canv.height/size);) {
                let tileid = i+j+Math.floor(Math.abs(pos[0]/10)%2)+Math.floor(Math.abs(pos[1]/10)%2);
                tileid = Math.floor(tileid);
                //console.log((i+j-Math.floor(pos[0]+pos[1])))
                ctx.fillStyle = Math.floor(tileid%2) == 0 ? "#dddddd" : "#aaaaaa";
                let p = [
                    size*i-((pos[0]/10)%1*size),
                    size*j+((pos[1]/10)%1*size)
                ];
                ctx.fillRect(Math.max(0,p[0]),Math.max(0,p[1]),p[0]<0?size+p[0]:size,p[1]<0?size+p[1]:size);
            }
        }
        for (let i in players) {
            let POS = players[i].pos;
            let p = [
                canv.width/2 - (pos[0]-POS[0])*size/10,
                canv.height/2 + (pos[1]-POS[1])*size/10
           ];
           ctx.fillStyle = "#ff0000";
           ctx.fillRect(p[0]-size/2,p[1]-size/2,size,size);
           ctx.filStyle = "#000000";
           ctx.strokeRect(p[0]-size/2,p[1]-size/2,size,size);
        }
        ctx.fillStyle = "#dddd33";
        ctx.fillRect(canv.width/2-size/2,canv.height/2-size/2,size,size);
        ctx.fillStyle = "#000000";
        ctx.strokeRect(canv.width/2-size/2,canv.height/2-size/2,size,size);
        ctx.fillStyle = "#ff0000";
        ctx.font = "25px sans-serif";
        ctx.fillText(`${HP}/100 [${pos[0]}, ${pos[1]}]`,10,25);
        ctx.strokeText(`${HP}/100 [${pos[0]}, ${pos[1]}]`,10,25);
        if (DEATHSCREEN + 5000 > getTime()) {
            ctx.font = "100px sans-serif";
            ctx.fillStyle = "#000000";
            ctx.fillText("You die",canv.width/2-150,canv.height/2);
        }
    };
    setInterval(()=>{
        pos[0] += (KEYS.right-KEYS.left);
        pos[1] += (KEYS.up-KEYS.down);
        if (KEYS.right-KEYS.left != 0 || KEYS.up-KEYS.down != 0) {
            let pack = new ArrayBuffer(9);
            let d = new DataView(pack);
            d.setUint8(0,1);
            d.setInt32(1,pos[0]);
            d.setInt32(5,pos[1]);
            ws.send(pack);
        }
        draw();
    },1000/30)
    addEventListener("keydown",k=>{
        if (k.code == "KeyW") {
            KEYS.up = 1;
        } else if (k.code == "KeyA") {
            KEYS.left = 1;
        } else if (k.code == "KeyS") {
            KEYS.down = 1;
        } else if (k.code == "KeyD") {
            KEYS.right = 1;
        }
    });
    addEventListener("keyup",k=>{
        if (k.code == "KeyW") {
            KEYS.up = 0;
        } else if (k.code == "KeyA") {
            KEYS.left = 0;
        } else if (k.code == "KeyS") {
            KEYS.down = 0;
        } else if (k.code == "KeyD") {
            KEYS.right = 0;
        }
    });
    let mobile = (()=>{
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    })();
    let ATTACK = (e)=>{
        console.log(CHEAT)
        let target = getTarget(e.offsetX,e.offsetY);
        console.log(target);
        if (target != null && (!CHEAT||dist(target.pos,pos)>=100)) {
            console.log("HHH");
            if (CHEAT&&dist(target.pos,pos)>=100) {
                console.log("TTTT")
                let B = new ArrayBuffer(9);
                let d = new DataView(B);
                d.setUint8(0,1);
                pos = [target.pos[0],target.pos[1]];
                d.setInt32(1,target.pos[0]);
                d.setInt32(5,target.pos[1]);
                ws.send(B);
            }
            let buf = new ArrayBuffer(3);
            let d = new DataView(buf);
            d.setUint8(0,4);
            d.setUint16(1,target.id);
            ws.send(buf);
        }
    }
    if (mobile) {
        let down = false;
        canv.addEventListener("pointerdown",e=>{
            ATTACK(e);
            down = true
            let p = [e.offsetX,e.offsetY];
            let sX = 0;
            let sY = 0;
            if (p[0] < canv.width/2-100) {
                sX = -1
            } else if (p[0] > canv.width/2+100) {
                sX = 1;
            };
            if (p[1] < canv.height/2-100) {
                sY = 1
            } else if (p[1] > canv.height/2+100) {
                sY = -1;
            };
            KEYS.up = sY == 1 ? 1 : 0;
            KEYS.down = sY == -1 ? 1 : 0;
            KEYS.left = sX == -1 ? 1 : 0;
            KEYS.right = sX == 1 ? 1 : 0;
        });
        canv.addEventListener("pointermove",e=>{
            if (!down) return;
            let p = [e.x,e.offsetY];
            document.title = (p);
            let sX = 0;
            let sY = 0;
            if (p[0] < canv.width/2-100) {
                sX = -1
            } else if (p[0] > canv.width/2+100) {
                sX = 1;
            };
            if (p[1] < canv.height/2-100) {
                sY = 1
            } else if (p[1] > canv.height/2+100) {
                sY = -1;
            };
            KEYS.up = sY == 1 ? 1 : 0;
            KEYS.down = sY == -1 ? 1 : 0;
            KEYS.left = sX == -1 ? 1 : 0;
            KEYS.right = sX == 1 ? 1 : 0;
        });
        canv.addEventListener("pointerup",e=>{
            down = false;
            KEYS.up = 0
            KEYS.down = 0
            KEYS.left = 0
            KEYS.right = 0
        });
    }
    canv.addEventListener("mousedown",e=>{
        ATTACK(e);
    });
    ws.addEventListener("message", evt => {
        evt.data.stream().getReader().read()
            .then(r=>r.value)
            .then(r=>{
                let d = new DataView(r.buffer);
                if (d.getUint8(0) == 0) {
                    for (let i = 0; i < r.buffer.byteLength/11-1; i++) {
                        let ID = d.getUint16(i*10+1);
                        if (ID == MYID) continue;
                        if (LEFT.findIndex(v=>v==ID) != -1) continue;
                        let POS = [
                            d.getInt32(i*10+3),
                            d.getInt32(i*10+7)
                        ];
                        let HP = d.getUint8(i*10+11);
                        let p = players.find(v=>v.id==ID);
                        if (p == undefined) {
                            players.push({
                                id:ID,
                                health:HP,
                                pos:POS
                            })
                        } else {
                            p.pos[0]=POS[0];
                            p.pos[1]=POS[1];
                            p.health = HP;
                        }
                    }
                } else if (d.getUint8(0) == 1) {
                    pos[0] = d.getInt32(1);
                    pos[1] = d.getInt32(5);
                } else if (d.getUint8(0) == 2) {
                    MYID = d.getUint16(1);
                } else if (d.getUint8(0) == 3) {
                    for (let i = 0; i < r.buffer.byteLength/2-1; i++) {
                        console.log(d.getUint16(i*2+1));
                        let id = d.getUint16(i*2+1);
                        let p = players.findIndex(v=>v.id==id)
                        if (p != -1) {
                            delete players[p];
                            LEFT.push(id);
                            setTimeout(()=>{
                                if (LEFT.findIndex(v=>v==id) != -1) {
                                    delete LEFT[LEFT.findIndex(v=>v==id)];
                                    if (players.findIndex(v=>v.id==id) != -1) {
                                        delete players[players.findIndex(v=>v.id==id)];
                                    }
                                }
                            },5000);
                        }
                    }
                } else if (d.getUint8(0) == 4) {
                    HP = d.getUint8(1);
                    if (HP == 100) {
                        DEATHSCREEN = getTime();
                    }
                }
            })
    });
//})()
