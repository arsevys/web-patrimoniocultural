function listTime(x){

console.log($("#infoss")[0]);
let html=``;
	$.ajax({
		url:"/listatimeline",
		type:"POST",
		data:{id:ides},
		success:function(e){
			console.log(e);


			 for(let i=0;e.length>i;i++){
            	let is =` <div class="c1">
                                <center>
                                <img style="padding-left: 70%;" src="img/group2.png" alt="">
                                </center> 
                            </div>
                            <div class="c2">
                           
                                <center>
                                <p> Asunto : <strong>${e[i].asunto}</strong> <br>

                                ${e[i].descri}</p>
                                </center>
                            </div>
                            <div class="c3">
                                <center>
                                <img width="80" height="80" src="data:image/png;base64,${e[i].fotos}" alt="">
                                </center>
                            </div>`;
                     html+=is;


            }

            console.log($(".line"),html)

            $(".line").html(html)
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

listTime();