

function bien(x){

	$.ajax({
		url:"/bien",
		type:"POST",
		data:{id:x},
		success:function(e){
			console.log(e);
			// if(e.err){
   //         $("#result").text(e.data);
   //         if(e.r){
   //         	setTimeout(function(){
   //         		location.href="/Misdatos";
   //         	},1500);
   //         }
   //       console.log(e);
			// }
		}
	});


}
function mal(x){

	$.ajax({
		url:"/mal",
		type:"POST",
		data:{id:x},
		success:function(e){
			console.log(e);
			// if(e.err){
   //         $("#result").text(e.data);
   //         if(e.r){
   //         	setTimeout(function(){
   //         		location.href="/Misdatos";
   //         	},1500);
   //         }
   //       console.log(e);
			// }
		}
	});


}

var count=-1;
function lista(){

	$.ajax({
		url:"/listanew",
		type:"GET",
		success:function(e){
			console.log(e);
          
            let html=``;
  if(e.length ==0){
      count=-1;
            $(".container-avisos").html("")
  	return;
  }
            if(count == e.length){return;}

            count=e.length;

            for(let i=0;e.length>i;i++){
            	let is =` <div class="avisos">
                        <div class="avisos-A">
                            <span><strong>Categoria</strong></span>
                             <p style="margin-top: 5px;font-size: 23px;margin-bottom: 5px;"><strong>${e[i].asunto}</strong></p>
                             <p class="m">${e[i].descri}</p>

                             <div class="check-a" >
                                 <div><img onclick="bien(${e[i].id})" src="img/icon.png" alt=""></div>
                                 <div><img onclick="mal(${e[i].id})" src="img/Group.png" alt=""></div>
                             </div>

                        </div>
                         <div class="avisos-b">
                             <center>
                             <div style="width: 100%;height: 60%">
                                 <img width="90" height="90" src="data:image/png;base64,${e[i].fotos}" alt="">
                             </div>
                             <br>
                             <br>

                             <p class="m">+1 Imagen</p>

                         </center>
                         </div>
                         
                     </div>`;
                     html+=is;


            }

            $(".container-avisos").html(html)


			
			// if(e.err){
   //         $("#result").text(e.data);
   //         if(e.r){
   //         	setTimeout(function(){
   //         		location.href="/Misdatos";
   //         	},1500);
   //         }
   //       console.log(e);
			// }
		}
	});


}

function listatimeline(x,callback){

	$.ajax({
		url:"/listatimeline",
		type:"POST",
		data:{id:x},
		success:function(e){
			console.log(e);
			// if(e.err){
   //         $("#result").text(e.data);
   //         if(e.r){
   //         	setTimeout(function(){
   //         		location.href="/Misdatos";
   //         	},1500);
   //         }
   //       console.log(e);
			// }
		}
	});


}


setInterval(function(){
lista()
},1000)
