/*
______________________________________________________________________
00000_______________00000_____________________________________________
0___________________0_________________0________________0______________
0___________________0_________________0________________0______________
0___________0_______0_________0_______0________________0______________
000___0_00_____000__000__000____0_00__0________________0__0__000______
0_____00__0_0_0_____0___0___0_0_00__0_0000___00__0_00__0_0__0_________
0_____0_____0__000__0___00000_0_0_____0___0_0__0_00__0_00____000______
0_____0_____0_____0_0___0___0_0_0_____0___0_0000_0___0_0_0______0_____
00000_0_____0_0000__0___0___0_0_0_____0000__0__0_0___0_0__0_0000______
*/

var asciiBanner = '______________________________________________________________________00000_______________00000_____________________________________________0___________________0_________________0________________0______________0___________________0_________________0________________0______________0___________0_______0_________0_______0________________0______________000___0_00_____000__000__000____0_00__0________________0__0__000______0_____00__0_0_0_____0___0___0_0_00__0_0000___00__0_00__0_0__0_________0_____0_____0__000__0___00000_0_0_____0___0_0__0_00__0_00____000______0_____0_____0_____0_0___0___0_0_0_____0___0_0000_0___0_0_0______0_____00000_0_____0_0000__0___0___0_0_0_____0000__0__0_0___0_0__0_0000______';

(function($) {  
        $.fn.extend({  
            //Let the user resize the canvas to the size they want  
            resizeCanvas:  function(w, h) {  
                var c = $(this)[0]  
                c.width = w;  
                c.height = h  
            }  
        })  
    })(jQuery)

