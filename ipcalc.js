
var ipcalc = {

 res: {},

 isNaIP: function(x){
    x = parseInt(x, 10);
    return (isNaN(x) || x > 255 || x < 0);
 },
 
 bitstonum: function (num)
 {
        if (num >= 8 ){
            return(255);
        }
        bitpat=0xff00; 
        while (num > 0){
            bitpat=bitpat >> 1;
            num--;
        }
        return(bitpat & 0xff);
},
 
calcNWmask: function(mask)
{
    tmpvar = parseInt(mask,10);
    if (isNaN(tmpvar) || tmpvar > 32 || tmpvar < 0){
        return false;
    }
    this.res.nmask = [];
    
    for(var i = tmpvar; i > 0; i -= 8){
        this.res.nmask.push(this.bitstonum(i));
    }
    if(this.res.nmask.length < 4){
        for(var k = this.res.nmask.length; k < 4; k++){
            this.res.nmask.push(0);
        }
    }
},
 

 basic: function(ip, mask){
    var rt=0;
    this.res.ip = ip.split('.');
    for(i in this.res.ip){
       if(this.isNaIP(this.res.ip[i])){
          return false;
       }
    } 
    
    this.calcNWmask(mask);
    var tmpvar = parseInt(mask);
    if (tmpvar == 31){
        this.res.numofaddr = "two hosts";
        this.res.firstadr = [
            this.res.ip[0] & this.res.nmask[0],
            this.res.ip[1] & this.res.nmask[1],
            this.res.ip[2] & this.res.nmask[2],
            this.res.ip[3] & this.res.nmask[3]
        ];

        this.res.lastadr = [
            this.res.ip[0] | (~ this.res.nmask[0] & 0xff),
            this.res.ip[1] | (~ this.res.nmask[1] & 0xff),
            this.res.ip[2] | (~ this.res.nmask[2] & 0xff),
            this.res.ip[3] | (~ this.res.nmask[3] & 0xff)
        ];
        return true;
    }
    if (tmpvar == 32){
        this.res.numofaddr = "one host";
        this.res.firstadr = this.res.ip;
        return true;
    }
    this.res.numofaddr = Math.pow(2,32 - tmpvar) - 2;

    this.res.bcast = [
        this.res.ip[0] | (~ this.res.nmask[0] & 0xff),
        this.res.ip[1] | (~ this.res.nmask[1] & 0xff),
        this.res.ip[2] | (~ this.res.nmask[2] & 0xff),
        this.res.ip[3] | (~ this.res.nmask[3] & 0xff)
    ];

    this.res.firstadr = [
        this.res.ip[0] & this.res.nmask[0],
        this.res.ip[1] & this.res.nmask[1],
        this.res.ip[2] & this.res.nmask[2],
        parseInt(this.res.ip[3] & this.res.nmask[3]) + 1
    ];

    this.res.lastadr = [
        this.res.bcast[0],
        this.res.bcast[1],
        this.res.bcast[2],
        parseInt(this.res.bcast[3]) - 1
    ];
    
    return true;
 },
 
 showin: function(divid){
   var labels = {
        "ip" : "IP Address",
        "nmask": "Net Mask",
        "numofaddr": "# of IPs",
        "bcast": "Broadcast",
        "firstadr": "First Address",
        "lastadr": "Last Address"
   }
     var html ="";
    for(var i in this.res){
        html += labels[i] + ':&nbsp;' + ((typeof(this.res[i]) == 'object') ? this.res[i].join('.') : this.res[i].toString());
        html += '<br>';
    }
    document.getElementById(divid).innerHTML = html;
 } 

};
