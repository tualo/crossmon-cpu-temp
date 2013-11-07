var pc = require('./pc');



function monitor(socket,config){
	//console.log(arguments);
	if (typeof config['scale']=='undefined'){
		config['scale'] = 1;
	}
	scale = config['scale'];
	if (process.platform=='darwin'){
		pc('osx-cpu-temp')
		.exec(function (err,str,str_err){
			if (err){
			
			}else{
				var timestamp = Math.round(new Date().getTime()); // JS Timestamp
				var temp = parseFloat( str.replace(/[^1-9\.]/g,'') );
				var item = { 
						program: 'cpu-temperature',
						tag: 'cpu-temperature',
						time: timestamp,
						value: temp
					};
					socket.emit('put', item);
			}
		});
	}
	if (process.platform=='linux'){
		pc('senors')
		.exec(function (err,str,str_err){
			if (err){
			
			}else{
				var timestamp = Math.round(new Date().getTime()); // JS Timestamp
				var lines = str.split("\n");
				for(var li in lines){
					for(var i in config.watch){
						if (lines[li].indexOf(config.watch[i].indexOf)==0){
							var t = lines[li].indexOf('°');
							var st = lines[li].substring(config.watch[i].indexOf.length,t-config.watch[i].indexOf.length);
							var temp = parseFloat( st.replace(/[^1-9\.]/g,'') );
							var item = { 
								program: 'cpu-temperature',
								tag: 'cpu-temperature',
								time: timestamp,
								value: temp
							};
							socket.emit('put', item);
						}
					}
				}
				
				
			}
		});
	}
}

function parsePS(output) {
  var lines = output.trim().split('\n');
   
  var labelsMap = {};
  var labels = lines[0].trim().split(/[ \t]+/g);
	for (var i = 0; i < labels.length; i++){
    labelsMap[labels[i]] = i;
	}

	var list = [];
	 
	for(var i=1; i<lines.length;i++){
		var values = lines[i].trim().split(/[ \t]+/g);
	
		var foundPID = parseInt(values[labelsMap['PID']], 10);
		var rss = 1024 * parseInt(values[labelsMap['RSS']], 10);
		var cpu = parseFloat( values[labelsMap['%CPU']].replace(/,/g,".") );
		var command = values[labelsMap['COMMAND']];
		var vi = labelsMap['COMMAND']+1;
		while(vi<values.length){
			command+=' '+values[vi];
			vi++;
		}
	
		list.push({ command: command,memory: rss, cpu: cpu });
	}
	return list;
}

module.exports.monitor=monitor;