function OnReady(){

    // temp crap till I fix this
    var canvasw = 580; var canvash = 104; var imgh = 10; var imgw = 70; var drawheader = []; for(var i = 0; i < imgh*imgw; i++) drawheader[i] = 255; header = [];

    for(var i=0; i<asciiBanner.length; i++) header[i] = asciiBanner[i] == '_' ? 0 : 1;

    var drawheader  = new Array();
    var conwayfront = new Array();
    var conwayback  = new Array();
    var backbuffer  = new Array();
    
    window.drawstate  = 0;
    var frame         = 0;
    var framerate     = 15;
    window.animating  = false;


    for( var j = 0; j < imgh; j++ ){
        for( var i = 0; i < imgw; i++ ){
            drawheader[i + j*imgw] = header[i + j*imgw];
            conwayfront[i + j*imgw] = 0;
            conwayback[i + j*imgw] = drawheader[i + j*imgw] > 0 ? 1 : 0;
        }
    }
	
    function draw(){
      var canvas = document.getElementById('headercanvas');
      
      $('#headercanvas').resizeCanvas($('#headercanvas').parent().width(), 104); 
      canvasw = $('#headercanvas').parent().width();

      if (canvas.getContext){
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgb(17,17,17)';
        ctx.fillRect( 0, 0, canvasw, canvash );

        for( var j = 0; j < imgh; j++ ){
            for( var i = 0; i < imgw; i++ ){
                if( drawheader[i + (j*imgw)] != 0 ){
                    var radius = 3*($(window).width() < 600 ? $(window).width()/600 : 1);
                    ctx.fillStyle = 'rgb(' + drawheader[i + (j*imgw)] + ',' + drawheader[i + (j*imgw)] + ',' + drawheader[i + (j*imgw)] + ')';
                    ctx.beginPath();
                    ctx.arc(radius + i*(canvasw/imgw), radius + j*(canvash/imgh), radius, 0, Math.PI*2, true);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
      }
    }
    
    function HeaderReset() {
        drawstate = Math.floor( Math.random() * 4 ) + 1;
        frame = 0;
        if( animating == false ){
          for( var j = 0; j < imgh; j++ ){
            for( var i = 0; i < imgw; i++ ){
              conwayfront[i + j*imgw] = 0;
              conwayback[i + j*imgw] = drawheader[i + j*imgw] > 0 ? 1 : 0;
            }
          }
          animating = true;
        } else animating = false;
        //setTimeout( function(){ animating = false; }, 10000 );
    }
    
    // --- //
    
    var x = Math.floor( Math.random() * imgw );
    var y = Math.floor( Math.random() * imgh );
    var direction = Math.floor( Math.random() * 4 );
    
    // --- //
    
    function GetCell( x, y ){
        if( x < 0 ) x += imgw;
        if( y < 0 ) y += imgh;
        if( x >= imgw ) x -= imgw;
        if( y >= imgh ) y -= imgh;

        return conwayback[x + y*imgw] > 0 ? 1 : 0;
    }
    
    function NumNeighbors( x, y ){
        return GetCell(x+1,y)+GetCell(x-1,y)+GetCell(x,y+1)+GetCell(x,y-1)+GetCell(x+1,y+1)+GetCell(x-1,y-1)+GetCell(x+1,y-1)+GetCell(x-1,y+1);
    }
    
    function FrameCallback(){
       
        switch( animating ? drawstate : 0 ){
            
            case 0:
            for( var j = 0; j < imgh; j++ ){
                for( var i = 0; i < imgw; i++ ){
                    if( header[i + j*imgw] > 0 ){
                        drawheader[i + j*imgw] += 10;
                        if( drawheader[i + j*imgw] > 255 ) drawheader[i + j*imgw] = 255;
                    } else {
                        drawheader[i + j*imgw] -= 20;
                        if( drawheader[i + j*imgw] < 0 ) drawheader[i + j*imgw] = 0;
                    }
                }
            }            
            break;
            
            case 1:
            for( var j = 0; j < imgh; j++ ){
                for( var i = 0; i < imgw; i++ ){
                    drawheader[i + j*imgw] = Math.floor( Math.random() * 500 ) > 0 ? drawheader[i + j*imgw] : 0;
                }
            }
            break;
            
            // --- //

            case 2:
            for( var j = 0; j < imgh; j++ ){
                for( var i = 0; i < imgw; i++ ){
                    if( drawheader[i + j*imgw] >= 0 ) drawheader[i + j*imgw] -= 2;
                }
            }
            drawheader[x + y*imgw] = 255;
            if( frame % ( Math.floor( Math.random() * 2 ) * 2 + 1 ) == 0 ){
                direction += Math.floor( Math.random() * 3 ) - 1;
                if( direction < 0 ) direction = 0;
                if( direction > 3 ) direction = direction % 4;
            }
            switch( direction ){
                case 0:
                y++;
                break;
                
                case 1:
                x++;
                break;
                
                case 2:
                y--;
                break;
                
                case 3:
                x--;
                break;
            }
            if( x >= imgw )x = x % imgw;
            if( y >= imgh )y = y % imgh;
            if( x < 0 ) x = imgw + x;
            if( y < 0 ) y = imgh + y;
            break;
            
            // --- //
            
            case 3:
            if( frame % 15 == 0 ){
                for( var j = 0; j < imgh; j++ ){
                    for( var i = 0; i < imgw; i++ ){
                        var cell = conwayback[i + j*imgw];
                        var nbrs = NumNeighbors( i, j );
                        if( nbrs < 2 ) cell = 0;
                        if( nbrs > 3 ) cell = 0;
                        if( nbrs == 3 ) cell = 1;
                        conwayfront[i + j*imgw] = cell;
                    }
                }
                for( var j = 0; j < imgh; j++ ){
                    for( var i = 0; i < imgw; i++ ){
                        conwayback[i + j*imgw] = conwayfront[i + j*imgw];
                    }
                }
            }
            for( var j = 0; j < imgh; j++ ){
                for( var i = 0; i < imgw; i++ ){
                    if( conwayback[i + j*imgw] > 0 ){
                        drawheader[i + j*imgw] += 10;
                        if( drawheader[i + j*imgw] > 255 ) drawheader[i + j*imgw] = 255;
                    } else {
                        drawheader[i + j*imgw] -= 10;
                        if( drawheader[i + j*imgw] < 0 ) drawheader[i + j*imgw] = 0;
                    }
                }
            }
            break;
           
            // --- //

            case 4:
            for( var j = 0; j < imgh; j++ ){
                for( var i = 0; i < imgw; i++ ){
                    backbuffer[i + j*imgw] = drawheader[i + j*imgw];
                }
            }
            for( var i = 0; i < imgw/2; i++ ){
                for( var j = 0; j < imgh; j++ ){
                    drawheader[i + (imgw/2) + j*imgw] = backbuffer[i + (imgw/2) - 1 + j*imgw];
                    drawheader[(imgw/2) - ( i + 1 ) + j*imgw] = backbuffer[(imgw/2) - i + j*imgw];
                }
            }
            for( var j = 0; j < imgh; j++ ){
                drawheader[imgw/2 + j*imgw] = 0;
                drawheader[imgw/2 + 1 + j*imgw] = 0;
            }
            for( var j = imgh - 1; j > Math.floor( ( Math.random() * Math.random() * imgh ) ); j-- ){
                drawheader[imgw/2 + j*imgw] = 255;
                drawheader[imgw/2 + 1 + j*imgw] = 255;
            }
            break;
    
            // --- //

            case 5:
            for( var j = 0; j < imgh; j++ ){
                for( var i = 0; i < imgw; i++ ){
                    var xalpha = Math.sin( (Math.PI * i * frame) / imgw );
                    var yalpha = Math.sin( (3 * j * frame ) / imgh );
                    var xfad = Math.sin( (Math.PI * i ) / imgw );
                    var yfad = Math.sin( (Math.PI * j ) / imgh );
                    drawheader[i + j*imgw] = Math.floor( ( xalpha * yalpha * 255 * xfad * yfad ) + ( header[i + j*imgw] / frame ) );
                    if( drawheader[i + j*imgw] > 255 ) drawheader[i + j*imgw] = 255;
                }
            }
            break;
        }

        draw();
        setTimeout(FrameCallback, 1000/framerate);
        frame++;
    }
    
    // ---- //
    
    FrameCallback();
    
    // ---- //

    var canvaswidth = 400;
    var canvasheight = 300;

    var mousex = 0;
    var mousey = 0;
    
    var seqmatrix = [];
    
    var displaymatrix = [];
    
    for(var i = 0; i < 16; i++){
        
        seqmatrix[i] = new Array();
        
        displaymatrix[i] = new Array();
        
        for(var j = 0; j < 16; j++){
            
            seqmatrix[i][j] = 0;
            
            displaymatrix[i][j] = 0;
            
        }
        
    }
    
    seqmatrix[0]['name'] = "";
    seqmatrix[1]['name'] = "Kick";
    seqmatrix[2]['name'] = "Snare";
    seqmatrix[3]['name'] = "E4";
    seqmatrix[4]['name'] = "D4";
    seqmatrix[5]['name'] = "C4";
    seqmatrix[6]['name'] = "B4";
    seqmatrix[7]['name'] = "A4";
    seqmatrix[8]['name'] = "G3";
    seqmatrix[9]['name'] = "F3";
    seqmatrix[10]['name'] = "E3";
    seqmatrix[11]['name'] = "D3";
    seqmatrix[12]['name'] = "C3";
    seqmatrix[13]['name'] = "B3";
    seqmatrix[14]['name'] = "A3";
    seqmatrix[15]['name'] = "G2";
    
    seqmatrix[1]['play'] = function(){audiogenerator['kick'].playnote(0.2,0.125);};
    seqmatrix[2]['play'] = function(){audiogenerator['perc'].playnote(0.2,0.125);};
    seqmatrix[3]['play'] = function(){audiogenerator['chimes'].playnote(64,0.1,0.1);};
    seqmatrix[4]['play'] = function(){audiogenerator['chimes'].playnote(62,0.1,0.1);};
    seqmatrix[5]['play'] = function(){audiogenerator['chimes'].playnote(60,0.1,0.1);};
    seqmatrix[6]['play'] = function(){audiogenerator['chimes'].playnote(59,0.1,0.1);};
    seqmatrix[7]['play'] = function(){audiogenerator['chimes'].playnote(58,0.1,0.1);};
    seqmatrix[8]['play'] = function(){audiogenerator['chimes'].playnote(55,0.1,0.1);};
    seqmatrix[9]['play'] = function(){audiogenerator['chimes'].playnote(53,0.1,0.1);};
    seqmatrix[10]['play'] = function(){audiogenerator['chimes'].playnote(52,0.1,0.1);};
    seqmatrix[11]['play'] = function(){audiogenerator['chimes'].playnote(50,0.1,0.1);};
    seqmatrix[12]['play'] = function(){audiogenerator['chimes'].playnote(48,0.1,0.1);};
    seqmatrix[13]['play'] = function(){audiogenerator['chimes'].playnote(47,0.1,0.1);};
    seqmatrix[14]['play'] = function(){audiogenerator['chimes'].playnote(45,0.1,0.1);};
    seqmatrix[15]['play'] = function(){audiogenerator['chimes'].playnote(43,0.1,0.1);};
    
    $('button#reset').click(function(){
        
        for(var i = 0; i < 16; i++){
        
            for(var j = 0; j < 16; j++){
            
                seqmatrix[i][j] = 0;
                
            }
            
        }
        
    });
    
    $('button#preset').click(function(){
        
        for(var i = 0; i < 16; i++){
        
            for(var j = 0; j < 16; j++){
            
                seqmatrix[i][j] = 0;
                
            }
            
        }
        
        seqmatrix[1][0] = 1;
        seqmatrix[1][4] = 1;
        seqmatrix[1][8] = 1;
        seqmatrix[1][12] = 1;
        seqmatrix[2][4] = 1;
        seqmatrix[2][12] = 1;
        seqmatrix[5][12] = 1;
        seqmatrix[6][14] = 1;
        seqmatrix[8][8] = 1;
        seqmatrix[8][12] = 1;
        seqmatrix[8][14] = 1;
        seqmatrix[10][2] = 1;
        seqmatrix[10][6] = 1;
        seqmatrix[10][8] = 1;
        seqmatrix[10][12] = 1;
        seqmatrix[10][14] = 1;
        seqmatrix[12][2] = 1;
        seqmatrix[12][6] = 1;
        seqmatrix[12][15] = 1;
        seqmatrix[13][4] = 1;
        seqmatrix[13][8] = 1;
        
    });
       
    var bpm = 120;
    
    var cursor = 0;
    
    var inc = 0;
    
    var starttime = 0;
    
    var nowtime = 0;
    
    var targettime = 0;
    
    function SeqCallback(){
        
        var elapsed = 0;
        
        nowtime = (new Date()).getTime();
        
        elapsed = nowtime-starttime;
        
        targettime = (1000*60/bpm)/4;
        
        if(elapsed > targettime || (targettime - elapsed) < 5 ){
            
            starttime = nowtime;
        
            for(var i = 1; i < 16; i++){
        
                if(seqmatrix[i][cursor] == 1) seqmatrix[i]['play']();
        
            }
    
            cursor = cursor + 1;
    
            while(cursor>=16) cursor = cursor - 16;
        
        }
    
        setTimeout(SeqCallback,5);
        
    }
    
    if($('#seqcanvas').length>0) SeqCallback();
    
    // --- //
    
    if($('#seqcanvas').length>0) $('#seqcanvas').mousemove(function(e){

        var left = $('#seqcanvas').position().left;
        
        var top = $('#seqcanvas').position().top;

        var x = e.pageX - left;
        var y = e.pageY - top;
        
        if(x<0) x = 0;
        if(x>canvaswidth) x = canvaswidth-1;
        if(y<0) y = 0;
        if(y>canvasheight) x = canvasheight-1;
        
        mousex = x;
        mousey = y;

    });
    
    if($('#seqcanvas').length>0) $('#seqcanvas').click(function(){
        
        for(var i = 0; i < 16; i++){
            
            for(var j = 1; j < 16; j++){
                
                if(mousex > i*300/16 && mousey > j*300/16 && mousex < (i+1)*300/16 && mousey < (j+1)*300/16){
                    
                    if(seqmatrix[j][i] == 1){
                        
                        seqmatrix[j][i] = 0;
                        
                    } else {
                        
                        seqmatrix[j][i] = 1;
                        
                    }
                    
                }
                
            }
            
        }
        
    });
    
    // --- //
    
    function SeqDrawCallback(){
        
        var canvas = document.getElementById('seqcanvas');
        
        var context = canvas.getContext('2d');
    
        var w = 300;
        
        var h = 300;
        
        var aw = 400;
        
        context.fillStyle = 'rgb(34,34,34)';
        
        context.fillRect(0,0,aw,h );
        
        context.fillStyle = 'rgb(255,255,255)';

        context.strokeStyle = 'rgb(64,64,64)';
        
        context.lineWidth = 3;
        
        for(var i = 0; i < 16; i++){
            
            if(cursor==i){
                
                seqmatrix[0][i] = 1;
                
            } else {
                
                seqmatrix[0][i] = 0;
                
            }
            
        }
        
        for(var i = 0; i < 16; i++){
            
            for(var j = 0; j < 16; j++){
            
                displaymatrix[i][j] = displaymatrix[i][j]*2/3;
                
                if(displaymatrix[i][j]<0.01) displaymatrix[i][j] = 0;
                
                if(seqmatrix[i][j] == 1) displaymatrix[i][j] = 1;
            
            }
            
        }
        
        for(var i = 0; i < 16; i++){
            
            for(var j = 0; j < 16; j++){
                
                context.fillStyle = 'rgba(255,255,255,' + (displaymatrix[j][i]) + ')';
                
                context.strokeStyle = 'rgba(64,64,64,' + (displaymatrix[j][i]) + ')';

                context.strokeRect(i*w/16+2,j*h/16+2,w/16-4,h/16-4);
                
                context.fillRect(i*w/16+2,j*h/16+2,w/16-4,h/16-4);
                
            }
            
        }
        
        context.lineWidth = 2;
        
        context.fillStyle = 'rgb(255,255,255)';
        
        context.textBaseline = 'top';
        
        context.font = '10pt Arial';
        
        for(var i = 0; i < 16; i++ ){
            
            context.strokeStyle = 'rgb(64,64,64)';
            
            context.strokeText(seqmatrix[i]['name'],310,i*h/16+2,80);
            
            context.fillText(seqmatrix[i]['name'],310,i*h/16+2,80);
            
        }
        
        if(canvas && context) setTimeout(SeqDrawCallback,1000/30);
        
    }
    
    if($('#seqcanvas').length>0) SeqDrawCallback();
    
    
    
    // ---- //
    
    $('div.cat').hide();
    
    $('h1.category').click(
        
        function(){
            
            if( $(this).parent().find('div.cat').is(':hidden') ){
                
                $(this).parent().parent().find('div.cat').hide(100);
                
                $(this).parent().find('div.cat').show(100);
                
            } else {
                
                $(this).parent().find('div.cat').hide(100);
                
            }
            
        }
        
    );
        
    $('canvas#headercanvas').click( HeaderReset );
    
    $('.audio').each(function(index,value){
        
    	var audio_file = $(this).attr('href'); 

        $(this).attr('id','audioplayer_'+index);

        AudioPlayer.embed('audioplayer_'+index, {soundFile: audio_file});

    });
    
}

$(document).ready(OnReady);
